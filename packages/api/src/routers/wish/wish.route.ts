import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { wishQueries } from "./wish.query";
import { ToggleWishSchema } from "./wish.type";
import type { HonoEnv } from "../../context"; // Adjust path

export const wish = new Hono<HonoEnv>()

  /**
   * Middleware: Auth Guard
   * All wishlist routes require login
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
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 400);
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
