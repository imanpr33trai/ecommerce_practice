import { queryOptions, useQuery } from "@tanstack/react-query";

import { wishKeys } from "@/data/wish/keys";
import type { GetWishListIDsResponse } from "@/data/wish/types";
import { client } from "@/lib/hono-client";

const fetchWishListIDs = async (): Promise<GetWishListIDsResponse | null> => {
  const res = await client.wish.ids.$get();

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch wishlist IDs");
  }

  return await res.json();
};

/**
 * Hook: Check if item is in wishlist
 * Usage: Product Cards (Heart Icon)
 */
export const wishListedOptions = (enabled: boolean) =>
  queryOptions({
    queryKey: wishKeys.ids(),
    queryFn: () => fetchWishListIDs(),
    staleTime: 1000 * 60 * 10,
    enabled,
  });

export const useWishListedQuery = (isAuthenticated: boolean, productId?: string) => {
  const canFetch = isAuthenticated && !!productId;

  const { data: ids } = useQuery(wishListedOptions(canFetch));

  if (!ids || !productId) {
    return false;
  }

  return ids.data.includes(productId);
};
