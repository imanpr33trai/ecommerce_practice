import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

import type { ProductFilters } from "./types";

export const useProductQueries = {
    /**
     * Hook: useList
     * Usage: Main Product Grid with Filters
     */
    list: (filters: ProductFilters, enabled = true) => {
        return useQuery(
            trpc.product.list.queryOptions(filters, {
                enabled,
                // UX: Keep old data visible while new filters load (prevents flashing)
                placeholderData: keepPreviousData,
                staleTime: 1000 * 60 * 1, // 1 minute cache
            })
        );
    },


    /**
     * Hook: useDetail
     * Usage: Single Product Page
     */
    detail: (slug: string) => {
        return useQuery(
            trpc.product.getBySlug.queryOptions(
                { slug },
                {
                    enabled: !!slug,
                    staleTime: 1000 * 60 * 5, // 5 minutes
                    retry: false,
                },
            ),
        );
    },

    /**
     * Hook: all (For Landing Page)
     * REFACTORED: Uses standard useQuery calls one by one.
     * Returns an Array to match your HomePage indexing [0], [1], etc.
     */
    all: () => {
        // 1. New Deals
        const newDeals = useQuery(
            trpc.product.getLandingProducts.queryOptions({
                limit: 4,
                isNew: true,
            }),
        );

        // 2. Exclusive Deals
        const exclusiveDeals = useQuery(
            trpc.product.getLandingProducts.queryOptions({
                limit: 4,
                isExclusive: true,
            }),
        );

        // 3. Great Value
        const greatValue = useQuery(
            trpc.product.getLandingProducts.queryOptions({
                limit: 8,
                isGreatValue: true,
            }),
        );

        // 4. All Products
        const allProducts = useQuery(
            trpc.product.getLandingProducts.queryOptions({
                limit: 20,
            }),
        );

        // Return as array so results[0] works in HomePage
        return [newDeals, exclusiveDeals, greatValue, allProducts];
    },

    // --- Individual Hooks (Optional helpers) ---

    newDeals: () => {
        return useQuery(
            trpc.product.getLandingProducts.queryOptions({
                limit: 4,
                isNew: true,
            }),
        );
    },

    exclusiveDeals: () => {
        return useQuery(
            trpc.product.getLandingProducts.queryOptions({
                limit: 4,
                isExclusive: true,
            }),
        );
    },

    greatValue: () => {
        return useQuery(
            trpc.product.getLandingProducts.queryOptions({
                limit: 8,
                isGreatValue: true,
            }),
        );
    },

    trendingCategory: (slug: string) => {
        return useQuery(
            trpc.product.getLandingProducts.queryOptions({
                limit: 4,
                categorySlug: slug,
            }),
        );
    },
};
