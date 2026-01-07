import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const cartUpdateItemQuantityOptions = (utils: QueryClient) => {
  return trpc.cart.updateQuantity.mutationOptions({
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
        const priceDiff = targetItem
          ? (quantity - targetItem.quantity) * Number(targetItem.product.price)
          : 0;

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
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err, newVar, context) => {
      // Rollback on error (e.g., Not enough stock)
      utils.setQueryData(trpc.cart.get.queryKey(), context?.previousCart);
      toast.error(err.message);
      console.log(err.message);
    },
    onSettled: () => {
      // Sync with server logic
      utils.invalidateQueries({ queryKey: trpc.cart.get.queryKey() });
    },
  });
};

export const useCartUpdateItemQuantityMutation = () => {
  const utils = useQueryClient();
  return useMutation(cartUpdateItemQuantityOptions(utils));
};
