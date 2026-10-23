import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { WishlistService } from "../../services/WishlistService";
import { ToggleWishSchema } from "@ecommerceNextjs/types";
import type { HonoEnv } from "../../context.js";

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
    const wishlistService = c.get("wishlistService") as WishlistService;
    const wishlist = await wishlistService.getAll(user.id);
    return c.json({ success: true, data: wishlist });
  })
  /**
   * GET /ids
   * List just the IDs (for UI state)
   */
  .get("/ids", async (c) => {
    const user = c.get("user");
    const wishlistService = c.get("wishlistService") as WishlistService;
    const ids = await wishlistService.getIds(user.id);

    c.header("Cache-Control", "private,max-age=60");

    return c.json({ success: true, data: ids });
  })

  /**
   * POST /toggle
   * Add/Remove item
   */
  .post("/toggle", zValidator("json", ToggleWishSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");
    const wishlistService = c.get("wishlistService") as WishlistService;

    const result = await wishlistService.toggle(user.id, input);
    return c.json({ success: true, data: result });
  })

  /**
   * DELETE /
   * Clear all items
   */
  .delete("/", async (c) => {
    const user = c.get("user");
    const wishlistService = c.get("wishlistService") as WishlistService;

    await wishlistService.clear(user.id);

    return c.json({ success: true, message: "Wishlist cleared" });
  });
