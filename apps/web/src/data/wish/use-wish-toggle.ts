import {
    mutationOptions,
    type QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { wishKeys } from "@/data/wish/keys";
import type { GetWishListIDsResponse, GetWishToggleResponse } from "@/data/wish/types";
import { client } from "@/lib/hono-client";

/**
 * 1. Standalone Function
 */
const toggleWishFn = async (productId: string): Promise<GetWishToggleResponse> => {
  const res = await client.wish.toggle.$post({
    json: { productId },
  });

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Network error",
  }))) as GetWishToggleResponse;

  if (!res.ok || result.success === false) {
    const errorMessage = "error" in result ? result.error : "Failed to update wishlist";
    throw new Error(errorMessage);
  }

  return result;
};

/**
 * 2. Mutation Options
 */
export const wishToggleOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: toggleWishFn,

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: wishKeys.ids() });

      const previous = queryClient.getQueryData<GetWishListIDsResponse>(wishKeys.ids());

      const previousIds = previous?.data ?? [];

      const nextIds = previousIds.includes(productId)
        ? previousIds.filter((id) => id !== productId)
        : [...previousIds, productId];

      queryClient.setQueryData<GetWishListIDsResponse>(wishKeys.ids(), {
        success: true,
        data: nextIds,
      });

      return { previous };
    },

    onError: (error, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(wishKeys.ids(), context.previous);
      }
      toast.error(error.message);
    },

    onSuccess: (data) => {
      if ("data" in data) {
        toast.success(data.data.message);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [wishKeys.ids(), wishKeys.count()] });
    },
  });

/**
 * 3. Hook
 */
export const useWishToggleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(wishToggleOptions(queryClient));
};

// useToggle: () => {
//   const utils = useQueryClient();
//   const toggleKey = trpc.wish.toggle.mutationKey();

//   return useMutation(
//     trpc.wish.toggle.mutationOptions({
//       // 1. OPTIMISTIC UPDATE
//       onMutate: async ({ productId }) => {
//         // Cancel outgoing refetches
//         await utils.cancelQueries({ queryKey: trpc.wish.getIds.queryKey() });
//         // await utils.wish.getIds.cancel();

//         // Snapshot previous value
//         const previousIds = utils.getQueryData(trpc.wish.getIds.queryKey());

//         // const previousIds = utils.wish.getIds.getData();

//         // Optimistically update the cache
//         utils.setQueryData(trpc.wish.getIds.queryKey(), (oldIds) => {
//           if (!oldIds) {
//             return [productId]; // Initialize if empty
//           }
//           return oldIds.includes(productId)
//             ? oldIds.filter((id) => id !== productId) // Remove
//             : [...oldIds, productId]; // Add
//         });

//         return { previousIds };
//       },

//       // 2. ERROR HANDLING
//       onError: (error, newVariables, context) => {
//         // Rollback to snapshot
//         utils.setQueryData(trpc.wish.getIds.queryKey(), context?.previousIds);
//         console.log(error);
//         toast.error("Failed to update wishlist");
//       },

//       // 3. SETTLED
//       onSettled: () => {
//         utils.invalidateQueries({ queryKey: [trpc.wish.getAll.queryKey(), trpc.wish.getIds.queryKey()] });
//         // utils.wish.getIds.invalidate();
//         // utils.wish.getAll.invalidate(); // Refresh the list page too
//       },

//       // 4. SUCCESS FEEDBACK
//       onSuccess: (data) => {
//         toast.success(data.message, { duration: 2000 });
//         console.log(data);
//       },
//     }),
//   );
// },
