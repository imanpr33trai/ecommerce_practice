import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useOrderQueries = {
  /**
   * Hook to get all orders for the current user.
   * Usage: Account -> Orders tab.
   */
  useList: () => {
    return useQuery(
      trpc.order.list.queryOptions(undefined, {
        staleTime: 1000 * 60 * 5, // 5 minutes
      }),
    );
  },

  /**
   * Hook to get a single order by ID.
   * Usage: Order detail page.
   */
  useDetail: (orderId: string) => {
    return useQuery(
      trpc.order.getById.queryOptions(
        { id: orderId },
        {
          enabled: !!orderId,
          staleTime: 1000 * 60 * 5,
          retry: false, // Don't retry if order not found
        },
      ),
    );
  },
};

export const useOrderMutations = {
  /**
   * Hook to create an order from the cart.
   * Usage: Checkout page.
   */
  useCreateFromCart: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.order.createFromCart.mutationOptions({
        onSuccess: (order) => {
          toast.success(`Order #${order.id.slice(-6)} placed successfully!`);
          utils.invalidateQueries({ queryKey: [trpc.order.list.queryKey(), trpc.cart.get.queryKey()] });

          // You might navigate to an order confirmation page here
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }),
    );
  },

  /**
   * Hook to update the status of an order (Admin only).
   */
  useUpdateStatus: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.order.updateStatus.mutationOptions({
        onSuccess: () => {
          toast.success("Order status updated");
          utils.invalidateQueries({ queryKey: [trpc.order.list.queryKey(), trpc.order.getById.queryKey()] });
        },
        onError: (err) => toast.error(err.message),
      }),
    );
  },
};
