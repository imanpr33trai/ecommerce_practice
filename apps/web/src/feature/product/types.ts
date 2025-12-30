import { ProductFilterSchema } from "@ecomerceNextjs/api/routers/product/product.type";
import type { z } from "zod";

import type { RouterOutputs } from "@/trpc/client";

export type ProductFilters = z.infer<typeof ProductFilterSchema>;

// 2. Constants
export const INITIAL_FILTERS: ProductFilters = ProductFilterSchema.parse({});

// 3. API Return Types
export type ProductListOutput = RouterOutputs["product"]["list"];
export type ProductSingle = ProductListOutput["items"][number];
export type ProductDetailOutput = NonNullable<RouterOutputs["product"]["getBySlug"]>;
export type FilterOptionsOutput = RouterOutputs["product"]["getFilters"];

export * from "@ecomerceNextjs/api/routers/product/product.type";
