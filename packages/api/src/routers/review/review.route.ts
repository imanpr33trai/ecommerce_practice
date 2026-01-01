import prisma from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import z from "zod";
import type { Prisma } from "@ecomerceNextjs/db";

import { protectedProcedure, publicProcedure, router } from "../..";
import { CreateReviewSchema, ReviewListSchema, reviewSelect } from "./review.type";

export const reviewRouter = router({
  listByProduct: publicProcedure.input(ReviewListSchema).query(async ({ input }) => {
    const { limit, page, productId, sort } = input;

    const where: Prisma.ReviewWhereInput = { productId };

    let orderBy: Prisma.ReviewOrderByWithRelationInput = { createdAt: "desc" };

    if (sort === "highest") orderBy = { rating: "desc" };
    if (sort === "lowest") orderBy = { rating: "asc" };

    const [total, reviews] = await prisma.$transaction([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy,
        select: reviewSelect,
      }),
    ]);
    return {
      items: reviews,
      pagination: {
        total,
        page,
        totaPages: Math.ceil(total / limit),
      },
    };
  }) /**
   * Get Review Summary (Stats)
   * Returns: Average rating, total count, and distribution (e.g. 5 stars: 10, 4 stars: 2)
   */,
  getSummary: publicProcedure.input(z.object({ productId: z.string() })).query(async ({ input }) => {
    const aggregations = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId: input.productId },
      _count: { rating: true },
    });

    const totalReviews = aggregations.reduce((acc, curr) => acc + curr._count.rating, 0);
    const weightedSum = aggregations.reduce((acc, curr) => acc + curr.rating * curr._count.rating, 0);
    const average = totalReviews > 0 ? weightedSum / totalReviews : 0;

    // Transform into a cleaner object: { 5: 10, 4: 2, ... }
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    aggregations.forEach((g) => {
      distribution[g.rating] = g._count.rating;
    });

    return {
      average,
      total: totalReviews,
      distribution,
    };
  }),

  /**
   * Create Review (Protected)
   * Enforces: One review per product per user.
   */
  create: protectedProcedure.input(CreateReviewSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    // 1. Check for existing review
    const existing = await prisma.review.findFirst({
      where: { userId, productId: input.productId },
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "You have already reviewed this product.",
      });
    }

    // 2. (Optional) Check if user actually purchased the item?
    // const hasPurchased = ... (complex query on Orders)

    // 3. Create
    return prisma.review.create({
      data: {
        userId,
        ...input,
      },
    });
  }),

  /**
   * Delete Review (Protected)
   * Only the author can delete.
   */
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const review = await prisma.review.findUnique({ where: { id: input.id } });

    if (!review || review.userId !== ctx.session.user.id) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return prisma.review.delete({
      where: { id: input.id },
    });
  }),
});
