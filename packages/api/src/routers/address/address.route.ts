import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { HonoEnv } from "../../context.js"; // Adjust path

import { authMiddleware } from "../../middlewares/auth.middleware";
import { ForbiddenError } from "../../utils/errors";
import { addressQueries } from "./address.query.js";
import { AddressSchema, UpdateAddressSchema } from "./address.type.js";

export const address = new Hono<HonoEnv>()

  /**
   * Middleware: Auth Guard
   */
  .use(authMiddleware)

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
    } catch (error) {
      throw new ForbiddenError(error instanceof Error ? error.message : "Failed to update address");
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
    } catch (error) {
      throw new ForbiddenError(
        error instanceof Error ? error.message : "Failed to set default address",
      );
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
    } catch (error) {
      throw new ForbiddenError(error instanceof Error ? error.message : "Failed to delete address");
    }
  });
