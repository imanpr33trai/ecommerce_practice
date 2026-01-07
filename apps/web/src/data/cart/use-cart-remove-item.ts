import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const cartItemRemoveOptions = (utils: QueryClient) => {
  return trpc.cart.removeItem.mutationOptions({
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
      console.log(err.message);
    },
    onSettled: () => {
      utils.invalidateQueries({ queryKey: trpc.cart.get.queryKey() });
    },
  });
};

export const useCartItemRemoveMutation = () => {
  const utils = useQueryClient();
  return useMutation(cartItemRemoveOptions(utils));
};
