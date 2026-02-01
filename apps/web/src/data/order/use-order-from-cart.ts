import {
  mutationOptions,
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { cartKeys } from "@/data/cart";
import { orderKeys } from "@/data/order/keys";
import { client } from "@/lib/hono-client";
import type { GetCreateOrderRequest, GetCreateOrderResponse } from "@/data/order/type";

const createOrderFn = async (json: GetCreateOrderRequest) => {
  const res = await client.order.$post({
    json,
  });

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Network error: Failed to process order",
  }))) as GetCreateOrderResponse;

  if (!res.ok || result.success === false) {
    // Type-safe union narrowing for error property
    const errorMessage = "error" in result ? result.error : "Failed to create order";
    throw new Error(errorMessage);
  }

  return "data" in result ? result.data : null;
};

/**
 * Hook to create an order from the cart.
 * Usage: Checkout page.
 */
export const orderCreateFromCartOptions = (utils: QueryClient) => {
  return mutationOptions({
    mutationFn: (json: GetCreateOrderRequest) => createOrderFn(json),
    onSuccess: () => {
      toast.success("Order placed successfully!");

      // Invalidate orders list and cart since checkout clears the cart
      utils.invalidateQueries({ queryKey: orderKeys.lists() });
      utils.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (err: Error) => {
      // 2026 standard: handling specific stock errors if returned from backend
      toast.error(err.message);
    },
  });
};

export const useOrderCreateFromCartMutaiton = () => {
  const utils = useQueryClient();

  return useMutation(orderCreateFromCartOptions(utils));
};
