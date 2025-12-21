import prisma from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../../index";

// --- 1. Validators & Selectors ---

/**
 * Selector for Cart Items.
 * Fetches product details needed for the Cart Drawer/Page.
 */

export const cartRouter = router({
    /**
     * Get Cart
     * Returns: Items, Subtotal, and Item Count
     */
    get: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        // 1. Fetch Cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: { where: { isPrimary: true }, take: 1 },
                                slug: true,
                                discountPrice: true,
                                stock: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            return null;
        }

        // 2. Compute Totals (Server Side Source of Truth)
        let subtotal = 0;
        let totalItems = 0;

        const items = cart.items.map((item) => {
            const price = Number(item.product.discountPrice ?? item.product.price);
            const lineTotal = price * item.quantity;

            subtotal += lineTotal;
            totalItems += item.quantity;

            return {
                ...item,
                // Helper: Is the quantity in cart > available stock?
                isOutOfStock: item.quantity > item.product.stock,
                product: {
                    ...item.product,
                    price: Number(item.product.price),
                    discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
                },
            };
        });

        return {
            id: cart.id,
            items,
            subtotal,
            totalItems,
        };
    }),

    /**
     * Add Item (Smart Upsert)
     * Handles: Creation, Incrementing, Stock Checks
     */
    addItem: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                quantity: z.number().min(1).default(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const { productId, quantity } = input;

            // A. Validate Product & Stock
            const product = await prisma.product.findUnique({
                where: { id: productId },
                select: { id: true, stock: true, isActive: true, name: true },
            });

            if (!product?.isActive) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not available",
                });
            }

            // B. Find or Create Cart
            let cart = await prisma.cart.findUnique({ where: { userId } });
            if (!cart) {
                cart = await prisma.cart.create({ data: { userId } });
            }

            // C. Check Existing Item in Cart
            const existingItem = await prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
            });

            // Calculate projected quantity
            const currentQty = existingItem ? existingItem.quantity : 0;
            const newQty = currentQty + quantity;

            if (newQty > product.stock) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: `Only ${product.stock} units of ${product.name} are available.`,
                });
            }

            // D. Upsert (Update or Create)
            return prisma.cartItem.upsert({
                where: {
                    cartId_productId: { cartId: cart.id, productId },
                },
                update: {
                    quantity: { increment: quantity },
                },
                create: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }),

    /**
     * Update Quantity (Strict Set)
     * Used by: Cart Sheet (+ / - buttons)
     */
    updateQuantity: protectedProcedure
        .input(
            z.object({
                itemId: z.string(), // We use cartItemId here for precision
                quantity: z.number().min(1),
            }),
        )
        .mutation(async ({ input }) => {
            const { itemId, quantity } = input;

            // 1. Fetch Item + Product Stock
            const item = await prisma.cartItem.findUnique({
                where: { id: itemId },
                include: { product: { select: { stock: true } } },
            });

            if (!item) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Item not found" });
            }

            // 2. Validate Stock
            if (quantity > item.product.stock) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: `Max stock available is ${item.product.stock}`,
                });
            }

            // 3. Update
            return prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity },
            });
        }),

    /**
     * Remove Single Item
     */
    removeItem: protectedProcedure.input(z.object({ itemId: z.string() })).mutation(async ({ ctx, input }) => {
        // Ensure user owns the cart item (Security)
        const item = await prisma.cartItem.findUnique({
            where: { id: input.itemId },
            include: { cart: true },
        });

        if (!item || item.cart.userId !== ctx.session.user.id) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Cannot remove this item",
            });
        }

        return prisma.cartItem.delete({
            where: { id: input.itemId },
        });
    }),

    /**
     * Clear Cart
     */
    clear: protectedProcedure.mutation(async ({ ctx }) => {
        const cart = await prisma.cart.findUnique({
            where: { userId: ctx.session.user.id },
        });
        if (!cart) {
            return;
        }

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        return { success: true };
    }),
});
