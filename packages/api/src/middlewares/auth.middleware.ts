import type { HonoEnv } from "@ecomerceNextjs/api/context";
import { auth } from "@ecomerceNextjs/auth";
import type { Context, Next } from "hono";

// Middleware to populate context
export async function authMiddleware(c: Context<HonoEnv>, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }
  console.log("USER:", session.user.id);

  // Set user for subsequent handlers
  c.set("user", session.user);
  c.set("session", session.session);

  await next();
}
