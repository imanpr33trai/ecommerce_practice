import { z } from "zod";

import type { RouterOutputs } from "@/trpc/client";

// 1. Zod Schema for Filters
export const ProductFilterSchema = z.object({
  categories: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),

  minPrice: z.number().default(0),
  maxPrice: z.number().default(10000),

  onSale: z.boolean().default(false),
  inStock: z.boolean().default(false),
  rating: z.number().nullable().optional(),
  search: z.string().optional(),

  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type ProductFilters = z.infer<typeof ProductFilterSchema>;

// 2. Constants
export const INITIAL_FILTERS: ProductFilters = ProductFilterSchema.parse({});

// 3. API Return Types
export type ProductListOutput = RouterOutputs["product"]["list"];
export type ProductSingle = ProductListOutput["items"][number];
export type ProductDetailOutput = NonNullable<RouterOutputs["product"]["getBySlug"]>;
export type FilterOptionsOutput = RouterOutputs["product"]["getFilters"];
