import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

/**
 * Hook: useLandingData
 * Usage: Home Page
 * Returns: Array of query results [New, Exclusive, Great, All]
 * Note: We use individual useQuery calls to ensure stable hook counts.
 */
export const productLandingOptions = () => {
  return trpc.product.getLandingProducts.queryOptions({ limit: 20 });
};

export const useProductLandingQuery = () => {
  return useSuspenseQuery(productLandingOptions());
};
