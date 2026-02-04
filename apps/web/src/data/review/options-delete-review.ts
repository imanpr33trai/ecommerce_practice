import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reviewKeys } from "@/data/review/keys";
import { client } from "@/lib/hono-client";

export const useReviewDeleteMutation = (productId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await client.review[":id"].$delete({
        param: { id: reviewId },
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        if ("error" in result) {
          throw new Error(result.error || "Failed to delete review");
        }
      }
      return result;
    },
    onSuccess: async () => {
      if (productId) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: reviewKeys.byProduct(productId),
          }),
          queryClient.invalidateQueries({ queryKey: reviewKeys.summary(productId) }),
        ]);
      }

      toast.success("Review Deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
