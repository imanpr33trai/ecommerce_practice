import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import type { ReviewWithUser } from "db/types";
import { TRPCError } from "@trpc/server";
import prisma from "prisma";
import z from "zod";

export const ReviewRouter = router({
    getReviewsByProductId: publicProcedure.input(
        z.object({ productId: z.string().cuid() })
    ).query(async ({ input }) => {
        const reviews: ReviewWithUser[] = await prisma.review.findMany({
            where: { productId: input.productId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, image: true } }
            }
        });
        return reviews;

    }),
    addReview: protectedProcedure.input(
        z.object({
            productId: z.string().cuid(),
            rating: z.number().int().min(1).max(5),
            comment: z.string().min(5).max(100, "Comment must be less than 100 characters"),
            productSlug: z.string()
        })
    ).mutation(async ({ ctx, input }) => {
        const { comment, productId, rating } = input;
        const userId = ctx.session?.user.id

        if (!userId) {
            throw new Error("User must be logged in to add a review.");
        }

        const newReview = await prisma.review.create({
            data: {
                productId
                , userId,
                rating,
                comment
            }
        })
        return newReview
    }),
    deleteReview: protectedProcedure.input(z.object({
        reviewId: z.string().cuid(),
        productId: z.string().cuid(),
        productSlug: z.string()
    })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id

        try {
            const deleteReview = await prisma.review.delete({
                where: {
                    id: input.reviewId,
                    userId: userId
                },
            });
            return deleteReview;
        } catch (error) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Review not found"
            })
        }

    })
})