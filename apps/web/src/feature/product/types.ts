import { z } from "zod";

import type { RouterOutputs } from "@/trpc/client";

// 1. Zod Schema
export const ProductFilterSchema = z.object({
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
  minPrice: z.number().min(0).default(0),
  maxPrice: z.number().min(0).default(3000),
  inStock: z.boolean().default(false),
  onSale: z.boolean().default(false),

  // Arrays for multi-select
  categories: z.array(z.string()).default([]), // Stores Slugs or Names
  materials: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),

  // Rating is nullable in your state, optional in Zod
  rating: z.number().nullable().optional(),
});

export type ProductFilters = z.infer<typeof ProductFilterSchema>;

// 2. The Robust Initial State Constant
export const INITIAL_PRODUCT_FILTERS: ProductFilters = {
  sort: "newest",
  minPrice: 0,
  maxPrice: 3000,
  inStock: false,
  onSale: false,
  categories: [],
  materials: [],
  colors: [],
  rating: null,
};

// 1. Zod Schema (Matches Backend Input)
// We use this for form validation in the Sidebar

// 2. Inferred Types for State

// 3. API Output Types (For Components)
// "What does the list endpoint return?" -> { items: [], pagination: {} }
export type ProductListGrid = RouterOutputs["product"]["list"];

// "What does a single product look like in the grid?"
export type ProductSingle = ProductListGrid["items"][number];
export type ProductGetBySlug = RouterOutputs["product"]["getBySlug"];
export type ProductLanding = RouterOutputs["product"]["getLandingProducts"];
export type ProductLandingSingle = ProductLanding[number];
// "What does the Detail Page need?"
// export const ProductFilterSchema = z.object({
//   categorySlug: z.string().optional(),
//   brands: z.array(z.string()).default([]),
//   priceMin: z.number().min(0).optional(),
//   priceMax: z.number().min(0).optional(),
//   search: z.string().optional(),
//   sort: z.enum(["price_asc", "price_desc", "latest", "relevance"]).default("latest"),
//   page: z.number().min(1).default(1),
//   limit: z.number().min(1).max(100).default(20),
// });
