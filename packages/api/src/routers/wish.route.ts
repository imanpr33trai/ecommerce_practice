import prisma from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../index";
import { wishItemSelect } from "../types/index";

export const wishRouter = router({
	// --- WISHLIST ---
	getAll: protectedProcedure.query(async ({ ctx }) => {
		return prisma.wish.findMany({
			where: { userId: ctx.session.user.id },
			select: wishItemSelect,
			orderBy: { createdAt: "desc" },
		});
	}),
	getIds: protectedProcedure.query(async ({ ctx }) => {
		const wishes = await prisma.wish.findMany({
			where: { userId: ctx.session.user.id },
			select: { productId: true },
		});
		return wishes.map((wish) => wish.productId);
	}),
	toggle: protectedProcedure
		.input(z.object({ productId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { productId } = input;
			const userId = ctx.session.user.id;

			const existing = await prisma.wish.findUnique({
				where: {
					userId_productId: { userId, productId },
				},
			});
			if (existing) {
				await prisma.wish.delete({ where: { id: existing.id } });
				return { added: false, message: "Removed from wishlist" };
			}
			const product = await prisma.product.findUnique({
				where: { id: productId },
				select: { id: true },
			});
			if (!product)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Product not found",
				});
			await prisma.wish.create({
				data: { userId, productId },
			});
			return { added: true, message: "Added to Wishlist" };
		}),
});
