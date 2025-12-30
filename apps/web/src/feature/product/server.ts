import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/server";

import type { ProductFilters } from "./types";

export const productOptions = {
  /**
   * Prefetch a list of products (Category pages, Search results)
   */
  list: (filters: ProductFilters) => {
    return useQuery(trpc.product.list.queryOptions(filters));
  },

  /**
   * Prefetch a single product (Product Detail Page)
   */
  detail: (slug: string) => {
    return useQuery(trpc.product.getBySlug.queryOptions({ slug }));
  },

  /**
   * Prefetch specific landing page sections
   */
  landing: {
    newDeals: () => useQuery(trpc.product.getLandingProducts.queryOptions({ limit: 4, isNew: true })),
    exclusive: () => useQuery(trpc.product.getLandingProducts.queryOptions({ limit: 4, isExclusive: true })),
    greatValue: () => useQuery(trpc.product.getLandingProducts.queryOptions({ limit: 8, isGreatValue: true })),
  },
};
