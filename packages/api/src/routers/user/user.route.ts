import { UpdateProfileSchema } from "@ecommerceNextjs/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { serviceMiddleware } from "../../middlewares/service.middleware.js";
import type { HonoEnv } from "../../context.js";
import type { UserService } from "../../services/UserService.js";

export const user = new Hono<HonoEnv>()

  /**
   * Middleware: Auth Guard & Service Injection
   * All user routes require login and UserService
   */
  .use(authMiddleware)
  .use(serviceMiddleware)

  /**
   * GET /me
   * Get current user profile with dashboard stats
   */
  .get("/me", async (c) => {
    const sessionUser = c.get("user");
    const userService = c.get("userService") as UserService;

    const profile = await userService.getProfile(sessionUser.id);

    return c.json({ success: true, data: profile });
  })

  /**
   * PUT /me
   * Update profile details
   */
  .put("/me", zValidator("json", UpdateProfileSchema), async (c) => {
    const sessionUser = c.get("user");
    const userService = c.get("userService") as UserService;
    const input = c.req.valid("json");

    const updatedUser = await userService.updateProfile(sessionUser.id, input);
    return c.json({ success: true, data: updatedUser });
  });
