import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/hono-client";

// export type ProductFilters = z.infer<typeof ProductFilterSchema>;

export type ProductFilters = {
  page: number;
  limit: number;
  sort: "newest" | "rating" | "price_asc" | "price_desc";
  minPrice: number;
  maxPrice: number;
  categories: string[]; // 👈 NOT optional
  materials: string[];
  colors: string[];
  search?: string;
  onSale?: boolean;
  inStock?: boolean;
  rating?: number;
};
// 2. Constants

const $getProductsList = client.product.$get;
const $getProductDetail = client.product[":slug"].$get;
const $getProductFilter = client.product.filters.$get;

export type GetProductListRequest = InferRequestType<typeof $getProductsList>;
export type GetProductsListResponse = InferResponseType<typeof $getProductsList>;
export type ProductSingleResponse = GetProductsListResponse["data"]["items"][number];

export type ProductDetailResponse = InferResponseType<typeof $getProductDetail>;

export type FilterOptionsResponse = InferResponseType<typeof $getProductFilter>["data"];

export type Filters = GetProductListRequest["query"];

export const INITIAL_FILTERS: ProductFilters = {
  page: 1,
  limit: 12,
  sort: "newest",
  minPrice: 0,
  maxPrice: 100000,
  categories: [],
  materials: [],
  colors: [],
  search: undefined,
  onSale: undefined,
  inStock: undefined,
  rating: undefined,
};

export type GetProductListResponseWithOnlyData = Pick<GetProductsListResponse, "data">;
