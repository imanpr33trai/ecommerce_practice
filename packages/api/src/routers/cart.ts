import { protectedProcedure, publicProcedure, router } from "../index";
import { TRPCError } from "@trpc/server";
import { type CartWithItems } from 'db/types'
import prisma from "@ecomerceNextjs/db";

import z from "zod";

export const cartRouter = router({
    // getAll: publicProcedure.query(async ({ ctx }) => {
    //     const userId = 'user_4';
    //     // if (!userId) {
    //     //     console.log("No user ID found in session");
    //     //     // throw new TRPCError({
    //     //     //     code: 'UNAUTHORIZED',
    //     //     //     message: 'You must be logged in to view the cart'
    //     //     // });
    //     // }
    //     const cart = await prisma.cart.findFirst({
    //         where: { userId },
    //         include: {
    //             items: {
    //                 orderBy: { createdAt: 'asc' },
    //                 include: {
    //                     product: {
    //                         select: {
    //                             id: true,
    //                             name: true,
    //                             price: true,
    //                             images: { where: { isPrimary: true }, take: 1 },
    //                             slug: true,
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     })
    //     if (!cart) {
    //         const empty: CartWithItems = {
    //             id: null as any,
    //             userId,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //             items: [],
    //         }
    //         return empty
    //     }
    //     return cart
    // }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id

        // --- TEMPORARY DIAGNOSTIC LOGS ---
        const cart = await prisma.cart.findFirst({
            where: { userId },
        });

        if (!cart) {
            const empty: CartWithItems = {
                id: null as any,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [],
            }
            return empty
        }
        const cartWithIncludes = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: { where: { isPrimary: true }, take: 1 },
                                slug: true,
                            }
                        }
                    }
                }
            }
        });

        return cartWithIncludes;
    }),
    addToCart: publicProcedure.input(z.object({
        productId: z.string(),
        quantity: z.number().min(1),


    })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You must be logged in to add items to the cart'

            })
        }
        const cart = await prisma.cart.upsert({
            where: { userId, },
            create: { userId },
            update: {}
        })
        const cartItem = await prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: input.productId
                }
            },
            update: { quantity: { increment: input.quantity } },
            create: { cartId: cart.id, productId: input.productId, quantity: input.quantity },
            include: {
                product: true
            }

        })
        return cartItem;
    }),
    removeFromCart: publicProcedure.input(z.object({
        productId: z.string()
    })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user?.id || 'user_4';
        // if (!ctx.session?.user) {
        //     throw new TRPCError({
        //         code: "UNAUTHORIZED",
        //         message: "You must be logged in to remove an item from the cart"
        //     });
        // }
        const cart = await prisma.cart.findUnique({
            where: { userId: userId },

        })
        if (!cart) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Cart not found.",
            });
        }
        try {
            const deletedItem = await prisma.cartItem.delete({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: input.productId
                    }
                },
                include: {
                    product: true
                }

            })
            return deletedItem;
        } catch (error) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Cart item not found.",
            });
        }

    }),
    updateQuantity: publicProcedure.input(z.object({
        productId: z.string(),
        quantity: z.number().min(1)
    })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user?.id || 'user_4';
        // if (!ctx.session?.user) {
        //     throw new TRPCError({
        //         code: "UNAUTHORIZED",
        //         message: "You must be logged in to update the cart item quantity"
        //     })
        // }
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    orderBy: { createdAt: 'asc' },

                }
            }
        })
        const cartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart?.id || '',
                    productId: input.productId
                }
            },
            include: {
                product: true
            }


        })
        if (!cartItem) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Cart item not found"
            })
        }
        if (input.quantity < 1) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Quantity must be at least 1"
            })
        }
        return await prisma.cartItem.update({
            where: {
                id: cartItem.id,

            },
            data: {
                quantity: input.quantity
            },
            include: {
                product: true
            }

        })
    })

})