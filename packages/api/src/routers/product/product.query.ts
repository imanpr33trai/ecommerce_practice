import prisma, { type Prisma } from "@ecomerceNextjs/db";

import type { ProductFilters } from "./product.type";

export const productQueries = {
  /**
   * Fetch filtered, sorted, and paginated products
   */
  getProducts: async (filters: ProductFilters) => {
    const {
      page,
      limit,
      sort,
      search,
      minPrice,
      maxPrice,
      onSale,
      inStock,
      rating,
      categories,
      materials,
      colors,
    } = filters;

    // 1. Build WHERE Clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      price: { gte: minPrice, lte: maxPrice },
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      category: categories ? { name: { in: categories } } : undefined,
      material: materials ? { hasSome: materials } : undefined,
      colors: colors ? { hasSome: colors } : undefined,
      discountPrice: onSale === true ? { not: null } : undefined,
      stock: inStock === true ? { gt: 0 } : undefined,
    };

    // 2. Build ORDER BY
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
        break;
      case "newest":
      default:
        orderBy = [{ createdAt: "desc" }];
        break;
    }

    // 3. Execute DB Transaction
    const [total, rawProducts] = await prisma.$transaction([
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
          description: true,
          discountPrice: true,
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

    // 4. Transform Data
    const products = rawProducts.map((p) => {
      // Calculate Stats
      const totalRating = p.reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating =
        p.reviews.length > 0 ? Number((totalRating / p.reviews.length).toFixed(1)) : 0;

      const price = Number(p.price);
      const discountPrice = p.discountPrice ? Number(p.discountPrice) : null;
      let discountPercentage = null;

      if (discountPrice) {
        discountPercentage = Math.round(((price - discountPrice) / price) * 100);
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price,
        description: p.description,
        discountPrice,
        discountPercentage,
        rating: averageRating,
        isNew: (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24) < 30,
        isOnSale: !!discountPrice,
        stock: p.stock,
        colors: p.colors || [],
        material: p.material || [],
        category: p.category,
        images: p.images || [],
        reviewCount: p.reviews.length,
      };
    });

    // 5. Post-Query Filter (Rating)
    const finalProducts = rating ? products.filter((p) => p.rating >= rating) : products;

    return {
      items: finalProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  },

  /**
   * Fetch Facets (Filter Options)
   */
  getFilterOptions: async () => {
    // Categories
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

    // Attributes
    const attributesData = await prisma.product.findMany({
      where: { isActive: true },
      select: { material: true, colors: true },
    });

    // Flatten & Unique
    const uniqueMaterials = Array.from(new Set(attributesData.flatMap((p) => p.material || [])))
      .filter(Boolean)
      .sort();

    const uniqueColors = Array.from(new Set(attributesData.flatMap((p) => p.colors || [])))
      .filter(Boolean)
      .sort();

    return {
      categories,
      materials: uniqueMaterials,
      colors: uniqueColors,
    };
  } /**
   * Get Single Product by Slug (Detailed View)
   */,
  getBySlug: async (slug: string) => {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { name: true, slug: true } },
        // Fetch all images for the detail gallery
        images: { select: { url: true, altText: true, id: true } },
        // Fetch preview reviews
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { rating: true, comment: true, user: { select: { name: true } } },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!p) {
      return null;
    }

    // Transform Data
    const price = Number(p.price);
    const discountPrice = p.discountPrice ? Number(p.discountPrice) : null;

    // Stats
    const totalRating = p.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating =
      p.reviews.length > 0 ? Number((totalRating / p.reviews.length).toFixed(1)) : 0;

    let discountPercentage = 0;
    if (discountPrice) {
      discountPercentage = Math.round(((price - discountPrice) / price) * 100);
    }

    return {
      ...p,
      price,
      discountPrice,
      discountPercentage,
      rating: averageRating,
      isNew: (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24) < 30,
      isOnSale: !!discountPrice,
      colors: p.colors || [],
      material: p.material || [],
      // Ensure at least one image exists for UI safety
      images: p.images || [],
      reviewCount: p._count.reviews,
    };
  },

  /**
   * Get Search Suggestions (Lightweight)
   * Optimized for Navbar Dropdown
   */
  getSuggestions: async (query: string) => {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: 5, // Limit to 5 results
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      },
    });

    // Minimal Transformation
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      categoryName: p.category?.name,
      image: p.images[0]?.url || "/placeholder.jpg",
    }));
  },
};
