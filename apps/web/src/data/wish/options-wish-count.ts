import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

export const wishCountOptions = (sessionExists: boolean) => {
  return trpc.wish.getIds.queryOptions(undefined, {
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
  const { data: ids, isLoading, error } = useQuery(wishCountOptions(!!session));

  // 2. The Final Fallback:
  // 'ids' will be undefined during: Loading, Error, or Disabled state.
  // Use Nullish Coalescing (??) to guarantee a return value.
  return {
    data: ids?.length ?? 0,
    isLoading,
    error,
  };
};
