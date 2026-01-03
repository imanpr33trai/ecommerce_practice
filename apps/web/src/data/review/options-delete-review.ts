import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

import { reviewKeys } from "./keys";

export function reviewDeleteOptions(utils: QueryClient) {
  return trpc.review.delete.mutationOptions({
    onSuccess: (_, variables) => {
      toast.success("Review deleted");

      // We invalidate all review lists because we might not know the exact productId context here easily
      // Optimized: You could pass productId to the mutation context if strict performance is needed
      utils.invalidateQueries({ queryKey: [reviewKeys.lists(), reviewKeys.summary(variables.id)] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete review");
    },
  });
}

export const useReviewDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(reviewDeleteOptions(queryClient));
};
