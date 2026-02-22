import type { Context, Next } from "hono";

import { HTTPException } from "hono/http-exception";

import type { HonoEnv } from "../context";

/**
 * Rate Limiting Middleware
 * Prevents abuse and DDoS attacks
 *
 * Uses simple in-memory storage (for production, use Redis)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  skipFailedRequests?: boolean;
  keyGenerator?: (c: Context<HonoEnv>) => string;
}

export function rateLimit(options: RateLimitOptions = { maxRequests: 100, windowMs: 60000 }) {
  const { maxRequests, windowMs, skipFailedRequests = false, keyGenerator } = options;

  return async (c: Context<HonoEnv>, next: Next) => {
    // Generate key (IP address by default)
    const key = keyGenerator ? keyGenerator(c) : c.req.header("x-forwarded-for") || "unknown";

    const now = Date.now();
    const record = rateLimitStore.get(key);

    // Initialize or reset expired record
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
    } else {
      // Increment counter
      record.count++;

      // Check if limit exceeded
      if (record.count > maxRequests) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);

        c.header("X-RateLimit-Limit", maxRequests.toString());
        c.header("X-RateLimit-Remaining", "0");
        c.header("X-RateLimit-Reset", record.resetTime.toString());
        c.header("Retry-After", retryAfter.toString());

        throw new HTTPException(429, {
          message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        });
      }

      rateLimitStore.set(key, record);
    }

    // Set rate limit headers
    const current = rateLimitStore.get(key)!;
    c.header("X-RateLimit-Limit", maxRequests.toString());
    c.header("X-RateLimit-Remaining", Math.max(0, maxRequests - current.count).toString());
    c.header("X-RateLimit-Reset", current.resetTime.toString());

    await next();

    // Optionally skip failed requests
    if (skipFailedRequests && c.res.status >= 400) {
      const updated = rateLimitStore.get(key);
      if (updated) {
        updated.count = Math.max(0, updated.count - 1);
        rateLimitStore.set(key, updated);
      }
    }
  };
}

/**
 * Cleanup old entries periodically (prevent memory leak)
 * Run every minute
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);
