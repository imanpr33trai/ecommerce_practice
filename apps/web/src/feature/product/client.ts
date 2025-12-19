import { trpc } from "@/trpc/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ProductFilters } from "./types";

export const useProductQueries = {
    /**
     * Hook: useList
     * Usage: const { data } = Product.hooks.useList({ page: 1, sort: 'latest' });
     */
    useList: (filters: ProductFilters, enabled = true) => {
        return useQuery(trpc.product.list.queryOptions(filters, {
            enabled,
            // UX MAGIC: Keeps the old list on screen while the new filter loads.
            // Prevents "Flash of Loading Spinner" when changing pages or sorting.
            placeholderData: keepPreviousData,

            // Cache Strategy: Keep data fresh for 1 minute
            staleTime: 1000 * 60 * 1,
        }));
    },

    /**
     * Hook: useDetail
     * Usage: const { data } = Product.hooks.useDetail('my-slug');
     */
    useDetail: (slug: string) => {
        return useQuery(trpc.product.getBySlug.queryOptions(
            { slug },
            {
                enabled: !!slug,
                // Cache Strategy: Details rarely change, keep for 5 mins
                staleTime: 1000 * 60 * 5,
                retry: false, // Don't retry 404s
            }
        )
        )
    },
};