import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Assuming sonner, replace with your toast lib

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

export const useWishQueries = {
  /**
   * Hook: Get Full Wishlist
   * Usage: Wishlist Page
   */
  useList: () => {
    return useQuery(
      trpc.wish.getAll.queryOptions(undefined, {
        staleTime: 1000 * 60 * 5, // 5 minutes
      }),
    );
  },

  /**
   * Hook: Check if item is in wishlist
   * Usage: Product Cards (Heart Icon)
   */
  useIsWishlisted: (productId: string) => {
    const { data: session } = authClient.useSession();
    // if(session){
    //   return
    // }
    const {
      data: ids,
      error,
      isLoading,
    } = useQuery(
      trpc.wish.getIds.queryOptions(undefined, {
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!session,
      }),
    );

    if (isLoading) {
      console.log("useIsWishlisted is isLoading...");
      return;
    }

    if (error) {
      console.log(`useIsWishlisted ${error.message}`);
      return;
    }
    return ids?.includes(productId);
  },
};

export const useWishMutations = {
  /**
   * Mutation: Toggle Item
   * Features: Optimistic Updates (Instant Red Heart)
   */
  useToggle: () => {
    const utils = useQueryClient();
    const toggleKey = trpc.wish.toggle.mutationKey();
    const previousIds = utils.getQueryData(toggleKey);
    return useMutation(
      trpc.wish.toggle.mutationOptions({
        // 1. OPTIMISTIC UPDATE
        onMutate: async ({ productId }) => {
          // Cancel outgoing refetches
          await utils.cancelQueries({ queryKey: toggleKey });
          // await utils.wish.getIds.cancel();

          // Snapshot previous value

          // const previousIds = utils.wish.getIds.getData();

          // Optimistically update the cache
          utils.setQueryData(toggleKey, (oldIds: string[]) => {
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
        onError: () => {
          // Rollback to snapshot
          utils.setQueryData(toggleKey, previousIds);
          toast.error("Failed to update wishlist");
        },

        // 3. SETTLED
        onSettled: () => {
          utils.invalidateQueries({ queryKey: [trpc.wish.getAll.queryKey(), trpc.wish.getIds.queryKey()] });
          // utils.wish.getIds.invalidate();
          // utils.wish.getAll.invalidate(); // Refresh the list page too
        },

        // 4. SUCCESS FEEDBACK
        onSuccess: (data) => {
          toast.success(data.message, { duration: 2000 });
        },
      }),
    );
  },

  /**
   * Mutation: Clear All
   */
  useClear: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.wish.clear.mutationOptions({
        onSuccess: () => {
          toast.success("Wishlist cleared");
          utils.invalidateQueries({ queryKey: [trpc.wish.getIds.queryKey(), trpc.wish.getAll.queryKey()] });
        },
      }),
    );
  },
};
