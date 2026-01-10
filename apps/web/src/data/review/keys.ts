import type { GetReviewProductListRequest } from "@/data/review/types";

export const reviewKeys = {
  all: ["review"] as const,
  lists: () => ["review", "list"] as const,
  byProduct: (productId: string, query: GetReviewProductListRequest["query"]) =>
    ["review", "list", productId, query] as const,
  summary: (productId: string) => ["review", "summary", productId] as const,
};
