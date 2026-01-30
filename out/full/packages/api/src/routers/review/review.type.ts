import { z } from "zod";

// Validates the ?page=1&sort=highest part of the URL
export const ReviewQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(5),
  sort: z.enum(["newest", "highest", "lowest"]).default("newest"),
});

// Helper type for the query function arguments
export type ReviewListOptions = z.infer<typeof ReviewQuerySchema>;

// Schema for Creating a Review
export const CreateReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000, "Comment too long").optional(),
});

// Schema for Query Params (e.g. Pagination for 'My Reviews')
export const UserReviewQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type UserReviewQueryInput = z.infer<typeof UserReviewQuerySchema>;
