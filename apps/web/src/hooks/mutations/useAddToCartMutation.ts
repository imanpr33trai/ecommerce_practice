"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cartKeys } from "@/data/cart/keys";
import { client } from "@/lib/hono-client";
import type { GetCartAddItemRequest } from "@/data/cart/types";

/**
 * Standalone function to add item to cart
 */
const addToCartFn = async (json: GetCartAddItemRequest["json"]) => {
  const res = await client.cart.$post({ json });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message || "Failed to add to cart");
  }
  return res.json();
};

/**
 * Hook for adding item to cart mutation
 */
export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (json: GetCartAddItemRequest["json"]) => addToCartFn(json),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.userCart() });
      toast.success("Added to cart");
    },
    onError: (err: Error) => {
      console.error(err.message);
      // Handle "Stock Limit" error specifically
      if (err.message.includes("CONFLICT") || err.message.includes("stock")) {
        toast.error(err.message); // e.g., "Only 5 items remaining"
      } else {
        toast.error("Failed to add to cart");
      }
    },
  });
}