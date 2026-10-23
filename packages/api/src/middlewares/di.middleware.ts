import type { Context, Next } from "hono";

import type { DIContainer } from "../di/container.js";
import type { HonoEnv } from "../context.js";

/**
 * Middleware to attach DI container to Hono context
 * Creates a request-scoped container for each request
 */
export function createDIMiddleware(container: DIContainer) {
  return async function diMiddleware(c: Context<HonoEnv>, next: Next) {
    // Create a request-scoped container
    const requestContainer = container.createRequestScope();

    // Attach container to context
    c.set("container", requestContainer);

    // Attach individual services for easy access in routers
    c.set("userService", requestContainer.userService);
    c.set("productService", requestContainer.productService);
    c.set("cartService", requestContainer.cartService);
    c.set("orderService", requestContainer.orderService);
    c.set("reviewService", requestContainer.reviewService);
    c.set("addressService", requestContainer.addressService);
    c.set("wishlistService", requestContainer.wishlistService);

    await next();
  };
}