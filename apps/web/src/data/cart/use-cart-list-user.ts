import { queryOptions, useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { GetCartUserListResponse } from "./types";
import { client } from "@/lib/hono-client";

import { HTTPException } from "hono/http-exception";
import { cartKeys } from "./keys";
import { User } from "@ecomerceNextjs/auth";


export const fetchUserCart= async (): Promise<GetCartUserListResponse | null> =>{
  const res = await client.api.cart.$get();

  if(res.status===401){
    return null
  }
  if(!res.ok){
    throw new HTTPException(404,{message:"Faild to fetch cart"})
  }

  return await res.json()
}

/**
 * Hook: Get Cart
 * Usage: Cart Sheet, Navbar Badge, Checkout Page
 */
export const cartListItemsOptions = (enabled: boolean) => {
  return queryOptions( {
    queryKey:cartKeys.userCart(),
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
