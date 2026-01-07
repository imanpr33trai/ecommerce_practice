import { auth } from "@ecomerceNextjs/auth";
import { createMiddleware } from "hono/factory";
import type { HonoEnv } from "@ecomerceNextjs/api/context";

export const authMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});
