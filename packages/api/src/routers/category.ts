import { publicProcedure, router } from "../lib/trpc";
import type { CategoryWithChildren, SimpleCategory } from "db/types";
import { TRPCError } from "@trpc/server";
import prisma from "prisma";
import z from "zod";

export const CategoryRouter = router({
    getAllCategories: publicProcedure.query(async () => {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,

            }
        })
        return categories
    }),
    getTopLevelCategories: publicProcedure.query(async () => {
        const categories: SimpleCategory[] = await prisma.category.findMany({
            where: {
                parentId: null,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                _count: { select: { products: true } },
            },
            orderBy: { name: 'asc' }
        });
        return categories;
    }),
    getCategoryWithChildrenBySlug: publicProcedure.input(z.object({
        slug: z.string().min(1, { message: 'Category slug cannot be empty' }),
    }))
        .query(async ({ input }) => {
            const category: CategoryWithChildren | null = await prisma.category.findUnique({
                where: { slug: input.slug },
                include: {
                    children: {
                        select: {
                            id: true, name: true, slug: true, _count: { select: { products: true } },
                        },
                        orderBy: { name: 'asc' },

                    }
                    , _count: { select: { products: true } }
                }
            });
            if (!category) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Category with slug ${input.slug} not found`
                })
            }
            return category
        })
})