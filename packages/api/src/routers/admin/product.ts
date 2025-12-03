import { adminProcedure, router } from "@/lib/trpc";
import prisma from "prisma";
import z from "zod";
import { type } from 'db/types'

export const adminRouter = router({
    getAllProducts: adminProcedure.input(z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().cuid().nullish(),
        search: z.string().nullish(),
        categoryId: z.string().cuid().nullish(),
        isActive: z.boolean().nullish()
    }).optional()).query(async ({ input }) => {
        const limit = input?.limit ?? 10;
        const { categoryId, cursor, search, isActive } = input || {}

        const products = await prisma.product.findMany({
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            where: {
                OR: search ? [
                    { name: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } }
                ] : undefined,
                categoryId: categoryId || undefined,
                isActive: isActive || undefined,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                images: true,
                _count: { select: { reviews: true, orderItems: true } }
            }
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (products.length > limit) {
            const nextItem = products.pop();
            nextCursor = nextItem?.id;
        }
        return {
            items: products as ProductFo
        }

    })
})