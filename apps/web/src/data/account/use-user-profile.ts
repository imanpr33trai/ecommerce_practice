import { queryOptions, useQuery } from "@tanstack/react-query";

import { accountKeys } from "@/data/account/keys";
import { client } from "@/lib/hono-client";
import type { GetProfileResponse } from "@/data/account/types";

/**
 * Type inference for the Profile response
 */

/**
 * 1. Standalone Function (Fetcher)
 */
const getProfileFn = async () => {
  const res = await client.api.user.me.$get();

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Failed to parse profile data",
  }))) as GetProfileResponse;

  if (!res.ok || result.success === false) {
    // Type-safe property access for the union type
    const errorMessage = "error" in result ? result.error : "Failed to fetch profile";
    throw new Error(errorMessage);
  }

  // Returns the 'data' property which contains the profile
  return "data" in result ? result.data : null;
};

/**
 * 2. Query Options Configuration
 * Using queryOptions (standard in 2026) for better reusability and prefetching
 */
export const userProfileOptions = () =>
  queryOptions({
    queryKey: accountKeys.profile(), // You can replace this with your constant key like userKeys.profile
    queryFn: () => getProfileFn(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

/**
 * 3. React Hook
 */
export const useUserProfileQuery = () => {
  return useQuery(userProfileOptions());
};
