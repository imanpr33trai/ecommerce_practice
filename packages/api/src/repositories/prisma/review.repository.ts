import { prisma } from "@ecommerceNextjs/db";
import type { Prisma } from "@ecommerceNextjs/db";
import type {
  CreateReviewInput,
  ReviewListOptions,
  UserReviewQueryInput,
} from "@ecommerceNextjs/types";

import type { ReviewRepository } from "../review.repository";

const reviewSelect = {
  id: true,
  rating: true,
  userId: true,
  comment: true,
  createdAt: true,
  user: { select: { name: true, image: true } },
} satisfies Prisma.ReviewSelect;

export class PrismaReviewRepository implements ReviewRepository {
  async findByProduct(productId: string, options: ReviewListOptions) {
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
      pagination: { total, page, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSummary(productId: string) {
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

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    aggregations.forEach((g) => {
      distribution[g.rating] = g._count.rating;
    });

    return { average, total: totalReviews, distribution };
  }

  async findByUser(userId: string, options: UserReviewQueryInput) {
    const { page, limit } = options;

    const [total, reviews] = await prisma.$transaction([
      prisma.review.count({ where: { userId } }),
      prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true, id: true, altText: true },
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
      pagination: { total, page, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(userId: string, input: CreateReviewInput) {
    return prisma.review.create({
      data: { userId, ...input },
    });
  }

  async delete(userId: string, reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.userId !== userId) {
      throw new Error("Unauthorized to delete this review");
    }

    await prisma.review.delete({ where: { id: reviewId } });
  }
}
