import { useSuspenseQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

/**
 * Hook to get all orders for the current user.
 * Usage: Account -> Orders tab.
 */
export const orderListOptions = (enabled: boolean) => {
  return trpc.order.list.queryOptions(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });
};

export const useOrderListQuery = () => {
  const { data: session } = authClient.useSession();
  return useSuspenseQuery(orderListOptions(!!session));
};
