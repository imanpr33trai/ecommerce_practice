import prisma from "@ecomerceNextjs/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

export const addressRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				street: z.string(),
				city: z.string(),
				state: z.string(),
				postalCode: z.string(),
				country: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { city, country, postalCode, state, street } = input;
			return prisma.address.create({
				data: {
					id: crypto.randomUUID(), // Manual ID generation since schema uses @map("_id") without default
					userId: ctx.session.user.id,
					city,
					country,
					postalCode,
					state,
					street,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			});
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				street: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				postalCode: z.string().optional(),
				country: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Ensure user owns address
			const count = await prisma.address.count({
				where: { id: input.id, userId: ctx.session.user.id },
			});
			if (count === 0) throw new Error("Address not found or unauthorized");

			const { id, ...data } = input;
			return prisma.address.update({
				where: { id },
				data: data,
			});
		}),

	// delete: protectedProcedure
	//   .input(z.object({ id: z.string() }))
	//   .mutation(async ({ ctx, input }) => {
	//     return prisma.address.deleteMany({
	//       where: {
	//         id: input.id,
	//         userId: ctx.session.user.id,
	//       },
	//     });
	//   }),
});
