import prisma, {
	OrderStatus,
	PaymentStatus,
	type Prisma,
} from "@ecomerceNextjs/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

const adminOrderList = {
	include: {
		user: { select: { name: true, email: true } }, // <--- Added User details
		items: { include: { product: true } },
		payment: true,
	},
} satisfies Prisma.OrderDefaultArgs;

export const orderRouter = router({
	// ADMIN: Update Order Status (e.g., to SHIPPED)
	updateStatus: protectedProcedure
		.input(
			z.object({
				orderId: z.string(),
				status: z.nativeEnum(OrderStatus),
			}),
		)
		.mutation(async ({ input }) => {
			// TODO: Check Admin
			return prisma.order.update({
				where: { id: input.orderId },
				data: { status: input.status },
			});
		}),

	// ADMIN: Update Payment Status (e.g., Manually marked PAID)
	updatePaymentStatus: protectedProcedure
		.input(
			z.object({
				orderId: z.string(),
				status: z.nativeEnum(PaymentStatus),
			}),
		)
		.mutation(async ({ input }) => {
			// TODO: Check Admin
			return prisma.order.update({
				where: { id: input.orderId },
				data: { paymentStatus: input.status },
			});
		}),
	adminList: protectedProcedure
		.input(
			z
				.object({
					limit: z.number().default(50),
					status: z
						.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"])
						.optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			// TODO: Add role check -> if (ctx.user.role !== 'ADMIN') throw new TRPCError({ code: 'FORBIDDEN' });

			return prisma.order.findMany({
				where: {
					status: input?.status, // Optional filter by status
				},
				take: input?.limit,
				include: adminOrderList.include,
				orderBy: { createdAt: "desc" },
			});
		}),
});
