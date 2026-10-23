import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { AddressService } from "../../services/AddressService";
import { AddressSchema, UpdateAddressSchema } from "@ecommerceNextjs/types";
import type { HonoEnv } from "../../context.js";

export const address = new Hono<HonoEnv>()

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
   * List Addresses
   */
  .get("/", async (c) => {
    const user = c.get("user");
    const addressService = c.get("addressService") as AddressService;
    const addresses = await addressService.list(user.id);
    return c.json({ success: true, data: addresses });
  })

  /**
   * POST /
   * Create Address
   */
  .post("/", zValidator("json", AddressSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");
    const addressService = c.get("addressService") as AddressService;

    const result = await addressService.create(user.id, input);
    return c.json({ success: true, data: result });
  })

  /**
   * PUT /:id
   * Update Address
   */
  .put("/:id", zValidator("json", UpdateAddressSchema), async (c) => {
    const user = c.get("user");
    const addressId = c.req.param("id");
    const input = c.req.valid("json");
    const addressService = c.get("addressService") as AddressService;

    const result = await addressService.update(user.id, addressId, input);
    return c.json({ success: true, data: result });
  })

  /**
   * PUT /:id/default
   * Set as Default
   */
  .put("/:id/default", async (c) => {
    const user = c.get("user");
    const addressId = c.req.param("id");
    const addressService = c.get("addressService") as AddressService;

    const result = await addressService.setDefault(user.id, addressId);
    return c.json({ success: true, data: result });
  })

  /**
   * DELETE /:id
   * Delete Address
   */
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const addressId = c.req.param("id");
    const addressService = c.get("addressService") as AddressService;

    await addressService.delete(user.id, addressId);
    return c.json({ success: true, message: "Address deleted" });
  });
