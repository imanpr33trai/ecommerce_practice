import z from "zod";
import type { Prisma } from "@ecomerceNextjs/db";

export const CreateReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5).int(),
  comment: z.string().max(500).optional(),
});

export const ReviewListSchema = z.object({
  productId: z.string(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(5),
  sort: z.enum(["newest", "highest", "lowest"]).default("newest"),
});

/**
 * Selector for Review Display
 * Only fetch necessary user info (privacy).
 */
export const reviewSelect = {
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
