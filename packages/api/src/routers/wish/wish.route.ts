import prisma from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../../index";
import { wishItemSelect } from "./wish.type";

export const wishRouter = router({
    /**
     * Get All Wishlist Items
     * Usage: My Wishlist Page
     */


    getAll: protectedProcedure.query(async ({ ctx }) => {

        const userId = ctx.session.user.id;

        return prisma.wish.findMany({
            where: { userId },
            select: wishItemSelect,
            orderBy: { createdAt: "desc" },
        });
    }),

    /**
     * Check Status (Lightweight)
     * Usage: Product Grid (to color the heart icons red/grey)
     * Returns an array of Product IDs that the user has liked.
     */
    getIds: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const wishes = await prisma.wish.findMany({
            where: { userId },
            select: { productId: true },
        });

        // Return simple array: ['prod_123', 'prod_456']
        return wishes.map((w) => w.productId);
    }),

    /**
     * Toggle Wishlist Item
     * Usage: Clicking the Heart Button
     * Logic: If exists -> Remove. If not exists -> Add.
     */
    toggle: protectedProcedure.input(z.object({ productId: z.string() })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        const { productId } = input;

        // 1. Check if it exists
        const existing = await prisma.wish.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });

        if (existing) {
            // --- REMOVE ---
            await prisma.wish.delete({
                where: { id: existing.id },
            });
            return { added: false, message: "Removed from wishlist" };
        }
        // --- ADD ---

        // Robustness: Ensure product actually exists first
        const productExists = await prisma.product.findUnique({
            where: { id: productId },
            select: { id: true },
        });

        if (!productExists) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Product not found",
            });
        }

        await prisma.wish.create({
            data: {
                userId,
                productId,
            },
        });
        return { added: true, message: "Added to wishlist" };
    }),

    /**
     * Clear Wishlist
     * Usage: "Remove All" button
     */
    clear: protectedProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.session.user.id;
        await prisma.wish.deleteMany({
            where: { userId },
        });
        return { success: true, message: "Wishlist cleared" };
    }),
});
