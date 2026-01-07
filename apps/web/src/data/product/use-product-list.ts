import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";

import { INITIAL_PRODUCT_FILTERS, type ProductFilters } from "@/data/product";
import { trpc } from "@/trpc/client";

/**
 * Hook: useList
 * Usage: /products page, Category pages
 * Features: Keeps previous data while loading new filters (no flicker)
 */
export const productListOptions = (filters?: Partial<ProductFilters>) => {
  const finalFilters: ProductFilters = {
    ...INITIAL_PRODUCT_FILTERS,
    ...filters,
  };
  return trpc.product.list.queryOptions(finalFilters, {
    enabled: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useProductListQuery = (filter?: Partial<ProductFilters>) => {
  return useSuspenseQuery(productListOptions(filter));
};
