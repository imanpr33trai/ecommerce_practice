import { AppError } from "@ecommerceNextjs/types";
import type { ToggleWishInput } from "@ecommerceNextjs/types";

import type { WishlistRepository } from "../repositories/wishlist.repository";
import type { ProductRepository } from "../repositories/product.repository";

/**
 * WishlistService handles wishlist-related business logic.
 * Depends on WishlistRepository and ProductRepository interfaces (injected via constructor).
 * No Prisma or Hono imports in service layer.
 */
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * Get full wishlist for user
   */
  async getAll(userId: string) {
    return this.wishlistRepository.findAll(userId);
  }

  /**
   * Get wishlist product IDs (lightweight)
   */
  async getIds(userId: string) {
    return this.wishlistRepository.findIds(userId);
  }

  /**
   * Toggle item in wishlist (add/remove)
   * @throws AppError with NOT_FOUND if product doesn't exist
   */
  async toggle(userId: string, input: ToggleWishInput) {
    const { productId } = input;

    // Verify product exists
    const product = await this.productRepository.findBySlug(productId);
    if (!product) {
      throw AppError.notFound("Product", productId);
    }

    return this.wishlistRepository.toggle(userId, input);
  }

  /**
   * Clear all items from wishlist
   */
  async clear(userId: string) {
    return this.wishlistRepository.clear(userId);
  }
}