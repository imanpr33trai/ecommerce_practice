import { z } from "zod";
import prisma from "@ecomerceNextjs/db";
import { publicProcedure, router } from "..";

export const ProductRouter = router({
  getAll: publicProcedure.query(async () => {
    // 1. Fetch raw data from DB
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        discountPrice: true, // Needed to calculate isOnSale
        createdAt: true, // Needed to calculate isNew
        description: true,
        // Assuming your schema has these, if not, remove them or add them to schema
        // material: true,
        // colors: true,

        category: {
          select: { name: true, slug: true },
        },
        images: {
          take: 1,
          where: { isPrimary: true },
          select: { altText: true, url: true },
        },
        reviews: {
          select: { rating: true }, // We need the array to calculate average
        },
      },
    });

    // 2. Transform raw data into the shape the Frontend expects
    return products.map((product) => {
      // Calculate Average Rating
      const totalRating = product.reviews.reduce(
        (acc, curr) => acc + curr.rating,
        0
      );
      const averageRating =
        product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

      // Calculate IsNew (e.g., created in last 30 days)
      const isNew =
        (new Date().getTime() - new Date(product.createdAt).getTime()) /
          (1000 * 3600 * 24) <
        30;

      // Calculate IsSale
      const isOnSale =
        product.discountPrice !== null &&
        Number(product.discountPrice) < Number(product.price);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price), // Convert Decimal to JS Number
        discountPrice: product.discountPrice
          ? Number(product.discountPrice)
          : null,

        // Calculated fields
        rating: averageRating,
        isNew: isNew,
        isOnSale: isOnSale,

        // Relations
        category: product.category, // Can be null
        image: product.images[0]?.url || "/placeholder.jpg",

        // Mocking these if they don't exist in your schema yet
        // If you added them to schema, remove the "|| []" fallback
        colors: (product as any).colors || [],
        material: (product as any).material || "Standard",
      };
    });
  }),
});
