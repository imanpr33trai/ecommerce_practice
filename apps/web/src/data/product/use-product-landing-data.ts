import { queryOptions, useSuspenseQuery, type QueryOptions } from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";

import {
  type GetProductListRequest,
  type ProductLandingResponse,
  productKeys,
} from "@/data/product";
import { client } from "@/lib/hono-client";

export const fetchProductLanding = async (
  filters: GetProductListRequest["query"],
): Promise<ProductLandingResponse> => {
  const res = await client.product.$get({
    query: filters,
  });

  if (!res.ok) {
    throw new HTTPException(404, { message: "Failed to fetch filtered products" });
  }
  return (await res.json()) as ProductLandingResponse;
};

/**
 * Hook: useLandingData
 * Usage: Home Page
 * Returns: Array of query results [New, Exclusive, Great, All]
 * Note: We use individual useQuery calls to ensure stable hook counts.
 */
export const productLandingOptions = (filters: GetProductListRequest["query"]) => {
  return queryOptions({
    queryKey: productKeys.landing(),
    queryFn: () => fetchProductLanding(filters),
  }) satisfies QueryOptions<ProductLandingResponse, Error, ProductLandingResponse, readonly string[]>;
};

export const useProductLandingQuery = (filters: GetProductListRequest["query"]) => {
  return useSuspenseQuery(productLandingOptions(filters));
};