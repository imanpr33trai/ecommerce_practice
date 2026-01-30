import prisma from "@ecomerceNextjs/db";

// Selector for the "My Wishlist" Page

export const wishQueries = {
  /**
   * Get Full Wishlist (For the Wishlist Page)
   */
  getAll: async (userId: string) => {
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

    const transformedProducts = product.map((p) => {
      const avgRating =
        p.product.reviews.length > 0
          ? p.product.reviews.reduce((s, r) => s + r.rating, 0) / p.product.reviews.length
          : 0;
      const price = Number(p.product.price);
      let discountPercentage = null;
      const discountPrice = p.product.discountPrice ? Number(p.product.discountPrice) : null;
      if (discountPrice) {
        discountPercentage = Math.round(((price - discountPrice) / price) * 100);
      }
      return {
        name: p.product.name,
        slug: p.product.slug,
        description: p.product.description,
        stock: p.product.stock,
        discountPercentage,
        reviewCount: p.product.reviews.length,
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
  },

  /**
   * Get Wishlist IDs (Lightweight)
   * Used for Product Cards to color the heart icon
   */
  getIds: async (userId: string) => {
    const wishes = await prisma.wish.findMany({
      where: { userId },
      select: { productId: true },
    });
    return wishes.map((w) => w.productId);
  },

  /**
   * Toggle Item (Smart Add/Remove)
   */
  toggle: async (userId: string, productId: string) => {
    // 1. Check existence
    const existing = await prisma.wish.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      // --- REMOVE ---
      await prisma.wish.delete({
        where: { id: existing.id },
      });
      return { added: false, message: "Removed from wishlist" };
    } else {
      // --- ADD ---

      // Verify product exists first to prevent FK errors
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      await prisma.wish.create({
        data: { userId, productId },
      });
      return { added: true, message: "Added to wishlist" };
    }
  },

  /**
   * Clear All
   */
  clear: async (userId: string) => {
    const clear = await prisma.wish.deleteMany({
      where: { userId },
    });

    return clear.count;
  },
};
