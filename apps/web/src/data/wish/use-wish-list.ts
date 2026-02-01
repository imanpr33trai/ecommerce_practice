import { queryOptions, useQuery } from "@tanstack/react-query";

import { wishKeys } from "@/data/wish/keys";
import { client } from "@/lib/hono-client";
import type { GetWishListResponse } from "@/data/wish/types";

const fetchWishList = async (): Promise<GetWishListResponse | null> => {
  const res = await client.wish.$get();

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  return await res.json();
};

export const wishListOptions = (isAuthenticated: boolean) => {
  return queryOptions({
    queryKey: wishKeys.user(),
    queryFn: () => fetchWishList(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isAuthenticated,
  });
};

export const useWishListQuery = (isAuthenticated: boolean) => {
  return useQuery(wishListOptions(isAuthenticated));
};
