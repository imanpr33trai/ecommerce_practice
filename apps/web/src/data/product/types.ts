import { ProductFilterSchema } from "@ecomerceNextjs/api/routers/product/product.type";
import type { ClientResponse, InferRequestType, InferResponseType } from "hono/client";
import type { z } from "zod";

import { client } from "@/lib/hono-client";

export type ProductFilters = z.infer<typeof ProductFilterSchema>;

// 2. Constants
export const INITIAL_FILTERS: ProductFilters = ProductFilterSchema.parse({});

const $getProductsList = client.api.product.$get;
const $getProductDetail = client.api.product[":slug"].$get;
const $getProductFilter = client.api.product.filters.$get;

export type GetProductListRequest = InferRequestType<typeof $getProductsList>;
export type GetProductsListResponse = InferResponseType<typeof $getProductsList>;
export type ProductSingleResponse = GetProductsListResponse["data"]["items"][number];

export type ProductDetailResponse = InferResponseType<typeof $getProductDetail>;

export type FilterOptionsResponse = InferResponseType<typeof $getProductFilter>;

export * from "@ecomerceNextjs/api/routers/product/product.type";
