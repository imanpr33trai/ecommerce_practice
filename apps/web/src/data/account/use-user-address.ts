import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono-client";
import type { GetAddressListResponse } from "@/data/account/types";

import { accountKeys } from "./keys";

export interface AddressData {
  id: string;
  fullName: string;
  streetLine1: string;
  streetLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const fetchAddress = async (): Promise<AddressData[]> => {
  const res = await client.address.$get();

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Failed to parse addresses data",
  }))) as GetAddressListResponse;

  if (!res.ok || result.success === false) {
    const errorMessage = "error" in result ? result.error : "Failed to fetch addresses";
    throw new Error(errorMessage);
  }

  return "data" in result ? (result.data as AddressData[]) : [];
};

export const userAddressesOptions = () => {
  return queryOptions({
    queryKey: accountKeys.addresslist,
    queryFn: () => fetchAddress(),

    staleTime: 1000 * 60 * 10, // 1 min
  });
};

export const useUserAddressQuery = () => {
  return useQuery(userAddressesOptions()) as import('@tanstack/react-query').UseQueryResult<AddressData[], Error>;
};
