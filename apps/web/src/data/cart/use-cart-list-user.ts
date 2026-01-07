import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

/**
 * Hook: Get Cart
 * Usage: Cart Sheet, Navbar Badge, Checkout Page
 */
export const cartListItemsOptions = (enabled: boolean) => {
  return trpc.cart.get.queryOptions(undefined, {
    // Don't cache cart too long (stock changes, price changes)
    staleTime: 0,
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const useCartListItemsQuery = () => {
  const { data } = authClient.useSession();
  return useQuery(cartListItemsOptions(!!data));
};
