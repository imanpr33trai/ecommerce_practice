import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { reviewKeys } from "@/data/review/keys";
import { client } from "@/lib/hono-client";
import type {
  GetReviewProductUserListRequest,
  GetReviewProductUserListResponse,
} from "@/data/review/types";

const fetchUserReviews = async (
  query: GetReviewProductUserListRequest["query"],
): Promise<GetReviewProductUserListResponse> => {
  const res = await client.api.review.me.$get({
    query,
  });
  if (res.status === 401) {
    throw new Error("Unauthorized:Please login to see your reviews");
  }
  if (!res.ok) {
    throw new Error("Failed to load your reviews");
  }
  return await res.json();
};

export function reviewsUserOptions(
  userId: string | undefined,
  query: GetReviewProductUserListRequest["query"],
) {
  return queryOptions({
    queryKey: reviewKeys.user(userId),
    queryFn: () => fetchUserReviews(query),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export const useReviewsUserQuery = (
  userId: string | undefined,
  query: GetReviewProductUserListRequest["query"],
) => {
  return useSuspenseQuery(reviewsUserOptions(userId, query));
};
