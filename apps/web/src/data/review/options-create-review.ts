import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reviewKeys } from "@/data/review/keys";
import { client } from "@/lib/hono-client";
import type { GetReviewProductCreateRequest } from "@/data/review/types";

export const useReviewCreateMutation = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (json: GetReviewProductCreateRequest["json"]) => {
      const res = await client.api.review.$post({ json });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        if ("error" in result) {
          throw new Error(result.error || "Failed to submit review");
        }

        throw new Error("An Unknown error occured");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.byProduct(productId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.summary(productId) });

      toast.success("Review submitted Successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
