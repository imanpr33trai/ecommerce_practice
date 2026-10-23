import { auth } from "@ecommerceNextjs/auth";
import type { Context, Next } from "hono";

import { AppError } from "@ecommerceNextjs/types";
import type { HonoEnv } from "../context";

// Middleware to populate context
export async function authMiddleware(c: Context<HonoEnv>, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw AppError.unauthorized();
  }

  // Set user for subsequent handlers
  c.set("user", session.user);
  c.set("session", session.session);

  return await next();
}
