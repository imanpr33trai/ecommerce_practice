import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to get Cart Data.
 * Returns null if empty/loading, or the cart with computed totals.
 */
export function useCart() {
  const { data, isLoading, isError } = useQuery(
    trpc.cart.get.queryOptions(undefined, {
      // Don't cache cart too long, inventory changes
      staleTime: 0,
      refetchOnWindowFocus: true,
    })
  );

  return {
    cart: data,
    isLoading,
    isError,
    // Helper helpers
    itemCount: data?.totalItems ?? 0,
    subtotal: data?.subTotal ?? 0,
    isEmpty: !data || data.items.length === 0,
  };
}

/**
 * BUNDLED ACTION HOOK
 * Contains all mutations: Add, Remove, Update, Clear.
 */
export function useCartActions() {
  const queryClient = useQueryClient();

  // --- 1. ADD ITEM ---
  const addItemMutation = useMutation(
    trpc.cart.addItem.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [] }); // Refresh numbers
        toast.success("Added to cart");
      },
      onError: (error) => {
        // Handle the specific Stock Error we threw in the backend
        if (error.data?.code === "CONFLICT") {
          toast.error(error.message); // "Only 5 items remaining..."
        } else {
          toast.error("Failed to add to cart");
        }
      },
    })
  );

  // --- 2. UPDATE QUANTITY (Semi-Optimistic) ---
  const updateQtyMutation = useMutation(
    trpc.cart.updateQuantity.mutationOptions({
      onMutate: async ({ itemId, quantity }) => {
        const cartGetKey = trpc.cart.get.queryKey();
        // Cancel refetches

        await queryClient.cancelQueries({
          queryKey: cartGetKey,
        });

        // We perform a "Partial" optimistic update.
        // We update the quantity number in the UI immediately,
        // but we wait for server to calculate the new Subtotal.
        queryClient.setQueryData(cartGetKey, (oldCart) => {
          if (!oldCart) return null;
          return {
            ...oldCart,
            items: oldCart.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.cart.get.queryKey() });
      },
      onError: (err) => {
        toast.error(err.message);
        queryClient.invalidateQueries({ queryKey: trpc.cart.get.queryKey() }); // Revert on error
      },
    })
  );

  // --- 3. REMOVE ITEM ---
  const removeItemMutation = useMutation(
    trpc.cart.removeItem.mutationOptions({
      onMutate: async ({ itemId }) => {
        await queryClient.cancelQueries({
          queryKey: trpc.cart.get.queryKey(),
        });
        queryClient.setQueryData(trpc.cart.get.queryKey(), (oldCart) => {
          if (!oldCart) return null;
          return {
            ...oldCart,
            items: oldCart.items.filter((item) => item.id !== itemId),
            // We can roughly estimate the count decrement for instant UI feedback
            totalItems: (oldCart.totalItems || 0) - 1,
          };
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: trpc.cart.get.queryKey() });
      },
      onSuccess: () => {
        toast.success("Item removed");
      },
    })
  );

  return {
    addItem: addItemMutation.mutate,
    isAdding: addItemMutation.isPending,

    updateQuantity: updateQtyMutation.mutate,
    isUpdating: updateQtyMutation.isPending,

    removeItem: removeItemMutation.mutate,
    isRemoving: removeItemMutation.isPending,
  };
}
