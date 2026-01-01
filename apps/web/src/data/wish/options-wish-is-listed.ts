import { skipToken, useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

/**
 * Hook: Check if item is in wishlist
 * Usage: Product Cards (Heart Icon)
 */
export const wishListedOptions = (productId: string | undefined, session: any) => {
  const canFetch = !!session && !!productId;

  return trpc.wish.getIds.queryOptions(canFetch ? undefined : skipToken, {
    staleTime: 1000 * 60 * 10,
  });
};

export const useWishListedQuery = (productId?: string) => {
  const { data: session, isPending } = authClient.useSession();

  const { data: ids } = useQuery(wishListedOptions(productId, isPending ? session : null));

  if (!ids || !productId) {
    return false;
  }

  return ids.includes(productId);
};
