import type { Context, Next } from "hono";

import type { HonoEnv } from "../context.js";
import type { UserService } from "../services/UserService.js";

/**
 * Middleware to inject UserService into the Hono context
 * Gets UserService from the DI container attached by diMiddleware
 */
export async function serviceMiddleware(c: Context<HonoEnv>, next: Next) {
  const userService = c.get("userService") as UserService;

  if (!userService) {
    throw new Error("UserService not found in context. Ensure diMiddleware runs before serviceMiddleware.");
  }

  // Re-set to ensure it's available (in case diMiddleware didn't run)
  c.set("userService", userService);

  await next();
}
