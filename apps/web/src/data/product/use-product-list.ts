import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";

import {
    type GetProductListRequest,
    type GetProductsListResponse,
    type ProductFilters,
    productKeys,
} from "@/data/product";
import { client } from "@/lib/hono-client";
import { toQuery } from "@/lib/to-query";

export const fetchProducts = async (
  filters: GetProductListRequest["query"],
): Promise<GetProductsListResponse> => {
  const res = await client.product.$get({
    query: filters,
  });

  if (!res.ok) {
    throw new HTTPException(404, { message: "Failed to fetch filtered products" });
  }
  return await res.json();
};
/**
 * Hook: useList
 * Usage: /products page, Category pages
 * Features: Keeps previous data while loading new filters (no flicker)
 */
export const productListOptions = (filters: Partial<GetProductListRequest["query"]>) => {
  return queryOptions({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    enabled: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useProductListQuery = (filter: Partial<ProductFilters>) => {
  const query = toQuery<ProductFilters>(filter) as Partial<GetProductListRequest["query"]>;

  return useQuery(productListOptions(query));
};
