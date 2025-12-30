import prisma from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../../index";

export const wishRouter = router({
  /**
   * Get All Wishlist Items
   * Usage: My Wishlist Page
   */

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const product = await prisma.wish.findMany({
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
            images: { where: { isPrimary: true }, take: 1, select: { url: true, altText: true, id: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
    });

    const transformedProducts = product.map((p) => {
      const avgRating = p.product.reviews.length > 0 ? p.product.reviews.reduce((s, r) => s + r.rating, 0) / p.product.reviews.length : 0;

      return {
        name: p.product.name,
        slug: p.product.slug,
        description: p.product.description,
        stock: p.product.stock,
        images: p.product.images,
        category: p.product.category,
        reviews: p.product.reviews,
        id: p.product.id,
        createdAt: p.product.createdAt,
        price: Number(p.product.price),
        discountPrice: p.product.discountPrice ? Number(p.product.discountPrice) : null,
        rating: avgRating,
        isNew: (Date.now() - new Date(p.product.createdAt).getTime()) / (1000 * 3600 * 24) < 30,
        isOnSale: !!p.product.discountPrice,

        // Ensure arrays are not null
        colors: p.product.colors || [],
        material: p.product.material || [],
      };
    });
    return transformedProducts;
  }),

  /**
   * Check Status (Lightweight)
   * Usage: Product Grid (to color the heart icons red/grey)
   * Returns an array of Product IDs that the user has liked.
   */
  getIds: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const wishes = await prisma.wish.findMany({
      where: { userId },
      select: { productId: true },
    });

    // Return simple array: ['prod_123', 'prod_456']
    return wishes.map((w) => w.productId);
  }),

  /**
   * Toggle Wishlist Item
   * Usage: Clicking the Heart Button
   * Logic: If exists -> Remove. If not exists -> Add.
   */
  toggle: protectedProcedure.input(z.object({ productId: z.string() })).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const { productId } = input;

    // 1. Check if it exists
    const existing = await prisma.wish.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      // --- REMOVE ---
      await prisma.wish.delete({
        where: { id: existing.id },
      });
      return { added: false, message: "Removed from wishlist" };
    }
    // --- ADD ---

    // Robustness: Ensure product actually exists first
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!productExists) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Product not found",
      });
    }

    await prisma.wish.create({
      data: {
        userId,
        productId,
      },
    });
    return { added: true, message: "Added to wishlist" };
  }),

  /**
   * Clear Wishlist
   * Usage: "Remove All" button
   */
  clear: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    await prisma.wish.deleteMany({
      where: { userId },
    });
    return { success: true, message: "Wishlist cleared" };
  }),
  getWishCount: publicProcedure.query(async ({ ctx }) => {
    if (!ctx) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Login",
      });
    }
    const wished = await prisma.wish.findMany({
      where: { userId: ctx.session?.user.id },
      select: {
        id: true,
      },
    });
    return wished;
  }),
});
3;
