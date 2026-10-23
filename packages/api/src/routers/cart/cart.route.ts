import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { CartService } from "../../services/CartService";
import { AddItemSchema, UpdateQuantitySchema } from "@ecommerceNextjs/types";
import type { HonoEnv } from "../../context.js";

export const cart = new Hono<HonoEnv>()

  /**
   * Middleware: Ensure User is Logged In
   * We check if 'user' was set in context by the global auth middleware
   */

  .use(authMiddleware)

  /**
   * GET /
   * Fetch the current user's cart
   */
  .get("/", async (c) => {
    const user = c.get("user");
    const cartService = c.get("cartService") as CartService;
    const cart = await cartService.getCart(user.id);

    // If no cart exists yet, return empty structure instead of null for easier frontend handling
    if (!cart) {
      return c.json({
        success: true,
        data: { id: null, items: [], subtotal: 0, totalItems: 0 },
      });
    }

    return c.json({ success: true, data: cart });
  })

  /**
   * POST /
   * Add item to cart
   */
  .post("/", zValidator("json", AddItemSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");
    const cartService = c.get("cartService") as CartService;

    const result = await cartService.addItem(user.id, input);
    return c.json({ success: true, data: result });
  })

  /**
   * PUT /:itemId
   * Update item quantity
   */
  .put("/:productId", zValidator("json", UpdateQuantitySchema), async (c) => {
    const user = c.get("user");
    const itemId = c.req.param("productId");
    const { quantity } = c.req.valid("json");
    const cartService = c.get("cartService") as CartService;

    const result = await cartService.updateQuantity(user.id, itemId, quantity);
    return c.json({ success: true, data: result });
  })

  /**
   * DELETE /:itemId
   * Remove a specific item
   */
  .delete("/:productId", async (c) => {
    const user = c.get("user");
    const itemId = c.req.param("productId");
    const cartService = c.get("cartService") as CartService;

    await cartService.removeItem(user.id, itemId);
    return c.json({ success: true, message: "Item removed" });
  })

  /**
   * DELETE /
   * Clear the entire cart
   */
  .delete("/", async (c) => {
    const user = c.get("user");
    const cartService = c.get("cartService") as CartService;

    await cartService.clearCart(user.id);
    return c.json({ success: true, message: "Cart cleared" });
  });
