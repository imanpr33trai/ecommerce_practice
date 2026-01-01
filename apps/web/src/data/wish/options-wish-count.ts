import { useSuspenseQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

export const wishCountOptions = () => {
  const { data: session } = authClient.useSession();

  return trpc.wish.getIds.queryOptions(undefined, {
    staleTime: 1000 * 60 * 10,
    enabled: !!session,
  });
};

export const useWishListCountQuery = () => {
  const { data: ids } = useSuspenseQuery(wishCountOptions());

  return ids?.length ?? 0;
};
