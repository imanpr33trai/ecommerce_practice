import type { GetReviewProductListRequest } from "@/data/review/types";

export const reviewKeys = {
  all: ["review"] as const,
  byProduct: (productId: string) => [...reviewKeys.all, productId] as const,
  byUser: () => [...reviewKeys.all, "user"] as const,

  userList: () => [...reviewKeys.byUser()] as const,

  list: (productId: string, query: GetReviewProductListRequest["query"]) =>
    [...reviewKeys.byProduct(productId), query] as const,
  summary: (productId: string) => ["review", "summary", productId] as const,
};
