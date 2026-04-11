import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { HonoEnv } from "../../context.js"; // Adjust path

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { wishQueries } from "./wish.query.js";
import { ToggleWishSchema } from "./wish.type.js";
import { ValidationError } from "../../utils/errors.js";

export const wish = new Hono<HonoEnv>()

  /**
   * Middleware: Auth Guard
   * All wishlist routes require login
   */
  .use(authMiddleware)

  /**
   * GET /
   * List full wishlist items
   */
  .get("/", async (c) => {
    const user = c.get("user");
    const wishlist = await wishQueries.getAll(user.id);
    return c.json({ success: true, data: wishlist });
  })
  /**
   * GET /ids
   * List just the IDs (for UI state)
   */
  .get("/ids", async (c) => {
    const user = c.get("user");
    const ids = await wishQueries.getIds(user.id);

    c.header("Cache-Control", "private,max-age=60");

    return c.json({ success: true, data: ids });
  })

  /**
   * POST /toggle
   * Add/Remove item
   */
  .post("/toggle", zValidator("json", ToggleWishSchema), async (c) => {
    const user = c.get("user");
    const { productId } = c.req.valid("json");

    try {
      const result = await wishQueries.toggle(user.id, productId);
      return c.json({ success: true, data: result });
    } catch (error) {
      throw new ValidationError(
        error instanceof Error ? error.message : "Failed to toggle wish"
      );
    }
  })

  /**
   * DELETE /
   * Clear all items
   */
  .delete("/", async (c) => {
    const user = c.get("user");

    await wishQueries.clear(user.id);

    return c.json({ success: true, message: "Wishlist cleared" });
  });
