
import type { MiddlewareHandler } from "hono";

// Simple rate limiting implementation for Vercel
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (): MiddlewareHandler => {
  return async (c, next) => {
    if (process.env.NODE_ENV === "production") {
      const identifier = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
      const key = `rate-limit:${identifier}`;
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const maxRequests = 100;

      const current = rateLimitStore.get(key);

      if (!current || now > current.resetTime) {
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + windowMs,
        });
      } else {
        current.count++;

        if (current.count > maxRequests) {
          return c.json({ error: "Too many requests" }, 429);
        }
      }
    }

    await next();
  };
};
