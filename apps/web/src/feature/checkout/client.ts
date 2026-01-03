import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useCheckout = () => {
  const router = useRouter();
  const utils = useQueryClient();

  return useMutation(
    trpc.order.createFromCart.mutationOptions({
      onMutate: () => {
        // Optional: Disable buttons
      },
      onSuccess: (order) => {
        toast.success("Order placed successfully!");
        // 1. Invalidate queries
        utils.invalidateQueries({
          queryKey: [trpc.cart.get.queryKey(), trpc.order.list.queryKey()],
        });

        // 2. Redirect to success/order page
        router.push(`/account/orders/${order.id}`);
      },
      onError: (err) => {
        if (err.data?.code === "CONFLICT") {
          toast.error("Some items are out of stock. Please review your cart.");
        } else {
          toast.error(err.message || "Checkout failed");
        }
      },
    }),
  );
};
