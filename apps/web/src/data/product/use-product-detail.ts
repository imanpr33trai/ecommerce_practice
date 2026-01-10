import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";

import { client } from "@/lib/hono-client";

import { productKeys } from "./keys";
import type { ProductDetailResponse } from "./types";

const productDetailFn = async (slug: string): Promise<ProductDetailResponse> => {
  const res = await client.api.product[":slug"].$get({ param: { slug } });

  if (!res.ok) {
    throw new HTTPException(404, { message: "Fetch Failed" });
  }

  // const response = await res

  return await res.json();
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
