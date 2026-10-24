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
 * Standalone function to update cart item quantity
 */
const updateQuantityFn = async ({ productId, quantity }: { productId: string; quantity: number }) => {
  const res = await client.cart[":productId"].$put({
    json: { quantity },
    param: { productId },
  });

  const result = await res.json();

  if (!res.ok || (result as { success?: boolean }).success === false) {
    const errorResult = result as { error?: string };
    if (errorResult.error) {
      throw new Error(errorResult.error || "Failed to update quantity or Stock conflict");
    }
    throw new Error("An unknown error occurred");
  }
  return result.data;
};

/**
 * Hook for updating cart item quantity mutation with optimistic updates
 */
export function useUpdateQuantityMutation() {
  const queryClient = useQueryClient();
  const queryKey = cartKeys.userCart();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateQuantityFn({ productId, quantity }),

    onMutate: async ({ productId, quantity }) => {
      // A. Cancel outgoing refetches so they don't overwrite us
      await queryClient.cancelQueries({ queryKey });

      // B. Snapshot previous state
      const previousCart = queryClient.getQueryData<CartResponse>(queryKey);

      // C. Optimistically update
      if (previousCart && previousCart.data.id !== null) {
        queryClient.setQueryData<CartResponse>(queryKey, {
          ...previousCart,
          data: {
            ...previousCart.data,
            items: previousCart.data.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item,
            ),
            totalItems: previousCart.data.items.reduce(
              (acc, item) => (item.id === productId ? acc + quantity : acc + item.quantity),
              0,
            ),
          },
        });
      }
      return { previousCart };
    },

    onError: (err, _newVars, context) => {
      // Rollback on error (e.g., Not enough stock)
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      toast.error(err.message);
    },
    onSettled: () => {
      // Sync with server logic
      queryClient.invalidateQueries({ queryKey });
    },
  });
}