import { useSuspenseQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

/**
 * Hook to get a single order by ID.
 * Usage: Order detail page.
 */
export const orderDetailOptions = (orderId: string, enabled: boolean) => {
  return trpc.order.getById.queryOptions(
    { id: orderId },
    {
      enabled: !!orderId && enabled,
      staleTime: 1000 * 60 * 5,
      retry: false, // Don't retry if order not found
    },
  );
};

export const useOrderDetailQuery = (orderId: string) => {
  const { data: session } = authClient.useSession();
  return useSuspenseQuery(orderDetailOptions(orderId, !!session));
};
