import { prisma } from "@ecommerceNextjs/db";
import type { Prisma, Product } from "@ecommerceNextjs/db";
import type { ProductFilters, ProductSuggestionInput } from "@ecommerceNextjs/types";
import type { ProductRepository } from "../product.repository";

export class PrismaProductRepository implements ProductRepository {
  async findMany(filters: ProductFilters) {
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
      default:
        orderBy = [{ createdAt: "desc" }];
        break;
    }

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

    const products = rawProducts.map((p) => {
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
  }

  async findFilterOptions() {
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

    const attributesData = await prisma.product.findMany({
      where: { isActive: true },
      select: { material: true, colors: true },
    });

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
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { name: true, slug: true } },
        images: { select: { url: true, altText: true, id: true } },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { rating: true, comment: true, user: { select: { name: true } } },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) return null;

    const p = product as unknown as Product;
    const result = Object.assign({}, p, {
      price: Number(product.price),
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    });
    return result;
  }

  async findSuggestions(input: ProductSuggestionInput) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: input.query, mode: "insensitive" } },
          { category: { name: { contains: input.query, mode: "insensitive" } } },
        ],
      },
      take: 5,
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
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      categoryName: p.category?.name ?? null,
      image: p.images[0]?.url || "/placeholder.jpg",
    }));
  }
}