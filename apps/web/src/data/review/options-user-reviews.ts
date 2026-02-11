import { queryOptions, useQuery } from "@tanstack/react-query";

import { reviewKeys } from "@/data/review/keys";
import { client } from "@/lib/hono-client";
import type {
  GetReviewProductUserListRequest,
  GetReviewProductUserListResponse,
} from "@/data/review/types";

const fetchUserReviewsFn = async (query: GetReviewProductUserListRequest["query"]) => {
  const res = await client.review.me.$get({
    query,
  });

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Network error: Failed to parse reviews",
  }))) as GetReviewProductUserListResponse;

  if (!res.ok) {
    // Type-safe property access using the 'in' operator for the union type
    const errorMessage = "Failed to load your reviews";
    throw new Error(errorMessage);
  }

  // Returning the data (profile reviews list)
  return result.data;
};

export function reviewsUserOptions(
  isAuth: boolean,
  query: GetReviewProductUserListRequest["query"],
) {
  return queryOptions({
    queryKey: reviewKeys.userList(),
    queryFn: () => fetchUserReviewsFn(query),
    enabled: isAuth,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export const useReviewsUserQuery = (
  isAuth: boolean,
  query: GetReviewProductUserListRequest["query"],
) => {
  return useQuery(reviewsUserOptions(isAuth, query));
};
