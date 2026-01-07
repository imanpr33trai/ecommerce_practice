import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

/**
 * Hook to create an order from the cart.
 * Usage: Checkout page.
 */
export const orderCreateFromCartOptions = (utils: QueryClient) => {
  return trpc.order.createFromCart.mutationOptions({
    onSuccess: (order) => {
      toast.success(`Order #${order.id.slice(-6)} placed successfully!`);
      utils.invalidateQueries({
        queryKey: [trpc.order.list.queryKey(), trpc.cart.get.queryKey()],
      });

      // You might navigate to an order confirmation page here
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export const useOrderCreateFromCartMutaiton = () => {
  const utils = useQueryClient();

  return useMutation(orderCreateFromCartOptions(utils));
};
