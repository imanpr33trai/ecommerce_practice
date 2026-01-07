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
        isNew: z.boolean().default(false), // "New Arrivals"
        isExclusive: z.boolean().default(false), // "Exclusive Deals" (Discounted)
        isGreatValue: z.boolean().default(false), // "Great Value" (Low Price)
      }),
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
          price: true,
          material: true,

          discountPrice: true,
          stock: true,
          colors: true,
          createdAt: true,
          description: true,
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
          reviews: { select: { rating: true } },
        },
      });

      // 4. Transform Data (Decimal -> Number, Add Helper Props)
      return products.map((p) => {
        const price = Number(p.price);
        const discountPrice = p.discountPrice ? Number(p.discountPrice) : null;
        const avgRating =
          p.reviews.length > 0
            ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
            : 0;
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
          createdAt: p.createdAt,
          stock: p.stock,
          reviews: p.reviews,
          rating: avgRating,
          description: p.description || "",
          discountPrice,
          isNew: (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24) < 30,
          isOnSale: !!p.discountPrice,
          colors: p.colors || null,
          discountPercentage: discountPercentage > 0 ? discountPercentage : null,
          category: p.category,
          images: p.images || [], // Safe fallback
          material: p.material || [],
          reviewCount: p._count.reviews,
        };
      });
    }),

  /**
   * List Products (Filtered & Paginated)
   */
  list: publicProcedure.input(ProductFilterSchema).query(async ({ input }) => {
    const filters = {
      ...INITIAL_PRODUCT_FILTERS,
      ...input,
    };
    const {
      categories,
      colors,
      inStock,
      limit,
      materials,
      maxPrice,
      minPrice,
      onSale,
      page,
      rating,
      search,
      sort,
    } = filters;
    // --- 1. BUILD DYNAMIC WHERE CLAUSE ---
    const where: Prisma.ProductWhereInput = {
      isActive: true,

      // Price Range
      price: {
        gte: minPrice,
        lte: maxPrice,
      },

      // Search (Name or Description)
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,

      // Categories (Relation Filter)
      // Checks if product.category.name is in the array
      category: categories.length > 0 ? { name: { in: categories } } : undefined,

      // Materials (String Array Column)
      // Uses 'hasSome' to check overlap
      material: materials.length > 0 ? { hasSome: materials } : undefined,

      // Colors (String Array Column)
      colors: colors.length > 0 ? { hasSome: colors } : undefined,

      // Toggles
      discountPrice: onSale ? { not: null } : undefined,
      stock: inStock ? { gt: 0 } : undefined,
    };

    // --- 2. BUILD SORT ORDER ---
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sort) {
      case "price_asc":
        orderBy = [{ price: "asc" }];
        break;
      case "price_desc":
        orderBy = [{ price: "desc" }];
        break;
      case "rating":
        orderBy = [{ reviews: { _count: "desc" } }];
        break; // Proxy for rating
      // case "newest":
      default:
        orderBy = [{ createdAt: "desc" }];
        break;
    }

    // --- 3. EXECUTE QUERY (Count + Data) ---
    // We use a transaction to get the total count based on the *current filters*
    // so pagination works correctly with filtered results.
    const [total, rawItems] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
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
      }),
    ]);

    // --- 4. TRANSFORM DATA ---
    const transformedProducts = rawItems.map((p) => {
      const avgRating =
        p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;

      return {
        ...p,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        rating: avgRating,
        isNew: (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24) < 30,
        isOnSale: !!p.discountPrice,

        // Ensure arrays are not null
        colors: p.colors || [],
        material: p.material || [],
      };
    });

    // Optional: Post-filter by strict rating if database sort wasn't enough
    const finalItems = rating
      ? transformedProducts.filter((i) => i.rating >= rating)
      : transformedProducts;

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
    const uniqueMaterials = Array.from(new Set(attributesData.flatMap((p) => p.material || [])))
      .filter(Boolean) // Remove any empty strings or nulls
      .sort();

    // 4. Process Colors
    const uniqueColors = Array.from(new Set(attributesData.flatMap((p) => p.colors || [])))
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
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
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
          slug: true,
          stock: true,
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
      const averageRating =
        product.reviews.length > 0 ? Number((totalRating / product.reviews.length).toFixed(1)) : 0;
      const isNew = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 3600 * 24) < 30;

      const isOnSale =
        product.discountPrice !== null && Number(product.discountPrice) < Number(product.price);

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
    }) /**
   * Real-time Search Suggestions
   * Lightweight query for the Navbar dropdown
   */,
  getSuggestions: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: input.query, mode: "insensitive" } },
            { category: { name: { contains: input.query, mode: "insensitive" } } },
          ],
        },
        take: 5, // Limit to 5 results for the dropdown
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          category: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        },
      });

      return products.map((p) => ({
        ...p,
        price: Number(p.price),
        image: p.images[0]?.url || "/placeholder.jpg",
      }));
    }),
});
