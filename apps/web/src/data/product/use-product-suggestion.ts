import { queryOptions, useQuery } from "@tanstack/react-query";

import { productKeys } from "./keys";
import { fetchProducts } from "./use-product-list";

/**
 * Hook: Suggestions
 * Usage: Navbar Search Dropdown
 */
export const productSuggestionOptions = (query: string) => {
  return queryOptions(
    {
      queryKey: productKeys.suggestion(query),
      queryFn: () =>
        fetchProducts({
          search: query,
          limit: "5",
        }),
      enabled: query.length > 0, // Only fetch if user typed something
      staleTime: 1000 * 60, // Cache results for 1 min
    },
  );
};

export const useProductSuggestionQuery = (query: string) => {
  return useQuery(productSuggestionOptions(query));
};
