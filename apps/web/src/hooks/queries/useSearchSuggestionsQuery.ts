"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchSearch } from "./useSearchQuery";

/**
 * Search Suggestions Query Options
 * Used for autocomplete dropdown in search input
 */
export const searchSuggestionOptions = (query: string) => {
  return queryOptions({
    queryKey: ["search", "suggestions", query],
    queryFn: () =>
      fetchSearch({
        search: query,
        limit: 5,
        page: 1,
        sort: "newest",
        minPrice: 0,
        maxPrice: 100000,
        categories: [],
        materials: [],
        colors: [],
        onSale: undefined,
        inStock: undefined,
        rating: undefined,
      }),
    enabled: query.length >= 2, // Only fetch if user typed at least 2 characters
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    gcTime: 1000 * 60 * 10, // Garbage collection after 10 minutes
  });
};

/**
 * Client-side hook for fetching search suggestions
 */
export function useSearchSuggestionsQuery(query: string) {
  return useQuery(searchSuggestionOptions(query));
}

/**
 * Prefetch function for search suggestions (Server Components)
 */
export async function prefetchSearchSuggestions(query: string) {
  if (query.length < 2) return null;

  return fetchSearch({
    search: query,
    limit: 5,
    page: 1,
    sort: "newest",
    minPrice: 0,
    maxPrice: 100000,
    categories: [],
    materials: [],
    colors: [],
    onSale: undefined,
    inStock: undefined,
    rating: undefined,
  });
}