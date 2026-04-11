import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { HonoEnv } from "../../context.js"; // Adjust path

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { userQueries } from "./user.query.js";
import { UpdateProfileSchema } from "./user.types.js";
import { ConflictError, InternalError, ValidationError } from "../../utils/errors.js";

export const user = new Hono<HonoEnv>()

  /**
   * Middleware: Auth Guard
   * All user routes require login
   */
  .use(authMiddleware)

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
    } catch (error) {
      throw new InternalError(error instanceof Error ? error.message : "Failed to update profile");
    }
  });
