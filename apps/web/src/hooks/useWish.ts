import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useWish = {
  /**
   * Hook for the "My Wishlist" page.
   * Returns the full details of wishlisted items.
   */
  wishlistData: () => {
    return useQuery(
      trpc.wish.getAll.queryOptions(undefined, {
        staleTime: 5 * 60 * 1000, // 5 minutes (Wishlists don't change often externally)
      })
    );
  },

  isWishListed: (productId: string) => {
    const { data: ids } = useQuery(
      trpc.wish.getIds.queryOptions(undefined, {
        staleTime: 5 * 60 * 1000,
      })
    );
    return !!ids?.includes(productId);
  },
  wishlistToggle: () => {
    const queryClient = useQueryClient();

    const mutation = useMutation(
      trpc.wish.toggle.mutationOptions({
        // 1. OPTIMISTIC UPDATE: Update UI before server responds
        onMutate: async ({ productId }) => {
          // Cancel outgoing refetches so they don't overwrite our optimistic update
          // await utils.wish.getIds.cancel();

          // Snapshot the previous value
          const previousIds = queryClient.getQueryData(
            trpc.wish.getIds.queryKey()
          );

          // Optimistically update to the new value
          queryClient.setQueryData(trpc.wish.getIds.queryKey(), (oldIds) => {
            if (!oldIds) return [productId];
            return oldIds.includes(productId)
              ? oldIds.filter((id) => id !== productId) // Remove
              : [...oldIds, productId]; // Add
          });

          // Return context to rollback if error
          return { previousIds };
        },

        // 2. ON ERROR: Rollback to snapshot
        onError: (err, newVariables, context) => {
          queryClient.setQueryData(
            trpc.wish.getIds.queryKey(),
            context?.previousIds
          );
          toast.error("Could not update wishlist");
        },

        // 3. ON SETTLED: Sync with server to be sure
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: trpc.wish.getAll.queryKey(),
          });
          // Also refresh the full list page
        },

        // 4. ON SUCCESS: Show feedback
        onSuccess: (data) => {
          toast.success(data.message, { duration: 2000 });
        },
      })
    );

    return {
      toggle: (productId: string) => mutation.mutate({ productId }),
      isPending: mutation.isPending,
    };
  },
};
