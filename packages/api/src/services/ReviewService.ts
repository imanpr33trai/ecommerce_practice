import { AppError } from "@ecommerceNextjs/types";
import type {
  CreateReviewInput,
  ReviewListOptions,
  UserReviewQueryInput,
} from "@ecommerceNextjs/types";

import type { ReviewRepository } from "../repositories/review.repository";
import type { ProductRepository } from "../repositories/product.repository";

/**
 * ReviewService handles review-related business logic.
 * Depends on ReviewRepository and ProductRepository interfaces (injected via constructor).
 * No Prisma or Hono imports in service layer.
 */
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * List reviews for a product
   */
  async listByProduct(productId: string, options: ReviewListOptions) {
    return this.reviewRepository.findByProduct(productId, options);
  }

  /**
   * Get review summary (stats) for a product
   */
  async getSummary(productId: string) {
    return this.reviewRepository.getSummary(productId);
  }

  /**
   * List reviews by the current user
   */
  async listByUser(userId: string, options: UserReviewQueryInput) {
    return this.reviewRepository.findByUser(userId, options);
  }

  /**
   * Create a review
   * @throws AppError with CONFLICT if user already reviewed this product
   * @throws AppError with NOT_FOUND if product doesn't exist
   */
  async create(userId: string, input: CreateReviewInput) {
    // Check if product exists
    const product = await this.productRepository.findBySlug(input.productId);
    if (!product) {
      throw AppError.notFound("Product", input.productId);
    }

    // Check if user already reviewed this product
    const existingReviews = await this.reviewRepository.findByUser(userId, {
      page: 1,
      limit: 100, // Large limit to check all reviews
    });
    
    const hasReviewed = (existingReviews as any).items?.some(
      (r: any) => r.productId === input.productId
    );
    
    if (hasReviewed) {
      throw AppError.conflict("You have already reviewed this product.");
    }

    return this.reviewRepository.create(userId, input);
  }

  /**
   * Delete a review
   * @throws AppError with NOT_FOUND if review doesn't exist
   * @throws AppError with FORBIDDEN if unauthorized
   */
  async delete(userId: string, reviewId: string) {
    return this.reviewRepository.delete(userId, reviewId);
  }
}