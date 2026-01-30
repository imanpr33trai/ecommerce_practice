import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { addressQueries } from "./address.query.js";
import { AddressSchema, UpdateAddressSchema } from "./address.type.js";
import type { HonoEnv } from "../../context.js"; // Adjust path

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
    const addresses = await addressQueries.list(user.id);
    return c.json({ success: true, data: addresses });
  })

  /**
   * POST /
   * Create Address
   */
  .post("/", zValidator("json", AddressSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");

    const result = await addressQueries.create(user.id, input);
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

    try {
      const result = await addressQueries.update(user.id, addressId, input);
      return c.json({ success: true, data: result });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 403);
    }
  })

  /**
   * PUT /:id/default
   * Set as Default
   */
  .put("/:id/default", async (c) => {
    const user = c.get("user");
    const addressId = c.req.param("id");

    try {
      const result = await addressQueries.setDefault(user.id, addressId);
      return c.json({ success: true, data: result });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 403);
    }
  })

  /**
   * DELETE /:id
   * Delete Address
   */
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const addressId = c.req.param("id");

    try {
      await addressQueries.delete(user.id, addressId);
      return c.json({ success: true, message: "Address deleted" });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 403);
    }
  });
