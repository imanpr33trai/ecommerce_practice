import { trpc } from "@/utils/trpc"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner";

export const useCart = {
    addToCart: () => {
        return useMutation(trpc.cart.addToCart.mutationOptions({
            onSuccess: (data, variables) => {

                toast.success(`Added To Cart. `);

            },
            onError: (error) => toast.error(error.message),
        }))
    },
    removeItem: () => {
        const { refetch } = useQuery(trpc.cart.getAll.queryOptions());
        return useMutation(
            trpc.cart.removeFromCart.mutationOptions({
                onSuccess: (data, variables) => {
                    refetch();
                    toast.success(`Removed from cart.`);
                },
                onError: (error) => toast.error(error.message),
            })
        )
    },
    getAll: () => {
        return useQuery(trpc.cart.getAll.queryOptions())
    },
    updateQuantity: () => {
        const { refetch } = useQuery(trpc.cart.getAll.queryOptions());
        return useMutation(
            trpc.cart.updateQuantity.mutationOptions({
                onSuccess: (data, variables) => {
                    refetch();
                    toast.success(`Updated quantity for ${variables.productId}.`);
                },
                onError: (error) => toast.error(error.message),
            })
        );
    }


}