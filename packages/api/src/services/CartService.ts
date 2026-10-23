import type { AddItemInput } from "@ecommerceNextjs/types";

import type { CartRepository } from "../repositories/cart.repository";

/**
 * CartService handles cart-related business logic.
 * Depends on CartRepository interface (injected via constructor).
 * No Prisma or Hono imports in service layer.
 */
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  /**
   * Get user's cart with calculated totals
   */
  async getCart(userId: string) {
    return this.cartRepository.findByUserId(userId);
  }

  /**
   * Add item to cart
   * @throws AppError with NOT_FOUND if product doesn't exist
   * @throws AppError with VALIDATION_ERROR if color is invalid
   * @throws AppError with OUT_OF_STOCK if quantity exceeds stock
   */
  async addItem(userId: string, input: AddItemInput) {
    return this.cartRepository.addItem(userId, input);
  }

  /**
   * Update item quantity
   * @throws AppError with NOT_FOUND if item not found or access denied
   * @throws AppError with OUT_OF_STOCK if quantity exceeds stock
   */
  async updateQuantity(userId: string, itemId: string, quantity: number) {
    return this.cartRepository.updateQuantity(userId, itemId, quantity);
  }

  /**
   * Remove item from cart
   * @throws AppError with NOT_FOUND if item not found or access denied
   */
  async removeItem(userId: string, itemId: string) {
    return this.cartRepository.removeItem(userId, itemId);
  }

  /**
   * Clear all items from cart
   */
  async clearCart(userId: string) {
    return this.cartRepository.clearCart(userId);
  }
}