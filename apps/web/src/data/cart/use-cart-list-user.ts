import { queryOptions, useQuery } from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";

import { authClient } from "@/lib/auth-client";
import { client } from "@/lib/hono-client";

import { cartKeys } from "./keys";
import type { GetCartUserListResponse } from "./types";

export const fetchUserCart = async (): Promise<GetCartUserListResponse | null> => {
  const res = await client.cart.$get();

  if (res.status === 401) {
    return null;
  }
  if (!res.ok) {
    throw new HTTPException(404, { message: "Faild to fetch cart" });
  }

  return await res.json();
};

/**
 * Hook: Get Cart
 * Usage: Cart Sheet, Navbar Badge, Checkout Page
 */
export const cartListItemsOptions = (enabled: boolean) => {
  return queryOptions({
    queryKey: cartKeys.userCart(),
    queryFn: () => fetchUserCart(),
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
