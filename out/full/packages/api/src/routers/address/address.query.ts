import prisma from "@ecomerceNextjs/db";

import type { CreateAddressInput, UpdateAddressInput } from "./address.type";

export const addressQueries = {
  /**
   * List all addresses for user
   */
  list: async (userId: string) => {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" }, // Default first
        { createdAt: "desc" },
      ],
    });
  },

  /**
   * Create Address
   * Automatically sets as default if it's the first one.
   */
  create: async (userId: string, input: CreateAddressInput) => {
    // 1. Check if it's the first address
    const count = await prisma.address.count({ where: { userId } });
    const isFirstAddress = count === 0;

    // 2. Determine default status
    const shouldBeDefault = input.isDefault || isFirstAddress;

    // 3. Transaction
    return prisma.$transaction(async (tx) => {
      // Unset old default if needed
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
  },

  /**
   * Update Address
   */
  update: async (userId: string, addressId: string, input: UpdateAddressInput) => {
    // 1. Ownership Check
    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    // 2. Transaction
    return prisma.$transaction(async (tx) => {
      // If setting to default, unset others
      if (input.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true, id: { not: addressId } },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: addressId },
        data: input,
      });
    });
  },

  /**
   * Set Specific Address as Default
   */
  setDefault: async (userId: string, addressId: string) => {
    // 1. Ownership Check
    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    // 2. Transaction
    return prisma.$transaction(async (tx) => {
      // Unset all
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      // Set target
      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });
  },

  /**
   * Delete Address
   */
  delete: async (userId: string, addressId: string) => {
    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    return prisma.address.delete({
      where: { id: addressId },
    });
  },
};
