import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { orderKeys } from "@/data/order/keys";
import { client } from "@/lib/hono-client";

const listOrdersFn = async () => {
  const res = await client.api.order.$get();

  if (!res.ok) {
    // Type-safe property access for the union type
    const errorMessage = "Failed to fetch orders";
    throw new Error(errorMessage);
  }

  // Narrowing the type to return the array of orders
  return res.json();
};

/**
 * Hook to get all orders for the current user.
 * Usage: Account -> Orders tab.
 */
export const orderListOptions = () => {
  return queryOptions({
    queryKey: orderKeys.lists(), // Using a consistent key for invalidation
    queryFn: () => listOrdersFn(),

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrderListQuery = () => {
  return useSuspenseQuery(orderListOptions());
};
