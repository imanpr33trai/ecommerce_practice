import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { cartQueries } from "./cart.query";
import { AddItemSchema, UpdateQuantitySchema } from "./cart.type";
import type { HonoEnv } from "../../context"; // Adjust to your context path

export const cart = new Hono<HonoEnv>()

  /**
   * Middleware: Ensure User is Logged In
   * We check if 'user' was set in context by the global auth middleware
   */

  .use("*", async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    await next();
  })

  /**
   * GET /
   * Fetch the current user's cart
   */
  .get("/", async (c) => {
    const user = c.get("user");
    const cart = await cartQueries.getCart(user.id);

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
  .post("/",authMiddleware, zValidator("json", AddItemSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");

    try {
      const result = await cartQueries.addItem(user.id, input);
      return c.json({ success: true, data: result });
    } catch (error: any) {
      // Return 409 Conflict for Stock Issues, 404 for Product Not Found, etc.
      const status = error.message.includes("stock") ? 409 : 400;
      return c.json({ success: false, error: error.message }, status);
    }
  })

  /**
   * PUT /:itemId
   * Update item quantity
   */
  .put("/:productId",authMiddleware, zValidator("json", UpdateQuantitySchema), async (c) => {
    const user = c.get("user");
    const productId = c.req.param("productId");
    const { quantity } = c.req.valid("json");

    try {
      const result = await cartQueries.updateQuantity(user.id, productId, quantity);
      return c.json({ success: true, data: result });
    } catch (error: any) {
      // Handle Stock Errors (409 Conflict) vs Not Found (404/403)
      const status = error.message.includes("stock") ? 409 : 400;
      return c.json({ success: false, error: error.message }, status);
    }
  })

  /**
   * DELETE /:itemId
   * Remove a specific item
   */
  .delete("/:productId",authMiddleware, async (c) => {
    const user = c.get("user");
    const productId = c.req.param("productId");

    try {
      await cartQueries.removeItem(user.id, productId);
      return c.json({ success: true, message: "Item removed" });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 400);
    }
  })

  /**
   * DELETE /
   * Clear the entire cart
   */
  .delete("/", async (c) => {
    const user = c.get("user");

    try {
      await cartQueries.clearCart(user.id);
      return c.json({ success: true, message: "Cart cleared" });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
