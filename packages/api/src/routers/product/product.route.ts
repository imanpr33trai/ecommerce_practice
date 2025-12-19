import { z } from "zod";
import { router, publicProcedure } from "../../index"; // Adjust path to your trpc init
import prisma from "@ecomerceNextjs/db"; // Adjust path to your db package
import type { Prisma } from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import { ProductFilterSchema } from "./product.type";

// --- 1. Validation Schemas ---

/**
 * Filter Input Schema
 * Defaults are applied here to keep the controller logic clean.
 */


// --- 2. Query Optimization (Prisma Selectors) ---

/**
 * List Selector:
 * We explicitly select ONLY the fields needed for a Product Card.
 * This prevents fetching heavy 'description' text or unused relations for 20+ items.
 */

// --- 3. The Router ---

export const productRouter = router({
  /**
   * List Products (Filtered & Paginated)
   */
  list: publicProcedure.input(ProductFilterSchema)
    .query(async ({ input }) => {
      const {
        categories, colors, materials,
        minPrice, maxPrice,
        onSale, inStock, rating, search,
        sort, page, limit
      } = input;

      // --- A. Build Dynamic 'WHERE' Clause ---
      const where: Prisma.ProductWhereInput = {
        isActive: true,

        // 1. Price Range
        price: {
          gte: minPrice,
          lte: maxPrice,
        },

        // 2. Categories
        // Checks if product.category.name is inside the input array
        category: categories.length > 0
          ? { name: { in: categories } }
          : undefined,

        // 3. Materials (FIXED)
        // Since 'material' is String[], use 'hasSome'.
        // Meaning: If product has ['Wood', 'Iron'] and filter is ['Wood'], it matches.
        material: materials.length > 0
          ? { hasSome: materials }
          : undefined,

        // 4. Colors (FIXED)
        // Since 'colors' is String[], use 'hasSome'.
        colors: colors.length > 0
          ? { hasSome: colors }
          : undefined,

        // 5. Toggles
        discountPrice: onSale ? { not: null } : undefined,
        stock: inStock ? { gt: 0 } : undefined,

        // 6. Search
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      };

      // --- B. Build 'ORDER BY' Clause ---
      let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

      switch (sort) {
        case 'price_asc':
          orderBy = [{ price: 'asc' }];
          break;
        case 'price_desc':
          orderBy = [{ price: 'desc' }];
          break;
        case 'rating':
          // Sort by review count/rating is complex in Prisma without raw SQL.
          // Using a proxy: Sort by products with most reviews for now.
          orderBy = [{ reviews: { _count: 'desc' } }];
          break;
        // case 'newest':
        default:
          orderBy = [{ createdAt: 'desc' }];
          break;
      }

      // --- C. Execute Query ---
      const [total, rawItems] = await prisma.$transaction([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
          // Select only necessary fields
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            stock: true,
            createdAt: true,
            colors: true,
            material: true,
            category: { select: { name: true, slug: true } },
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true, altText: true }
            },
            reviews: { select: { rating: true } },
          },
        }),
      ]);

      // --- D. Transform & Filter Data ---
      const items = rawItems.map((p) => {
        // Calculate Rating
        const avgRating = p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          discountPrice: p.discountPrice ? Number(p.discountPrice) : null,

          // Calculated
          rating: avgRating,
          isNew: (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24) < 30,
          isOnSale: !!p.discountPrice,

          // Data
          category: p.category,
          images: p.images,
          colors: p.colors || [],     // Handle null array
          material: p.material || [], // Handle null array
        };
      });

      // Post-Query Filter for Rating (if specific star count requested)
      const finalItems = rating
        ? items.filter(i => i.rating >= rating)
        : items;

      return {
        items: finalItems,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
        },
      };
    }),


  /**
   * Get Product by Slug
   */
  getBySlug: publicProcedure
    // FIX 1: Input must be an object schema
    .input(z.object({
      slug: z.string()
    }))
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
          slug: true,
          category: {
            select: { name: true, slug: true },
          },
          images: {
            take: 1,
            where: { isPrimary: true },
            select: { altText: true, url: true },
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
        isNew: isNew,
        isOnSale: isOnSale,
        slug: product.slug,
        category: product.category,
        images: product.images,
        colors: product.colors || [], // Add fallback if array is null
        material: product.material,
      };
    }),

  getFilters: publicProcedure.query(async () => {
    // 1. Fetch Categories (Needs separate query for the relation count)
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    // 2. Fetch All Attributes (Materials & Colors) in ONE query
    // We don't use 'distinct' here because these are arrays. 
    // We fetch all of them and process them in JavaScript.
    const attributesData = await prisma.product.findMany({
      where: {
        isActive: true, // Only get attributes from active products
      },
      select: {
        material: true, // This is String[]
        colors: true,   // This is String[]
      },
    });

    // 3. Process Materials
    // Logic: [[Wood, Metal], [Wood, Plastic]] -> [Wood, Metal, Wood, Plastic] -> Set(Wood, Metal, Plastic)
    const uniqueMaterials = Array.from(
      new Set(attributesData.flatMap((p) => p.material || []))
    )
      .filter(Boolean) // Remove empty strings or nulls
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


});
