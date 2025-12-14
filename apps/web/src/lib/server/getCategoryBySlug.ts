import { createContext } from "@ecomerceNextjs/api/context";
import { createCaller } from "@ecomerceNextjs/api/routers/index";
import type { Prisma } from "@ecomerceNextjs/db";
import prisma from "@ecomerceNextjs/db";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    children: { include: { _count: { select: { products: true } } } };
    products: {
      take: 12;
      where: { isActive: true };
      include: {
        images: { where: { isPrimary: true }; take: 1 };
        category: { select: { name: true; slug: true } };
      };
      orderBy: { createdAt: "desc" };
    };
    parent: {
      select: { id: true; name: true; slug: true; parent: { select: {} } };
    };
  };
}>;

const ctx = await createContext({});

const caller = createCaller(ctx);

/**
 * Server-side helper to fetch the category page data for a given slug.
 * Returns `null` when the category doesn't exist.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryWithRelations | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: { include: { _count: { select: { products: true } } } },
      products: {
        take: 12,
        where: { isActive: true },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
          parent: { select: {} },
        },
      },
    },
  });

  return category;
}
