import { Hono } from "hono";

import type { HonoEnv } from "./context";

import { address } from "./routers/address/address.route";
import { cart } from "./routers/cart/cart.route";
import { order } from "./routers/order/order.route";
import { product } from "./routers/product/product.route";
import { review } from "./routers/review/review.route";
import { user } from "./routers/user/user.route";
import { wish } from "./routers/wish/wish.route";
import { errorHandler } from "./utils/error-handler";

export * from "./context";

// export * from "./client";

// Re-export middlewares for convenience
export { authMiddleware, optionalAuthMiddleware } from "./middlewares/auth.middleware";
export { rateLimit } from "./middlewares/rate-limit.middleware";

export const api = new Hono<HonoEnv>().onError(errorHandler);

// 📦 Routes
const routes = api
  .route("/cart", cart)
  .route("/review", review)
  .route("/address", address)
  .route("/product", product)
  .route("/wish", wish)
  .route("/user", user)
  .route("/order", order)
  // Health check endpoint
  .get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// Export RPC types for frontend
// export type { InferResponse, InferRequestBody, InferQuery } from "./client";

// Export route types
export type AppType = typeof routes;
export type ProductType = typeof product;
export type CartType = typeof cart;
export type UserType = typeof user;
export type OrderType = typeof order;
