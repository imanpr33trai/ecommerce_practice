import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { productQueries } from "./product.query";
import { ProductFilterSchema, SuggestionSchema } from "./product.type";
import type { HonoEnv } from "../../context.js";

export const product = new Hono<HonoEnv>()

  /**
   * GET /
   * List products with filtering
   */
  .get("/", zValidator("query", ProductFilterSchema), async (c) => {
    // 1. Get Validated Input
    const filters = c.req.valid("query");

    // 2. Call Query Layer
    const result = await productQueries.getProducts(filters);

    // 3. Return JSON
    return c.json({
      success: true,
      data: result,
    });
  })

  /**
   * GET /filters
   * Get available filter options (facets)
   */
  .get("/filters", async (c) => {
    const result = await productQueries.getFilterOptions();

    return c.json({
      success: true,
      data: result,
    });
  })

  /**
   * GET /suggestions
   * Search Autocomplete
   * ⚠️ MUST BE DEFINED BEFORE /:slug
   */
  .get("/suggestions", zValidator("query", SuggestionSchema), async (c) => {
    const { query } = c.req.valid("query");
    const result = await productQueries.getSuggestions(query);
    return c.json({ success: true, data: result });
  })

  /**
   * GET /:slug
   * Get Single Product Detail
   */
  .get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const result = await productQueries.getBySlug(slug);

    if (!result) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }

    return c.json({ success: true, data: result });
  });
