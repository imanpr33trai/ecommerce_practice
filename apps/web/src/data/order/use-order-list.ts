import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { orderKeys } from "@/data/order/keys";
import { client } from "@/lib/hono-client";
import type { GetListOrdersResponse } from "@/data/order/type";

// Extract the data type from the response
interface OrderListData {
  id: string;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  items: Array<{
    id: string;
    product: {
      name: string;
      slug: string;
      images: Array<{ url: string; altText?: string }>;
      price: string | number;
    };
    quantity: number;
  }>;
}

const listOrdersFn = async (): Promise<OrderListData[]> => {
  const res = await client.order.$get();

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Failed to parse orders data",
  }))) as GetListOrdersResponse;

  if (!res.ok || result.success === false) {
    const errorMessage = "error" in result ? result.error : "Failed to fetch orders";
    throw new Error(errorMessage);
  }

  return "data" in result ? (result.data as OrderListData[]) : [];
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
