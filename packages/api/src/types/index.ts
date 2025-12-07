// import prisma from "@ecomerceNextjs/db";
import type { Prisma } from "@ecomerceNextjs/db";

export const productWithDetails = {
  include: {
    images: true,
    category: true,
    _count: { select: { reviews: true } },
  },
} satisfies Prisma.ProductDefaultArgs;

export type ProductWithDetails = Prisma.ProductGetPayload<
  typeof productWithDetails
>;

export type ProductWithCategoryAndReviewCount = Prisma.ProductGetPayload<{
  include: {
    images: { where: { isPrimary: true }; take: 1 };
    category: true;
    _count: { select: { reviews: true } };
  };
}>;

export type CategoryWithParent = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    parentId: true;
    parent: {
      select: {
        id: true;
        slug: true;
      };
    };
  };
}>;

export type ProductForList = Prisma.ProductGetPayload<{
  include: {
    images: { where: { isPrimary: true }; take: 1 };
    category: true;
    _count: { select: { reviews: true } };
  };
}>;

/**
 * Validator for the Product List Item.
 * We only fetch necessary fields to keep the query lightweight.
 */
export const productListSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  createdAt: true,
  stock: true,
  description: true,
  images: {
    where: { isPrimary: true },
    select: {
      url: true,
      altText: true,
    },
    take: 1,
  },
  category: {
    select: { name: true, slug: true },
  },
  _count: {
    select: { reviews: true },
  },
} satisfies Prisma.ProductSelect;

/**
 * Validator for the Full Product Detail.
 * Fetches everything needed for the PDP (Product Detail Page).
 */
export const productDetailInclude = {
  images: true,
  category: true,
  reviews: {
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, image: true } } },
  },
  _count: { select: { reviews: true } },
} satisfies Prisma.ProductInclude;

export const wishItemSelect = {
  id: true,
  productId: true,
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      discountPrice: true,
      stock: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
    },
  },
  createdAt: true,
} satisfies Prisma.WishSelect;

// 1. Validator for Cart Data
export const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" }, // Newest items first
  },
} satisfies Prisma.CartInclude;

/**
 * Validator for the Category Tree (Menu/Sidebar)
 * Includes children and the count of products.
 */
export const categoryTreeSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  _count: { select: { products: true } },
  children: {
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  },
} satisfies Prisma.CategorySelect;

/**
 * Validator for the Single Category Page
 * Includes "Featured" products for that category to show instantly.
 */
export const categoryPageInclude = {
  children: true,
  products: {
    take: 8, // Show top 8 products immediately
    where: { isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  },
} satisfies Prisma.CategoryInclude;

// Export Types for Frontend
export type CategoryTreeItem = Prisma.CategoryGetPayload<{
  select: typeof categoryTreeSelect;
}>;
export type CategoryPageData = Prisma.CategoryGetPayload<{
  include: typeof categoryPageInclude;
}>;
