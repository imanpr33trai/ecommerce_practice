import { keepPreviousData, queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { reviewKeys } from "@/data/review/keys";
import { client } from "@/lib/hono-client";
import type {
  GetReviewProductListRequest,
  GetReviewProductListResponse,
} from "@/data/review/types";

const fetchProductReviews = async (
  productId: string,
  query: GetReviewProductListRequest["query"],
): Promise<GetReviewProductListResponse> => {
  const res = await client.api.review[":productId"].$get({
    param: { productId },
    query,
  });
  if (!res.ok) {
    throw new Error("Failed to load reviews");
  }

  return await res.json();
};

export const reviewListOptions = (
  productId: string,
  query: GetReviewProductListRequest["query"],
) => {
  return queryOptions({
    queryFn: () => fetchProductReviews(productId, query),
    queryKey: reviewKeys.byProduct(productId),
    enabled: !!productId,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useReviewListQuery = (
  productId: string,
  query: GetReviewProductListRequest["query"],
) => {
  return useSuspenseQuery(reviewListOptions(productId, query));
};
