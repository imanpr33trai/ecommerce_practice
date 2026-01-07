import { useSuspenseQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

/**
 * Hook: useDetail
 * Usage: /product/[slug] page
 */
export const productDetailOptions = (slug: string) => {
  return trpc.product.getBySlug.queryOptions(
    { slug },
    {
      enabled: !!slug,
      retry: false, // Don't retry 404s
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );
};

export const useProudctDetailQuery = (slug: string) => {
  return useSuspenseQuery(productDetailOptions(slug));
};
