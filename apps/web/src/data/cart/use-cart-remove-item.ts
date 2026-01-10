import { client } from "@/lib/hono-client";
import { type QueryClient, useMutation, useQueryClient, mutationOptions } from "@tanstack/react-query";

import { toast } from "sonner";
import { cartKeys } from "./keys";
import { GetCartUserListResponse } from "./types";


// 1. Independent Fetcher (Safe)
const cartRemoveItemFn = async (productId: string) => {
  const res = await client.api.cart[":productId"].$delete({ param: { productId } });

  // Use standard Error on client-side instead of server-side HTTPException
  if (!res.ok) throw new Error("Failed to remove item");

  return await res.json();
};

// 2. The Hook (Where hooks are allowed)
export const useCartItemRemoveMutation = () => {
  const queryClient = useQueryClient();
  const queryKey = cartKeys.userCart();

  return useMutation({
    mutationFn: (productId: string) => cartRemoveItemFn(productId),

    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousCart = queryClient.getQueryData<GetCartUserListResponse>(queryKey);

      queryClient.setQueryData<GetCartUserListResponse>(queryKey, (oldCart) => {
        // 1. If no cart exists or it's already the 'empty' variant (id is null), do nothing
        if (!oldCart || oldCart.data.id === null) {
          return oldCart;
        }

        // 2. TypeScript now knows oldCart.data.id is a string
        // and oldCart.data.items is the full product array
        return {
          ...oldCart,
          data: {
            ...oldCart.data,
            items: oldCart.data.items.filter((i) => i.id !== productId),
            totalItems: Math.max(0, oldCart.data.totalItems - 1),
            // Keep existing subtotal or recalculate if you have item prices
            subtotal: oldCart.data.subtotal
          },
        };
      });




      return { previousCart };
    },

    onError: (err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      toast.error(`Error: ${err.message}`);
    },

    onSettled: () => {
      // Re-sync with server truth
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
