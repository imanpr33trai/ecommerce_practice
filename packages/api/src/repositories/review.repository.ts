import type {
  CreateReviewInput,
  ReviewListOptions,
  UserReviewQueryInput,
} from "@ecommerceNextjs/types";

export interface ReviewRepository {
  findByProduct(productId: string, options: ReviewListOptions): Promise<unknown>;
  getSummary(productId: string): Promise<unknown>;
  findByUser(userId: string, options: UserReviewQueryInput): Promise<unknown>;
  create(userId: string, input: CreateReviewInput): Promise<unknown>;
  delete(userId: string, reviewId: string): Promise<void>;
}
