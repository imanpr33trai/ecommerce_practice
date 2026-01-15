import { queryOptions, useQuery } from "@tanstack/react-query";

import { wishKeys } from "@/data/wish/keys";
import { authClient } from "@/lib/auth-client";
import { client } from "@/lib/hono-client";

export const wishCountOptions = (sessionExists: boolean) => {
  return queryOptions({
    queryFn: async () => {
      const res = await client.api.wish.ids.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch the count");
      }
      return res.json();
    },
    queryKey: wishKeys.ids(),
    staleTime: 1000 * 60 * 10,
    // Use skipToken for better type safety in v11
    enabled: sessionExists,
    // Select ensures that ONCE data arrives, it's a clean array
    select: (data) => data ?? [],
  });
};

export const useWishListCountQuery = () => {
  const { data: session } = authClient.useSession();

  // 1. Pass the session check to the options
  const { data, isLoading, error } = useQuery(wishCountOptions(!!session));


  // 2. The Final Fallback:
  // 'ids' will be undefined during: Loading, Error, or Disabled state.
  // Use Nullish Coalescing (??) to guarantee a return value.

  return {
     data,
    isLoading,
    error,
  };
};
