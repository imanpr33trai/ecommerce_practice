import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

/**
 * Hook: useFilterOptions
 * Usage: The Sidebar (fetches available colors, materials from DB)
 */
export const productFilterOptions = () => {
  return trpc.product.getFilters.queryOptions(undefined, {
    staleTime: 1000 * 60 * 10, // 10 minutes (rarely changes)
    refetchOnWindowFocus: false,
  });
};

export const useProductFilterQuery = () => {
  return useQuery(productFilterOptions());
};
