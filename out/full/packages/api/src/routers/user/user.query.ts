import prisma from "@ecomerceNextjs/db";

import type { UpdateProfileInput } from "./user.types";

export const userQueries = {
  /**
   * Get Profile with Stats
   * Fetches User + Counts of Orders, Wishlist, Reviews, Addresses
   */
  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            order: true,
            wishList: true,
            reviews: true,
            address: true, // Ensure this matches your schema relation name (addresses vs address)
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },

  /**
   * Update Profile
   */
  updateProfile: async (userId: string, data: UpdateProfileInput) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        image: data.image,
      },
    });
  },
};
