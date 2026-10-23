import { prisma } from "@ecommerceNextjs/db";
import type { Prisma, User } from "@ecommerceNextjs/db";
import type { UpdateProfileInput } from "@ecommerceNextjs/types";

import type { UserRepository } from "../user.repository";

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByIdWithStats(id: string): Promise<
    | (User & {
        _count: {
          order: number;
          wishList: number;
          reviews: number;
          address: number;
        };
      })
    | null
  > {
    return prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            order: true,
            wishList: true,
            reviews: true,
            address: true,
          },
        },
      },
    });
  }

  async updateProfile(id: string, data: UpdateProfileInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image,
      },
    });
  }
}
