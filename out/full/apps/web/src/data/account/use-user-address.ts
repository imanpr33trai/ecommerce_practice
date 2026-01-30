import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono-client";

import { accountKeys } from "./keys";

const fetchAddress = async () => {
  const res = await client.api.address.$get();

  if (!res.ok) {
    throw new Error("Failed to fetch the addresses");
  }
  return res.json();
};

export const userAddressesOptions = () => {
  return queryOptions({
    queryKey: accountKeys.addresslist,
    queryFn: () => fetchAddress(),

    staleTime: 1000 * 60 * 10, // 1 min
  });
};

export const useUserAddressQuery = () => {
  return useQuery(userAddressesOptions());
};
