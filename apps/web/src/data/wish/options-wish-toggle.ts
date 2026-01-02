import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const wishToggleOptions = (utils: QueryClient) => {
  return trpc.wish.toggle.mutationOptions({
    // 1. OPTIMISTIC UPDATE
    onMutate: async ({ productId }) => {
      // Cancel outgoing refetches
      await utils.cancelQueries({ queryKey: trpc.wish.getIds.queryKey() });
      // await utils.wish.getIds.cancel();

      // Snapshot previous value
      const previousIds = utils.getQueryData(trpc.wish.getIds.queryKey());

      // Optimistically update the cache
      utils.setQueryData(trpc.wish.getIds.queryKey(), (oldIds) => {
        if (!oldIds) {
          return [productId]; // Initialize if empty
        }
        return oldIds.includes(productId)
          ? oldIds.filter((id) => id !== productId) // Remove
          : [...oldIds, productId]; // Add
      });

      return { previousIds };
    },

    // 2. ERROR HANDLING
    onError: (error, newVariables, context) => {
      // Rollback to snapshot
      utils.setQueryData(trpc.wish.getIds.queryKey(), context?.previousIds);
      console.log(error);
      toast.error("Failed to update wishlist");
    },

    // 3. SETTLED
    onSettled: () => {
      utils.invalidateQueries({
        queryKey: [trpc.wish.getAll.queryKey(), trpc.wish.getIds.queryKey()],
      });
      // utils.wish.getIds.invalidate();
      // utils.wish.getAll.invalidate(); // Refresh the list page too
    },

    // 4. SUCCESS FEEDBACK
    onSuccess: (data) => {
      toast.success(data.message, { duration: 2000 });
      console.log(data);
    },
  });
};

/**
 * Mutation: Toggle Item
 * Features: Optimistic Updates (Instant Red Heart)
 */
export const useWishToggleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(wishToggleOptions(queryClient));
};
