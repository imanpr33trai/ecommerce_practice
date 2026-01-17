import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { orderQueries } from "./order.query";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  UpdatePaymentStatusSchema,
} from "./order.types";
import type { HonoEnv } from "../../context";

export const order = new Hono<HonoEnv>()

  /**
   * Middleware: Auth Guard
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
   * List my orders
   */
  .get("/", async (c) => {
    const user = c.get("user");
    const orders = await orderQueries.listByUser(user.id);
    return c.json({ success: true, data: orders });
  })

  /**
   * GET /:id
   * Get single order details
   */
  .get("/:id", async (c) => {
    const user = c.get("user");
    const orderId = c.req.param("id");

    try {
      const order = await orderQueries.getById(user.id, orderId);
      if (!order) {
        return c.json({ success: false, error: "Order not found" }, 404);
      }

      return c.json({ success: true, data: order });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 403);
    }
  })

  /**
   * POST /
   * Create Order (Checkout)
   */
  .post("/", zValidator("json", CreateOrderSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");

    try {
      const order = await orderQueries.createFromCart(user.id, input);
      return c.json({ success: true, data: order });
    } catch (error: any) {
      // Handle Stock Errors vs others
      const status = error.message.includes("stock") ? 409 : 400;
      return c.json({ success: false, error: error.message }, status);
    }
  })

  // --- ADMIN ROUTES (Optional: Add Role Guard) ---

  /**
   * PATCH /:id/status
   * Update Order Status
   */
  .patch("/:id/status", zValidator("json", UpdateOrderStatusSchema), async (c) => {
    const orderId = c.req.param("id");
    const { status } = c.req.valid("json");

    // Add logic here: if (user.role !== 'ADMIN') return 403

    const result = await orderQueries.updateStatus(orderId, status);
    return c.json({ success: true, data: result });
  })

  /**
   * PATCH /:id/payment
   * Update Payment Status
   */
  .patch("/:id/payment", zValidator("json", UpdatePaymentStatusSchema), async (c) => {
    const orderId = c.req.param("id");
    const { status } = c.req.valid("json");

    // Add logic here: if (user.role !== 'ADMIN') return 403

    const result = await orderQueries.updatePaymentStatus(orderId, status);
    return c.json({ success: true, data: result });
  });
