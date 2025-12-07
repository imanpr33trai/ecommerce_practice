import prisma from "@ecomerceNextjs/db";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../index";
import { categoryTreeSelect } from "../types/index";

// --- 0. Helpers & Validators ---

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// --- 1. The Router ---

export const categoryRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = await prisma.category.findUnique({
        where: { slug: input.slug },
        include: {
          children: {
            include: { _count: { select: { products: true } } },
          },
          // 2. Get Products (for the grid)
          products: {
            take: 12,
            where: { isActive: true },
            include: {
              images: { where: { isPrimary: true }, take: 1 },
              category: { select: { name: true, slug: true } },
            },
            orderBy: { createdAt: "desc" },
          },
          // 3. Get Parent (for Breadcrumbs - simplified 1 level up)
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
              parent: { select: { name: true, slug: true } },
            },
          },
        },
      });
      if (!category) {
        return null;
      }
      return category;
    }),
  // --- QUERIES (Read) ---

  /**
   * Get Roots (The Main Navigation / Sidebar)
   * Fetches only top-level categories and their direct children.
   */
  getRoots: publicProcedure.query(async () => {
    return prisma.category.findMany({
      where: { parentId: null }, // Only top level
      select: categoryTreeSelect,
      orderBy: { name: "asc" },
    });
  }),

  /**
   * Get Flat List (For Admin Select Inputs)
   * Lightweight list of ID + Name.
   */
  getAllFlat: protectedProcedure.query(async () => {
    return prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: { name: "asc" },
    });
  }),

  /**
   * Get Single Category by Slug (For /category/[slug] Page)
   */

  // --- MUTATIONS (Write - Admin Only) ---

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name too short"),
        description: z.string().optional(),
        parentId: z.string().optional().nullable(), // Nullable for root
      })
    )
    .mutation(async ({ input }) => {
      // 1. Generate Slug
      let slug = slugify(input.name);

      // 2. Check for slug collision
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now()}`; // Fallback: append timestamp
      }

      return prisma.category.create({
        data: {
          name: input.name,
          slug,
          description: input.description,
          parentId: input.parentId || null,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        parentId: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      // Only update slug if name changed
      const slug = data.name ? slugify(data.name) : undefined;

      return prisma.category.update({
        where: { id },
        data: {
          ...data,
          slug, // will be undefined if name didn't change
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Robustness: Check if it has products first?
      // For now, we assume schema handles constraints or we force delete
      return prisma.category.delete({
        where: { id: input.id },
      });
    }),
});
