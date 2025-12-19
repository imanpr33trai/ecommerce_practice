import { trpc } from "@/trpc/server"; // Your server proxy

export const wishOptions = {
    /**
     * Prefetch the full wishlist for the /wishlist page
     */
    getAll: () => {
        return trpc.wish.getAll.queryOptions();
    },

    /**
     * Prefetch IDs (Useful for Product Listing Pages to show hearts immediately)
     */
    getIds: () => {
        return trpc.wish.getIds.queryOptions();
    },
};