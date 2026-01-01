import { trpc } from "@/trpc/client";

export function reviewSummaryOptions(productId: string) {
  return trpc.review.getSummary.queryOptions(
    { productId },
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      enabled: !!productId,
    },
  );
}
