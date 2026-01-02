import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

/**
 * Mutation: Clear All
 */
export const wishClearOptions = () => {
  const utils = useQueryClient();
  return trpc.wish.clear.mutationOptions({
    onSuccess: () => {
      toast.success("Wishlist cleared");
      utils.invalidateQueries({
        queryKey: [trpc.wish.getIds.queryKey(), trpc.wish.getAll.queryKey()],
      });
    },
  });
};

export const useWishClearMutation = () => {
  return useMutation(wishClearOptions());
};
