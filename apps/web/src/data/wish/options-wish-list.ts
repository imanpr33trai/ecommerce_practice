import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

export const wishListOptions = () => {
  const { data: session } = authClient.useSession();

  return trpc.wish.getAll.queryOptions(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!session,
  });
};

export const useWishListQuery = () => {
  return useSuspenseQuery(wishListOptions());
};
