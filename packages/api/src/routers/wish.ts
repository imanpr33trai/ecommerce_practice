import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import prisma from "prisma";
import z from "zod";



export const wishRouter = router({
    removeWish: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        if (!ctx.session?.user.id) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You must be logged in to remove a wish"
            });
        }
        try {
            return await prisma.wish.delete({
                where: {
                    userId_productId: {
                        productId: input.id,
                        userId: ctx.session?.user.id
                    }

                },
                include: {
                    product: true
                }
            })
        } catch (error) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Wish not found"
            })
        }
    }),
    createWish: protectedProcedure.input(z.object({
        productId: z.string()
    })).mutation(async ({ ctx, input }) => {
        if (!ctx.session?.user.id) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You must be have logged in"
            })
        }
        return await prisma.wish.upsert({
            where: {
                userId_productId: {
                    productId: input.productId,
                    userId: ctx.session.user.id
                }
            },
            update: {},
            create: {
                userId: ctx.session.user.id,
                productId: input.productId
            }
        })
    }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;
        const wishList = await prisma.wish.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: { where: { isPrimary: true }, take: 1 },
                        slug: true,
                        discountPrice: true,
                        description: true,

                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return wishList
    }),
    addOrRemove: protectedProcedure.input(z.object({
        productId: z.string()
    })).mutation(async ({ ctx, input }) => {
        if (!ctx.session.user.id) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You must be logged in to add or remove a wish"
            })
        }
        const existingWish = await prisma.wish.findUnique({
            where: {
                userId_productId: {
                    userId: ctx.session.user.id,
                    productId: input.productId
                }
            },
            select: {
                id: true,
            }
        })
        if (existingWish) {
            await prisma.wish.delete({
                where: {
                    id: existingWish.id
                }
            })
        }
        else {
            await prisma.wish.create({
                data: {
                    userId: ctx.session.user.id,
                    productId: input.productId
                }
            })
        }
    }),
    toggle: protectedProcedure.input(z.object({
        productId: z.string().cuid(),
        productName: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        const {
            productId,
            productName
        } = input

        const existingWish = await prisma.wish.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId

                }
            }
        });
        if (existingWish) {
            await prisma.wish.delete({
                where: { id: existingWish.id },
            })
            return { success: true, action: "removed", productId, productName }
        } else {
            await prisma.wish.create({
                data: {
                    userId, productId
                }
            })
            return { success: true, action: 'added', productId, productName }
        }
    })

})