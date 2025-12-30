import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/server"; // Your server proxy

export const wishOptions = {
  /**
   * Prefetch the full wishlist for the /wishlist page
   */
  getAll: () => {
    return useQuery(trpc.wish.getAll.queryOptions());
  },

  /**
   * Prefetch IDs (Useful for Product Listing Pages to show hearts immediately)
   */
  getIds: () => {
    return useQuery(trpc.wish.getIds.queryOptions());
  },
};
