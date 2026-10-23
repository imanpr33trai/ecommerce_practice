import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { OrderService } from "../../services/OrderService";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  UpdatePaymentStatusSchema,
} from "@ecommerceNextjs/types";
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
    const orderService = c.get("orderService") as OrderService;
    const orders = await orderService.listByUser(user.id);
    return c.json({ success: true, data: orders });
  })

  /**
   * GET /:id
   * Get single order details
   */
  .get("/:id", async (c) => {
    const user = c.get("user");
    const orderId = c.req.param("id");
    const orderService = c.get("orderService") as OrderService;

    const order = await orderService.getById(user.id, orderId);
    return c.json({ success: true, data: order });
  })

  /**
   * POST /
   * Create Order (Checkout)
   */
  .post("/", zValidator("json", CreateOrderSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");
    const orderService = c.get("orderService") as OrderService;

    const order = await orderService.createFromCart(user.id, input);
    return c.json({ success: true, data: order });
  })

  // --- ADMIN ROUTES (Optional: Add Role Guard) ---

  /**
   * PATCH /:id/status
   * Update Order Status
   */
  .patch("/:id/status", zValidator("json", UpdateOrderStatusSchema), async (c) => {
    const orderId = c.req.param("id");
    const { status } = c.req.valid("json");
    const orderService = c.get("orderService") as OrderService;

    // Add logic here: if (user.role !== 'ADMIN') return 403

    const result = await orderService.updateStatus(orderId, status);
    return c.json({ success: true, data: result });
  })

  /**
   * PATCH /:id/payment
   * Update Payment Status
   */
  .patch("/:id/payment", zValidator("json", UpdatePaymentStatusSchema), async (c) => {
    const orderId = c.req.param("id");
    const { status } = c.req.valid("json");
    const orderService = c.get("orderService") as OrderService;

    // Add logic here: if (user.role !== 'ADMIN') return 403

    const result = await orderService.updatePaymentStatus(orderId, status);
    return c.json({ success: true, data: result });
  });
