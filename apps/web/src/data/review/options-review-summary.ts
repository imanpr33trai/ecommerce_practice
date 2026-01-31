import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { reviewKeys } from "@/data/review/keys";
import type { GetReviewProductSummaryResponse } from "@/data/review/types";
import { client } from "@/lib/hono-client";

const fetchReviewSummary = async (productId: string): Promise<GetReviewProductSummaryResponse> => {
  const res = await client.review[":productId"].summary.$get({
    param: { productId },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Review Summary");
  }
  return await res.json();
};

export function reviewSummaryOptions(productId: string) {
  return queryOptions({
    queryKey: reviewKeys.summary(productId),
    queryFn: () => fetchReviewSummary(productId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!productId,
  });
}

export const useReviewSummaryQuery = (productId: string) => {
  return useSuspenseQuery(reviewSummaryOptions(productId));
};
