import { INITIAL_PRODUCT_FILTERS, ProductFilterSchema } from "@ecomerceNextjs/api/routers/product/product.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

import type { ProductFilters } from "./types";

export const useProductQueries = {
  /**
   * Hook: useList
   * Usage: /products page, Category pages
   * Features: Keeps previous data while loading new filters (no flicker)
   */
  useList: (filters?: Partial<ProductFilters>) => {
    const finalFilters: ProductFilters = {
      ...INITIAL_PRODUCT_FILTERS,
      ...filters,
    };
    return useQuery(
      trpc.product.list.queryOptions(finalFilters, {
        enabled: true,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 1, // 1 minute
      }),
    );
  },
  /**
   * Hook: Suggestions
   * Usage: Navbar Search Dropdown
   */
  useSuggestions: (query: string) => {
    return useQuery(
      trpc.product.getSuggestions.queryOptions(
        { query },
        {
          enabled: query.length > 0, // Only fetch if user typed something
          staleTime: 1000 * 60, // Cache results for 1 min
        },
      ),
    );
  },

  /**
   * Hook: useDetail
   * Usage: /product/[slug] page
   */
  useDetail: (slug: string) => {
    return useQuery(
      trpc.product.getBySlug.queryOptions(
        { slug },
        {
          // enabled: !!slug,
          retry: false, // Don't retry 404s
          staleTime: 1000 * 60 * 5, // 5 minutes
        },
      ),
    );
  },

  /**
   * Hook: useFilterOptions
   * Usage: The Sidebar (fetches available colors, materials from DB)
   */
  useFilterOptions: () => {
    return useQuery(
      trpc.product.getFilters.queryOptions(undefined, {
        staleTime: 1000 * 60 * 10, // 10 minutes (rarely changes)
        refetchOnWindowFocus: false,
      }),
    );
  },

  /**
   * Hook: useLandingData
   * Usage: Home Page
   * Returns: Array of query results [New, Exclusive, Great, All]
   * Note: We use individual useQuery calls to ensure stable hook counts.
   */
  useLandingData: () => {
    return useQuery(trpc.product.getLandingProducts.queryOptions({ limit: 20 }));
  },

  // Helper to get fresh default filters
  getInitialFilters: () => ProductFilterSchema.parse({}),
};
