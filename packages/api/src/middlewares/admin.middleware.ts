import type { Context, Next } from "hono";

import { HTTPException } from "hono/http-exception";

import type { HonoEnv } from "../context";

/**
 * Admin Middleware
 * Validates that the authenticated user has admin privileges
 * Must be used AFTER authMiddleware (relies on c.get("user"))
 *
 * @example
 * ```ts
 * app.use("/admin/*", authMiddleware(), adminMiddleware())
 * ```
 */
export async function adminMiddleware(c: Context<HonoEnv>, next: Next) {
  const user = c.get("user");

  if (!user) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  // Check for admin role - supports both role-based and boolean admin flags
  const isAdmin =
    (user as unknown as { role?: string }).role === "ADMIN" ||
    (user as unknown as { isAdmin?: boolean }).isAdmin === true;

  if (!isAdmin) {
    throw new HTTPException(403, {
      message: "Forbidden - Admin access required",
    });
  }

  await next();
}