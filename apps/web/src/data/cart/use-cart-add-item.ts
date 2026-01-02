import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const cartAddItemOptions = (utils: QueryClient) => {
  return trpc.cart.addItem.mutationOptions({
    onSuccess: () => {
      utils.invalidateQueries({ queryKey: trpc.cart.get.queryKey() });
      toast.success("Added to cart");
    },
    onError: (err) => {
      console.log(err.message);
      // Handle "Stock Limit" error specifically
      if (err.data?.code === "CONFLICT") {
        toast.error(err.message); // e.g., "Only 5 items remaining"
      } else {
        toast.error("Failed to add to cart");
      }
    },
  });
};

export const useCartAddItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(cartAddItemOptions(queryClient));
};
