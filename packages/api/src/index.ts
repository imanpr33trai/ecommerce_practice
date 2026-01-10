import { Hono } from "hono";

import { address } from "./routers/address/address.route";
import { cart } from "./routers/cart/cart.route";
import { product } from "./routers/product/product.route";
import { review } from "./routers/review/review.route";
import type { HonoEnv } from "./context";

export const api = new Hono<HonoEnv>()

  // 📦 Routes
  .route("/cart", cart)
  .route("/review", review)
  .route("/address", address)
  .route("/product", product);
