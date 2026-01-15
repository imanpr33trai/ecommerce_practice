import { Hono } from "hono";

import { address } from "./routers/address/address.route";
import { cart } from "./routers/cart/cart.route";
import { order } from "./routers/order/order.route";
import { product } from "./routers/product/product.route";
import { review } from "./routers/review/review.route";
import { user } from "./routers/user/user.route";
import { wish } from "./routers/wish/wish.route";
import { errorHandler } from "./utils/error-handler";
import type { HonoEnv } from "./context";

export const api = new Hono<HonoEnv>()
  .onError(errorHandler)

  // 📦 Routes
  .route("/cart", cart)
  .route("/review", review)
  .route("/address", address)
  .route("/product", product)
  .route("/wish", wish)
  .route("/user", user)
  .route("/order", order);
