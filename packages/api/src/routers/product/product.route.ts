import prisma from "@ecomerceNextjs/db"; // Adjust path to your db package
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "@ecomerceNextjs/db";

import { publicProcedure, router } from "../../index"; // Adjust path to your trpc init
import { INITIAL_PRODUCT_FILTERS, ProductFilterSchema } from "./product.type";


// --- 3. The Router ---

export const productRouter = router({
  getLandingProducts: publicProcedure
    .input(
      z.object({
        // Limits
        limit: z.number().min(1).max(20).default(8),

        // Context Filters (Optional)
        categorySlug: z.string().optional(),

        // Landing Page Flags
        isNew: z.boolean().default(false),        // "New Arrivals"
        isExclusive: z.boolean().default(false),  // "Exclusive Deals" (Discounted)
        isGreatValue: z.boolean().default(false), // "Great Value" (Low Price)
      })
    )
    .query(async ({ input }) => {
      const { limit, categorySlug, isNew, isExclusive, isGreatValue } = input;

      // 1. Build Dynamic WHERE Clause
      const where: Prisma.ProductWhereInput = {
        isActive: true, // Always show active only
        stock: { gt: 0 }, // Don't show OOS items on landing page
      };

      // Filter: Category
      if (categorySlug) {
        where.category = { slug: categorySlug };
      }

      // Filter: "New Deals" (Created in last 30 days)
      if (isNew) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        where.createdAt = { gte: thirtyDaysAgo };
      }

      // Filter: "Exclusive Deals" (Must have a discount)
      if (isExclusive) {
        where.discountPrice = { not: null };
      }

      // 2. Build Dynamic ORDER BY Clause
      let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

      if (isGreatValue) {
        // Great Value = Lowest Price first
        orderBy = [{ price: "asc" }];
      } else if (isExclusive) {
        // Exclusive = Biggest discount (Logic depends on DB, usually just newest discounted)
        // Alternatively, order by creation date to show fresh deals
        orderBy = [{ createdAt: "desc" }];
      } else {
        // Default = Newest first
        orderBy = [{ createdAt: "desc" }];
      }

      // 3. Execute Query
      const products = await prisma.product.findMany({
        where,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true, material: true,

          discountPrice: true,
          stock: true, colors: true,
          createdAt: true, description: true,
          category: {
            select: { name: true, slug: true },
          },
          images: {
            where: { isPrimary: true }, // Only fetch the main image
            take: 1,
            select: { url: true, altText: true, id: true },
          },
          _count: {
            select: { reviews: true },
          },
          reviews: { select: { rating: true } }
        },
      });

      // 4. Transform Data (Decimal -> Number, Add Helper Props)
      return products.map((p) => {
        const price = Number(p.price);
        const discountPrice = p.discountPrice ? Number(p.discountPrice) : null;
        const avgRating = p.reviews.length > 0 ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length : 0;
        // Calculate Discount Percentage for badges (e.g., "-20%")
        let discountPercentage = 0;
        if (discountPrice) {
          discountPercentage = Math.round(((price - discountPrice) / price) * 100);
        }

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price,
          createdAt:p.createdAt,
          stock:p.stock,
          reviews:p.reviews,
          rating: avgRating,
          description: p.description || "",
          discountPrice,
          isNew: (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24) < 30,
          isOnSale: !!p.discountPrice,
          colors: p.colors || null,
          discountPercentage: discountPercentage > 0 ? discountPercentage : null,
          category: p.category,
          images: p.images, // Safe fallback
          material: p.material || [],
          reviewCount: p._count.reviews,
        };
      });
    }),

  /**
   * List Products (Filtered & Paginated)
   */
  list: publicProcedure.input(ProductFilterSchema.default(INITIAL_PRODUCT_FILTERS)) // Make filters optional
    .query(async ({ input }) => {


      const placeholderProducts = await prisma.product.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        // Apply filters in the actual query
        where: {
          isActive: true, // Example filter
          // Add your input filter logic here
        },
        select: {
          id: true, name: true, slug: true, price: true, discountPrice: true, description: true,
          stock: true, createdAt: true, colors: true, material: true,
          category: { select: { name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1, select: { url: true, altText: true, id: true } },
          reviews: { select: { rating: true } },
        }
      });

      // Transform data for frontend (Decimal to Number, etc.)
      const transformedProducts = placeholderProducts.map(p => ({
        ...p,createdAt:p.createdAt,
        price: Number(p.price),category:p.category,colors:p.colors,material:p.material,
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        rating: p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
        isNew: (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24) < 30,
        isOnSale: !!p.discountPrice,

      }));

      // Dummy pagination
      return {
        items: transformedProducts,
        pagination: {
          total: 100, // Replace with actual count
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(100 / input.limit),
          hasNextPage: input.page * input.limit < 100
        }
      };
    }),

  /**
   * Get Filter Options (Facets)
   * Fetches distinct values for categories, materials, colors from active products.
   */
  getFilters: publicProcedure.query(async () => {
    // 1. Fetch Categories with Product Counts
    const categories = await prisma.category.findMany({
      where: { parentId: null }, // Fetch top-level categories for main navigation
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    // 2. Fetch Unique Attributes (Materials & Colors) in ONE query
    const attributesData = await prisma.product.findMany({
      where: { isActive: true }, // Only from active products
      select: { material: true, colors: true },
    });

    // 3. Process Materials
    const uniqueMaterials = Array.from(
      new Set(attributesData.flatMap((p) => p.material || []))
    )
      .filter(Boolean) // Remove any empty strings or nulls
      .sort();

    // 4. Process Colors
    const uniqueColors = Array.from(
      new Set(attributesData.flatMap((p) => p.colors || []))
    )
      .filter(Boolean)
      .sort();

    return {
      categories,
      materials: uniqueMaterials,
      colors: uniqueColors,
    };
  }),

  /**
   * Get Product by Slug
   */
  getBySlug: publicProcedure.input(
    z.object({
      slug: z.string(),
    })
  )
    .query(async ({ input }) => {
      // FIX 2: Use findUnique so we can handle the null state manually below
      const product = await prisma.product.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          name: true,
          price: true,
          discountPrice: true,
          createdAt: true,
          description: true,
          material: true,
          colors: true,
          slug: true, stock: true,
          category: {
            select: { name: true, slug: true },
          },
          images: {
            take: 1,
            where: { isPrimary: true },
            select: { altText: true, url: true, id: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      });

      // FIX 3: Now this check actually works
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with slug '${input.slug}' not found`,
        });
      }

      // --- Transformation Logic ---

      const totalRating = product.reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

      const isNew = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 3600 * 24) < 30;

      const isOnSale = product.discountPrice !== null && Number(product.discountPrice) < Number(product.price);

      return {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        rating: averageRating,
        reviews: product.reviews,
        isNew,
        createdAt: product.createdAt,
        stock: product.stock,
        isOnSale,
        slug: product.slug,
        category: product.category,
        images: product.images,
        colors: product.colors || [], // Add fallback if array is null
        material: product.material,
      };
    }),

});
