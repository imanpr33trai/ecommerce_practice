import { skipToken, useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

/**
 * Hook: Check if item is in wishlist
 * Usage: Product Cards (Heart Icon)
 */
export const wishListedOptions = (enabled: boolean) =>
  trpc.wish.getIds.queryOptions(undefined, {
    staleTime: 1000 * 60 * 10,
    enabled,
  });

export const useWishListedQuery = (productId?: string) => {
  const { data: session } = authClient.useSession();

  const canFetch = !!session && !!productId;

  const { data: ids } = useQuery(wishListedOptions(canFetch));

  if (!ids || !productId) {
    return false;
  }

  return ids.includes(productId);
};
