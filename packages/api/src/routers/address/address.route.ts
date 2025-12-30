import prisma from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../..";
import { AddressSchema, UpdateAddressSchema } from "./address.type";

export const addressRouter = router({
  /**
   * List all addresses for the user
   * Sorts by Default first, then recently added
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.address.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: [
        { isDefault: "desc" }, // Default address first
        { createdAt: "desc" },
      ],
    });
  }),

  /**
   * Create Address
   * Logic: If it's the first address, force it to be Default.
   * If isDefault is true, unset others.
   */
  create: protectedProcedure.input(AddressSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    // 1. Check if user has any addresses yet
    const count = await prisma.address.count({ where: { userId } });
    const isFirstAddress = count === 0;

    // 2. Determine if this should be default
    const shouldBeDefault = input.isDefault || isFirstAddress;

    return prisma.$transaction(async (tx) => {
      // If setting as default, unset previous default
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          ...input,
          isDefault: shouldBeDefault,
          userId,
        },
      });
    });
  }),

  /**
   * Update Address
   */
  update: protectedProcedure.input(UpdateAddressSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const { id, ...data } = input;

    // Check ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Address not found" });
    }

    return prisma.$transaction(async (tx) => {
      // Handle Default switching
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id },
        data,
      });
    });
  }),

  /**
   * Set an existing address as Default
   */
  setDefault: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    return prisma.$transaction(async (tx) => {
      // 1. Unset old default
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      // 2. Set new default
      return tx.address.update({
        where: { id: input.id },
        data: { isDefault: true },
      });
    });
  }),

  /**
   * Delete Address
   */
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const address = await prisma.address.findUnique({ where: { id: input.id } });
    if (!address || address.userId !== userId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    // Prevent deleting the default address if others exist?
    // (Optional rule, usually safer to allow delete but warn)

    return prisma.address.delete({
      where: { id: input.id },
    });
  }),
});
