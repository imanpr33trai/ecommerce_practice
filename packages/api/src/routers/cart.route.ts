import prisma from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { protectedProcedure, router } from "..";
import { cartInclude } from "../types/index";

export const cartRouter = router({
	get: protectedProcedure.query(async ({ ctx }) => {
		const cart = await prisma.cart.findUnique({
			where: { userId: ctx.session.user.id },
			include: {
				items: {
					include: cartInclude.items.include,
				},
			},
		});
		if (!cart) return null;

		const subTotal = cart.items.reduce((acc, item) => {
			const price = Number(item.product.discountPrice ?? item.product.price);
			return acc + price * item.quantity;
		}, 0);

		const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

		return {
			...cart,
			totalItems,
			subTotal,
		};
	}),
	addItem: protectedProcedure
		.input(
			z.object({
				productId: z.string(),
				quantity: z.number().min(1).default(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { productId, quantity } = input;
			const userId = ctx.session.user.id;

			// A. Check Product Validity & Stock
			const product = await prisma.product.findUnique({
				where: { id: productId },
			});

			if (!product) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Product not found",
				});
			}

			if (!product.isActive) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Product is no longer available",
				});
			}

			if (product.stock < quantity) {
				throw new TRPCError({
					code: "CONFLICT",
					message: `Only ${product.stock} items remaining in stock`,
				});
			}

			// B. Ensure Cart Exists (Create if null)
			let cart = await prisma.cart.findUnique({ where: { userId } });
			if (!cart) {
				cart = await prisma.cart.create({ data: { userId } });
			}

			// C. Upsert Item (Update if exists, Create if new)
			return prisma.cartItem.upsert({
				where: {
					cartId_productId: {
						cartId: cart.id,
						productId: productId,
					},
				},
				update: {
					quantity: { increment: quantity },
				},
				create: {
					cartId: cart.id,
					productId: productId,
					quantity: quantity,
				},
			});
		}),

	// 3. Update Quantity (Strict Set)
	updateQuantity: protectedProcedure
		.input(
			z.object({
				itemId: z.string(),
				quantity: z.number().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { itemId, quantity } = input;

			// Find the item to check stock limits against the specific product
			const item = await prisma.cartItem.findUnique({
				where: { id: itemId },
				include: { product: { select: { stock: true } } },
			});

			if (!item)
				throw new TRPCError({ code: "NOT_FOUND", message: "Item not found" });

			// Robust Stock Check
			if (item.product.stock < quantity) {
				throw new TRPCError({
					code: "CONFLICT",
					message: `Cannot add more. Max stock is ${item.product.stock}`,
				});
			}

			return prisma.cartItem.update({
				where: { id: itemId },
				data: { quantity },
			});
		}),

	// 4. Remove Item
	removeItem: protectedProcedure
		.input(z.object({ itemId: z.string() }))
		.mutation(async ({ input }) => {
			return prisma.cartItem.delete({
				where: { id: input.itemId },
			});
		}),

	// 5. Clear Cart
	clear: protectedProcedure.mutation(async ({ ctx }) => {
		const cart = await prisma.cart.findUnique({
			where: { userId: ctx.session.user.id },
		});
		if (cart) {
			await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
		}
		return { success: true };
	}),
});
