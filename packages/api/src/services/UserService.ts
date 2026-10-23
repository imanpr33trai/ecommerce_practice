import { AppError } from "@ecommerceNextjs/types";
import type { UpdateProfileInput } from "@ecommerceNextjs/types";

import type { UserRepository } from "../repositories/user.repository";

/**
 * UserService handles user-related business logic.
 * Depends on UserRepository interface (injected via constructor).
 * No Prisma or Hono imports in service layer.
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Get user profile with stats (order count, wishlist count, review count, address count)
   * @throws AppError with NOT_FOUND code if user doesn't exist
   */
  async getProfile(userId: string) {
    const user = await this.userRepository.findByIdWithStats(userId);

    if (!user) {
      throw AppError.notFound("User", userId);
    }

    return user;
  }

  /**
   * Update user profile (name, image)
   * @throws AppError with NOT_FOUND code if user doesn't exist
   */
  async updateProfile(userId: string, data: UpdateProfileInput) {
    // Check if user exists first
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw AppError.notFound("User", userId);
    }

    return this.userRepository.updateProfile(userId, data);
  }
}
