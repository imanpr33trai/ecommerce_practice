"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cartKeys } from "@/data/cart/keys";
import { client } from "@/lib/hono-client";

/**
 * Cart item type (matching the API response)
 */
interface CartItem {
  id: string;
  quantity: number;
  color: string | null;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
    discountPrice: string | number | null;
    stock: number;
    colors: string[] | null;
    images: Array<{
      id: string;
      url: string;
      altText: string | null;
    }>;
  };
}

/**
 * Cart response type (matching the API response)
 */
interface CartResponse {
  success: boolean;
  data: {
    id: string | null;
    items: CartItem[];
    subtotal: number;
    totalItems: number;
  };
}

/**
 * Standalone function to remove item from cart
 */
const removeFromCartFn = async (productId: string) => {
  const res = await client.cart[":productId"].$delete({ param: { productId } });

  if (!res.ok) {
    throw new Error("Failed to remove item");
  }

  return await res.json();
};

/**
 * Hook for removing item from cart mutation with optimistic updates
 */
export function useRemoveFromCartMutation() {
  const queryClient = useQueryClient();
  const queryKey = cartKeys.userCart();

  return useMutation({
    mutationFn: (productId: string) => removeFromCartFn(productId),

    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousCart = queryClient.getQueryData<CartResponse>(queryKey);

      queryClient.setQueryData<CartResponse>(queryKey, (oldCart) => {
        // 1. If no cart exists or it's already the 'empty' variant (id is null), do nothing
        if (!oldCart || oldCart.data.id === null) {
          return oldCart;
        }

        // 2. TypeScript now knows oldCart.data.id is a string
        // and oldCart.data.items is the full product array
        const itemToRemove = oldCart.data.items.find((i) => i.id === productId);
        const itemQuantity = itemToRemove?.quantity || 0;

        return {
          ...oldCart,
          data: {
            ...oldCart.data,
            items: oldCart.data.items.filter((i) => i.id !== productId),
            totalItems: Math.max(0, oldCart.data.totalItems - itemQuantity),
            // Keep existing subtotal or recalculate if you have item prices
            subtotal: oldCart.data.subtotal,
          },
        };
      });

      return { previousCart };
    },

    onError: (err, _productId, context) => {
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
}