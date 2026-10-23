import type { Session } from "@ecommerceNextjs/auth";

import type { UserService } from "./services/UserService.js";
import type { ProductService } from "./services/ProductService.js";
import type { CartService } from "./services/CartService.js";
import type { OrderService } from "./services/OrderService.js";
import type { ReviewService } from "./services/ReviewService.js";
import type { AddressService } from "./services/AddressService.js";
import type { WishlistService } from "./services/WishlistService.js";
import type { DIContainer } from "./di/container.js";

// Define the Hono Environment Type
export type HonoEnv = {
  Variables: {
    user: Session["user"];
    session: Session["session"];
    userService: UserService;
    productService: ProductService;
    cartService: CartService;
    orderService: OrderService;
    reviewService: ReviewService;
    addressService: AddressService;
    wishlistService: WishlistService;
    container: DIContainer;
  };
};
