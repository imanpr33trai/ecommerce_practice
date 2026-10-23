import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { AppError } from "@ecommerceNextjs/types";
import type { ProductService } from "../../services/ProductService";
import { ProductFilterSchema, SuggestionSchema } from "@ecommerceNextjs/types";
import type { HonoEnv } from "../../context.js";

export const product = new Hono<HonoEnv>()

  /**
   * GET /
   * List products with filtering
   */
  .get("/", zValidator("query", ProductFilterSchema), async (c) => {
    const filters = c.req.valid("query");
    const productService = c.get("productService") as ProductService;
    const result = await productService.getProducts(filters);
    return c.json({ success: true, data: result });
  })

  /**
   * GET /filters
   * Get available filter options (facets)
   */
  .get("/filters", async (c) => {
    const productService = c.get("productService") as ProductService;
    const result = await productService.getFilterOptions();
    return c.json({ success: true, data: result });
  })

  /**
   * GET /suggestions
   * Search Autocomplete
   * ⚠️ MUST BE DEFINED BEFORE /:slug
   */
  .get("/suggestions", zValidator("query", SuggestionSchema), async (c) => {
    const { query } = c.req.valid("query");
    const productService = c.get("productService") as ProductService;
    const result = await productService.getSuggestions({ query });
    return c.json({ success: true, data: result });
  })

  /**
   * GET /:slug
   * Get Single Product Detail
   */
  .get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const productService = c.get("productService") as ProductService;
    const result = await productService.getBySlug(slug);
    return c.json({ success: true, data: result });
  });
