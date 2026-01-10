import prisma, { type Prisma } from "@ecomerceNextjs/db";

import type { ReviewListOptions } from "./review.type";

// Selector to ensure we only send necessary public data
const reviewSelect = {
  id: true,
  rating: true,
  comment: true,
  createdAt: true,
  user: {
    select: {
      name: true,
      image: true,
    },
  },
} satisfies Prisma.ReviewSelect;

export const reviewQueries = {
  /**
   * List Reviews for a Product
   */
  listByProduct: async (productId: string, options: ReviewListOptions) => {
    const { limit, page, sort } = options;

    const where: Prisma.ReviewWhereInput = { productId };

    let orderBy: Prisma.ReviewOrderByWithRelationInput = { createdAt: "desc" };

    if (sort === "highest") {
      orderBy = { rating: "desc" };
    }
    if (sort === "lowest") {
      orderBy = { rating: "asc" };
    }

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
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get Review Summary (Stats)
   */
  getSummary: async (productId: string) => {
    const aggregations = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId },
      _count: { rating: true },
    });

    const totalReviews = aggregations.reduce((acc, curr) => acc + curr._count.rating, 0);

    const weightedSum = aggregations.reduce(
      (acc, curr) => acc + curr.rating * curr._count.rating,
      0,
    );

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
  } /**
   * List Reviews By the Current User
   * Used for: "My Account" -> "My Reviews"
   */,
  listByUser: async (userId: string, options: UserReviewQueryInput) => {
    const { page, limit } = options;

    const where = { userId };

    const [total, reviews] = await prisma.$transaction([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        // Include Product details so the user knows what they reviewed
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      }),
    ]);

    return {
      items: reviews.map((r) => ({
        ...r,
        productImage: r.product.images[0]?.url || "/placeholder.jpg",
      })),
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Create a Review
   * Logic: Users can only review a product ONCE.
   */
  create: async (userId: string, input: CreateReviewInput) => {
    // 1. Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: {
        userId,
        productId: input.productId,
      },
    });

    if (existing) {
      throw new Error("You have already reviewed this product.");
    }

    // 2. Create Review
    return prisma.review.create({
      data: {
        userId,
        ...input,
      },
    });
  },

  /**
   * Delete a Review
   * Logic: Ensure the user actually owns the review.
   */
  delete: async (userId: string, reviewId: string) => {
    // 1. Check Ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId !== userId) {
      throw new Error("Unauthorized to delete this review");
    }

    // 2. Delete
    return prisma.review.delete({
      where: { id: reviewId },
    });
  },
};
