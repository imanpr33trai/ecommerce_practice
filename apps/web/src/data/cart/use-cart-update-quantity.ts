import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/hono-client";

import { cartKeys } from "./keys";
import type { GetCartUserListResponse } from "./types";

export const useCartUpdateItemQuantityMutation = () => {
  const queryClient = useQueryClient();
  const queryKey = cartKeys.userCart();

  return useMutation({
    mutationFn: async ({ quantity, productId }: { quantity: number; productId: string }) => {
      const res = await client.api.cart[":productId"].$put({
        json: { quantity },
        param: { productId },
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        if ("error" in result) {
          throw new Error(result.error || "Failed to update quantity or Stock confilict");
        }
        if ("message" in result) {
          throw new Error(result.message);
        }
        throw new Error("An Unknown error occured");
      }
      return await res.json();
    },

    onMutate: async ({ productId, quantity }) => {
      // A. Cancel outgoing refetches so they don't overwrite us

      await queryClient.cancelQueries({ queryKey });

      // B. Snapshot previous state

      const previousCart = queryClient.getQueryData<GetCartUserListResponse>(queryKey);

      // C. Optimistically update

      if (previousCart && previousCart.data.id !== null) {
        queryClient.setQueryData<GetCartUserListResponse>(queryKey, {
          ...previousCart,
          data: {
            ...previousCart.data,
            items: previousCart.data.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
            totalItems: previousCart.data.items.reduce(
              (acc, item) => (item.productId === productId ? acc + quantity : acc + item.quantity),
              0,
            ),
          },
        });
      }
      return { previousCart };
    },

    onError: (err, newVar, context) => {
      // Rollback on error (e.g., Not enough stock)
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      toast.error(err.message);
      console.log(err.message);
    },
    onSettled: () => {
      // Sync with server logic
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
