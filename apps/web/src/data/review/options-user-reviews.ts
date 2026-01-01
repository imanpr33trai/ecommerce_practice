import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

export function reviewsUserOptions() {
  return trpc.review.listByUser.queryOptions(undefined, {
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export const useReviewsUserQuery = () => {
  return useSuspenseQuery(reviewsUserOptions());
};
