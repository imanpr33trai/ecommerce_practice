import { queryOptions, useQuery } from "@tanstack/react-query";

import { wishKeys } from "@/data/wish/keys";
import { client } from "@/lib/hono-client";
import type { GetWishListResponse } from "@/data/wish/types";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    images: Array<{ url: string; altText?: string }>;
  };
}

const fetchWishList = async (): Promise<WishlistItem[] | null> => {
  const res = await client.wish.$get();

  if (res.status === 401) {
    return null;
  }

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Failed to parse wishlist data",
  }))) as GetWishListResponse;

  if (!res.ok || result.success === false) {
    const errorMessage = "error" in result ? result.error : "Failed to fetch wishlist";
    throw new Error(errorMessage);
  }

  return "data" in result ? (result.data as WishlistItem[]) : null;
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
