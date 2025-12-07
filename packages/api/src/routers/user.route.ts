import prisma from "@ecomerceNextjs/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

export const userRouter = router({
	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				image: z.string().url().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return prisma.user.update({
				where: { id: ctx.session.user.id },
				data: input,
			});
		}),
});
