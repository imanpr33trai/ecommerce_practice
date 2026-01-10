import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function reviewCreateOptions(utils: QueryClient) {
  return trpc.review.create.mutationOptions({
    onSuccess: (_, variables) => {
      utils.invalidateQueries({
        queryKey: trpc.review.listByProduct.queryKey(),
      });
      utils.invalidateQueries({ queryKey: trpc.review.getSummary.queryKey() });

      toast.success("Review posted successfully!");
      // Invalidate the List so the new review appears
    },
    onError: (err) => {
      // Handle "You have already reviewed this product" errors specifically if needed
      toast.error(err.message || "Failed to post review");
    },
  });
}

export const useReviewCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(reviewCreateOptions(queryClient));
};
