import {
  mutationOptions,
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { wishKeys } from "@/data/wish/keys";
import { client } from "@/lib/hono-client";

const deleteWishes = async () => {
  const res = await client.wish.$delete();

  if (!res.ok) {
    throw new Error("Failed to clear wishlist");
  }
  return await res.json(); // This is the new state (added or removed)
};

/**
 * Mutation: Clear All
 */
export const wishClearOptions = (utils: QueryClient) => {
  return mutationOptions({
    mutationFn: () => deleteWishes(),

    onSuccess: () => {
      toast.success("Wishlist cleared");
      utils.invalidateQueries({
        queryKey: [wishKeys.ids(), wishKeys.user()],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      utils.invalidateQueries({ queryKey: wishKeys.user() });
    },
  });
};

export const useWishClearMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(wishClearOptions(queryClient));
};
