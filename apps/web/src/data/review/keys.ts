export const reviewKeys = {
  all: ["review"] as const,
  lists: () => ["review", "list"] as const,
  byProduct: (productId: string) => ["review", "list", productId] as const,
  summary: (productId: string) => ["review", "summary", productId] as const,

  user: (userId: string | undefined) => ["reviews", userId],
};
