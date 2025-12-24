import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

import { ProductFilterSchema, type ProductFilters } from "./types";

export const useProductQueries = {
    /**
     * Hook: useList
     * Usage: /products page, Category pages
     * Features: Keeps previous data while loading new filters (no flicker)
     */
    useList: (filters: ProductFilters, enabled = true) => {
        return useQuery(
            trpc.product.list.queryOptions(filters, {
                enabled,
                placeholderData: keepPreviousData,
                staleTime: 1000 * 60 * 1, // 1 minute
            }),
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
