import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

import { reviewKeys } from "./keys";
export function createReviewOptions() {
  const utils = useQueryClient();

  return trpc.review.create.mutationOptions({
    onSuccess: (_, variables) => {
      toast.success("Review posted successfully!");

      utils.invalidateQueries({
        queryKey: [
          reviewKeys.byProduct(variables.productId),
          reviewKeys.summary(variables.productId),
        ],
      });
      // Invalidate the List so the new review appears
    },
    onError: (err) => {
      // Handle "You have already reviewed this product" errors specifically if needed
      toast.error(err.message || "Failed to post review");
    },
  });
}
