"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cartKeys } from "@/data/cart/keys";
import { client } from "@/lib/hono-client";

/**
 * Cart response type (matching the API response)
 */
interface CartResponse {
  success: boolean;
  data: {
    id: string | null;
    items: Array<{
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
    }>;
    subtotal: number;
    totalItems: number;
  };
}

/**
 * Standalone function to clear cart
 */
const clearCartFn = async () => {
  const res = await client.cart.$delete();

  if (!res.ok) {
    throw new Error("Failed to clear cart");
  }

  return await res.json();
};

/**
 * Hook for clearing cart mutation with optimistic updates
 */
export function useClearCartMutation() {
  const queryClient = useQueryClient();
  const queryKey = cartKeys.userCart();

  return useMutation({
    mutationFn: () => clearCartFn(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousCart = queryClient.getQueryData<CartResponse>(queryKey);

      // Optimistically clear the cart
      queryClient.setQueryData<CartResponse>(queryKey, {
        success: true,
        data: {
          id: null,
          items: [],
          subtotal: 0,
          totalItems: 0,
        },
      });

      return { previousCart };
    },

    onError: (err, _variables, context) => {
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