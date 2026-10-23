import { prisma } from "@ecommerceNextjs/db";
import type { Prisma } from "@ecommerceNextjs/db";
import type { ToggleWishInput } from "@ecommerceNextjs/types";

import type { WishlistRepository } from "../wishlist.repository";

export class PrismaWishlistRepository implements WishlistRepository {
  async findAll(userId: string) {
    return prisma.wish.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            description: true,
            stock: true,
            createdAt: true,
            colors: true,
            material: true,
            category: { select: { name: true, slug: true } },
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true, altText: true, id: true },
            },
            reviews: { select: { rating: true } },
          },
        },
      },
    });
  }

  async findIds(userId: string) {
    const wishes = await prisma.wish.findMany({
      where: { userId },
      select: { productId: true },
    });
    return wishes.map((w) => w.productId);
  }

  async toggle(userId: string, input: ToggleWishInput) {
    const { productId } = input;

    const existing = await prisma.wish.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await prisma.wish.delete({ where: { id: existing.id } });
      return { added: false, message: "Removed from wishlist" };
    } else {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });
      if (!product) {
        throw new Error("Product not found");
      }

      await prisma.wish.create({ data: { userId, productId } });
      return { added: true, message: "Added to wishlist" };
    }
  }

  async clear(userId: string) {
    const result = await prisma.wish.deleteMany({ where: { userId } });
    return result.count;
  }
}
