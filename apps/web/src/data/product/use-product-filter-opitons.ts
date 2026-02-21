import { queryOptions, useQuery } from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";

import { client } from "@/lib/hono-client";

import { productKeys } from "./keys";

const fetchFilters = async () => {
  const res = await client.product.filters.$get();
  if (!res.ok) {
    throw new HTTPException(404, { message: "Fetching failed filters" });
  }
  return await res.json();
};

/**
 * Hook: useFilterOptions
 * Usage: The Sidebar (fetches available colors, materials from DB)
 */
export const productFilterOptions = () => {
  return queryOptions({
    queryKey: productKeys.filters(),
    queryFn: () => fetchFilters(),
    staleTime: 1000 * 60 * 10, // 10 minutes (rarely changes)
  });
};

export const useProductFilterQuery = () => {
  return useQuery(productFilterOptions());
};
