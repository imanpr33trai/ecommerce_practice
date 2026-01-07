import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

/**
 * Hook: Suggestions
 * Usage: Navbar Search Dropdown
 */
export const productSuggestionOptions = (query: string) => {
  return trpc.product.getSuggestions.queryOptions(
    { query },
    {
      enabled: query.length > 0, // Only fetch if user typed something
      staleTime: 1000 * 60, // Cache results for 1 min
    },
  );
};

export const useProductSuggestionQuery = (query: string) => {
  return useQuery(productSuggestionOptions(query));
};
