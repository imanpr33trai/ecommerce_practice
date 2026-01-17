import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { userQueries } from "./user.query";
import { UpdateProfileSchema } from "./user.types";
import type { HonoEnv } from "../../context"; // Adjust path

export const user = new Hono<HonoEnv>()

  /**
   * Middleware: Auth Guard
   * All user routes require login
   */
  .use(authMiddleware)
  // .use("*", async (c, next) => {
  //   const user = c.get("user");
  //   if (!user) {
  //     return c.json({ success: false, error: "Unauthorized" }, 401);
  //   }
  //   await next();
  // })

  /**
   * GET /me
   * Get current user profile with dashboard stats
   */
  .get("/me", async (c) => {
    const sessionUser = c.get("user");

    const profile = await userQueries.getProfile(sessionUser.id);

    if (!profile) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({ success: true, data: profile });
  })

  /**
   * PUT /me
   * Update profile details
   */
  .put("/me", zValidator("json", UpdateProfileSchema), async (c) => {
    const sessionUser = c.get("user");
    const input = c.req.valid("json");

    try {
      const updatedUser = await userQueries.updateProfile(sessionUser.id, input);
      return c.json({ success: true, data: updatedUser });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
