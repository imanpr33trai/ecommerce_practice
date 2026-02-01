import { queryOptions, useQuery } from "@tanstack/react-query";

import { orderKeys } from "@/data/order/keys";
import { client } from "@/lib/hono-client";
import type { GetOrderSingleRespose } from "@/data/order/type";

const getOrderDetailFn = async (id: string) => {
  const res = await client.order[":id"].$get({
    param: { id },
  });
  const result = (await res.json().catch(() => ({
    success: false,
    error: "Failed to parse order data",
  }))) as GetOrderSingleRespose;

  if (!res.ok || result.success === false) {
    // Type-safe property access for the union type
    const errorMessage = "error" in result ? result.error : "Failed to fetch order";
    throw new Error(errorMessage);
  }

  // Narrowing the type to return the order data
  return "data" in result ? result.data : null;
};

/**
 * Hook to get a single order by ID.
 * Usage: Order detail page.
 */

export const orderDetailsOptions = (id: string) => {
  return queryOptions({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderDetailFn(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
};

export const useOrderDetailsQuery = (id: string) => {
  return useQuery(orderDetailsOptions(id));
};
