import { trpc } from "@/utils/trpc"
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner"

export const useReview = {
    addReview: () => {
        const reviewOptions = trpc.review.addReview.mutationOptions({
            onSuccess: (data, variables) => {
                toast.success("Review added successfully!");
            },
            onError: (error) => toast.error(error.message),
        })
        return useMutation({
            ...reviewOptions,
        })
    },
    reviewsByProductId: (productId: string | undefined) => {
        const queryOptions = trpc.review.getReviewsByProductId.queryOptions({
            productId: productId ?? ''
        });

        return useQuery({
            ...queryOptions,
            enabled: !!productId,
            retry: false,
            staleTime: 0,
        });
    },
}