"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { wishKeys } from "@/data/wish/keys";
import { client } from "@/lib/hono-client";
import type { GetWishListIDsResponse, GetWishToggleResponse } from "@/data/wish/types";

/**
 * Standalone function to toggle wishlist
 */
const toggleWishFn = async (productId: string): Promise<GetWishToggleResponse> => {
  const res = await client.wish.toggle.$post({
    json: { productId },
  });

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Network error",
  }))) as GetWishToggleResponse;

  if (!res.ok || (result as { success: boolean }).success === false) {
    const errorMessage = "error" in result && typeof result.error === "string" ? result.error : "Failed to update wishlist";
    throw new Error(errorMessage);
  }

  return result;
};

/**
 * Hook for toggling wishlist mutation
 */
export function useToggleWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => toggleWishFn(productId),

    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: wishKeys.ids() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData<GetWishListIDsResponse>(wishKeys.ids());
      const previousIds = previous?.data ?? [];

      // Optimistically update to the new value
      const nextIds = previousIds.includes(productId)
        ? previousIds.filter((id) => id !== productId)
        : [...previousIds, productId];

      queryClient.setQueryData<GetWishListIDsResponse>(wishKeys.ids(), {
        success: true,
        data: nextIds,
      });

      // Return a context object with the previous value
      return { previous };
    },

    onError: (error, _productId, context) => {
      // Rollback to the previous value
      if (context?.previous) {
        queryClient.setQueryData(wishKeys.ids(), context.previous);
      }
      toast.error(error.message);
    },

    onSuccess: (data) => {
      if ("data" in data) {
        toast.success(data.data.message);
      }
    },

    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [wishKeys.ids(), wishKeys.count()] });
    },
  });
}