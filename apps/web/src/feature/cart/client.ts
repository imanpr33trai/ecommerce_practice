import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

export const useCartQueries = {
  /**
   * Hook: Get Cart
   * Usage: Cart Sheet, Navbar Badge, Checkout Page
   */
  useCart: () => {
    const { data } = authClient.useSession();
    return useQuery(
      trpc.cart.get.queryOptions(undefined, {
        // Don't cache cart too long (stock changes, price changes)
        staleTime: 0,
        enabled: !!data,
        refetchOnWindowFocus: false,
      }),
    );
  },
};

export const useCartMutations = {
  /**
   * Hook: Cart Actions
   * Contains: addItem, removeItem, updateQuantity
   */
  useActions: () => {
    const utils = useQueryClient();

    // --- 1. ADD ITEM ---
    const addItem = trpc.cart.addItem.mutationOptions({
      onSuccess: () => {
        utils.invalidateQueries({ queryKey: trpc.cart.get.queryKey() });
        toast.success("Added to cart");
      },
      onError: (err) => {
        console.log(err.message)
        // Handle "Stock Limit" error specifically
        if (err.data?.code === "CONFLICT") {
          toast.error(err.message); // e.g., "Only 5 items remaining"
        } else {
          toast.error("Failed to add to cart");
        }
      },
    });

    // --- 2. UPDATE QUANTITY (With Optimistic UI) ---
    const updateQuantity = trpc.cart.updateQuantity.mutationOptions({
      onMutate: async ({ itemId, quantity }) => {
        // A. Cancel outgoing refetches so they don't overwrite us

        await utils.cancelQueries({ queryKey: trpc.cart.get.queryKey() });

        // B. Snapshot previous state

        const previousCart = utils.getQueryData(trpc.cart.get.queryKey());

        // C. Optimistically update
        utils.setQueryData(trpc.cart.get.queryKey(), (oldCart) => {
          if (!oldCart) {
            return null;
          }

          // Calculate new totals roughly (Server is source of truth, but this is good for UI)
          const targetItem = oldCart.items.find((i) => i.id === itemId);
          const priceDiff = targetItem ? (quantity - targetItem.quantity) * Number(targetItem.product.price) : 0;

          return {
            ...oldCart,
            subtotal: (oldCart.subtotal || 0) + priceDiff,
            totalItems: (oldCart.totalItems || 0) + (quantity - (targetItem?.quantity || 0)),
            items: oldCart.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
          };
        });

        // Return snapshot
        return { previousCart };
      },
      onError: (err, newVar, context) => {
        // Rollback on error (e.g., Not enough stock)
        utils.setQueryData(trpc.cart.get.queryKey(), context?.previousCart);
        toast.error(err.message);
      },
      onSettled: () => {
        // Sync with server logic
        utils.invalidateQueries({ queryKey: trpc.cart.get.queryKey() });
      },
    });

    // --- 3. REMOVE ITEM ---
    const removeItem = trpc.cart.removeItem.mutationOptions({
      onMutate: async ({ itemId }) => {
        await utils.cancelQueries({ queryKey: trpc.cart.get.queryKey() });
        const previousCart = utils.getQueryData(trpc.cart.get.queryKey());

        utils.setQueryData(trpc.cart.get.queryKey(), (oldCart) => {
          if (!oldCart) {
            return null;
          }
          return {
            ...oldCart,
            items: oldCart.items.filter((i) => i.id !== itemId),
            // Roughly update count
            totalItems: Math.max(0, (oldCart.totalItems || 0) - 1),
          };
        });

        return { previousCart };
      },
      onError: (err, _, context) => {
        utils.setQueryData(trpc.cart.get.queryKey(), context?.previousCart);
        toast.error(`Failed to remove item ${err.message}`);
      },
      onSettled: () => {
        utils.invalidateQueries({ queryKey: trpc.cart.get.queryKey() });
      },
    });

    return {
      addItem: useMutation(addItem).mutate,
      isAdding: useMutation(addItem).isPending,

      updateQuantity: useMutation(updateQuantity).mutate,
      isUpdating: useMutation(updateQuantity).isPending,

      removeItem: useMutation(removeItem).mutate,
      isRemoving: useMutation(removeItem).isPending,
    };
  },
};
