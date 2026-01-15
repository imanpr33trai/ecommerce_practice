import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono-client";

import { productKeys } from "./keys";

const productDetailFn = async (slug: string) => {
  const res = await client.api.product[":slug"].$get({ param: { slug } });

  if (!res.ok) {
    throw new Error("Fetch Failed");
  }

  // Call .json() once
  const result = await res.json();

  if (!res.ok) {
    throw new Error("Product not found");
  }

  // RETURN THE NESTED DATA
  // This is what makes the hook return the product fields directly
  return result.data;
};

/**
 * Hook: useDetail
 * Usage: /product/[slug] page
 */
export const productDetailOptions = (slug: string) => {
  return queryOptions({
    queryKey: productKeys.detail(slug),
    queryFn: () => productDetailFn(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: Error) => {
      // Don't retry on 404s (typical for product details)
      if (error.message?.includes("404")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useProudctDetailQuery = (slug: string) => {
  return useSuspenseQuery(productDetailOptions(slug));
};
