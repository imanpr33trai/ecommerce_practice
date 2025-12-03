import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';               // 👈 1. Import toast directly from sonner
import { trpc } from '@/utils/trpc';        // Your tRPC client

/**
 * A custom hook to manage all wishlist-related mutations (add, remove).
 * This centralizes logic for cache invalidation and user feedback.
 */
export const useWish = {
    //   const utils = trpc.useUtils();

    // Renamed from `removeWish` to `removeItem` for clarity, as it's the mutation object
    removeWish: () => useMutation(
        // 2. Call `createMutationOptions` and pass your configuration object to it
        trpc.wish.removeWish.mutationOptions({
            // `onSuccess` and `onError` are now properties of this options object
            onSuccess: (data, variables) => {
                // `data` is the return value from your backend mutation
                // `variables` is the input you passed to `.mutate()`

                // Invalidate the query to refetch the user's wishlist
                // utils.wishlist.get.invalidate();

                toast.success("Removed from Wishlist", {
                    // The backend returns the full product, so we can use its name
                    description: `${data.product.name} has been removed.`,
                });
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.message,
                });
            },
        })
    ),
    getAll: () => {
        return useQuery(trpc.wish.getAll.queryOptions())
    },



    // You could add another mutation for adding an item here
    // const addWish = useMutation({ ... });
    addWish: () => {
        return useMutation(trpc.wish.createWish.mutationOptions({
            onSuccess: (data, variables) => {
                toast.success("Added to Wishlist", {
                    description: `${variables.productId} has been added to your wishlist.`
                })

            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.message
                })
            }
        }))
    },
    addOrRemove: () => {
        return useMutation(trpc.wish.addOrRemove.mutationOptions({
            onSuccess: (data, variables) => {
                toast.success("added or Removed", { description: `${variables.productId} has been updated.` })
            },
            onError: (error) => {
                toast.error("Error", { description: error.message })
            }
        }))
    },

    toggleWish: () => {
        return useMutation(trpc.wish.toggle.mutationOptions({
            onSuccess: (data, variables) => {
                const { refetch } = useQuery(trpc.wish.getAll.queryOptions());
                refetch()

                const actionMessage = data.action === 'added' ? 'Added to Wishlist!' : 'Removed from Wishlist'
                const description = `${variables.productName || 'Item'} has been ${data.action}.` // This line is already correct based on the last diff.
                toast.success(actionMessage, { description });
            },
            onError: (error) => {
                toast.error("Error", { description: error.message });
            }
        }))
    },


};
