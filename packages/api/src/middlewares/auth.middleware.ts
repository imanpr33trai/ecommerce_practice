import type { Context, Next } from "hono";

import { auth } from "@ecomerceNextjs/auth";
import { HTTPException } from "hono/http-exception";

import type { HonoEnv } from "../context";

/**
 * Authentication Middleware
 * Validates session and populates user context
 *
 * @example
 * ```ts
 * app.use("/protected/*", authMiddleware())
 * ```
 */
export async function authMiddleware(c: Context<HonoEnv>, next: Next) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    // Set typed user and session in context
    c.set("user", session.user);
    c.set("session", session.session);

    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("[AuthMiddleware Error]:", error);
    }

    throw new HTTPException(401, {
      message: "Authentication failed",
    });
  }
}

/**
 * Optional Auth Middleware
 * Does not throw if no session, just sets user to undefined
 *
 * @example
 * ```ts
 * app.use("/public-with-user/*", optionalAuthMiddleware())
 * ```
 */
export async function optionalAuthMiddleware(c: Context<HonoEnv>, next: Next) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (session) {
      c.set("user", session.user);
      c.set("session", session.session);
    }
  } catch (error) {
    // Silently fail - optional auth
    if (process.env.NODE_ENV === "development") {
      console.warn("[OptionalAuthMiddleware]: Failed to get session");
    }
  }

  await next();
}
