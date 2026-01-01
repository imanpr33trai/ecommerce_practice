import { keepPreviousData } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

import type { ReviewFilters } from "./types";

export const reviewListOptions = (filters: ReviewFilters) => {
  return trpc.review.listByProduct.queryOptions(filters, {
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};
