import { prisma } from "@ecommerceNextjs/db";
import type { Prisma } from "@ecommerceNextjs/db";
import type { CreateAddressInput, UpdateAddressInput } from "@ecommerceNextjs/types";

import type { AddressRepository } from "../address.repository";

export class PrismaAddressRepository implements AddressRepository {
  async findByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async create(userId: string, input: CreateAddressInput) {
    const count = await prisma.address.count({ where: { userId } });
    const isFirstAddress = count === 0;
    const shouldBeDefault = input.isDefault || isFirstAddress;

    return prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: { ...input, isDefault: shouldBeDefault, userId },
      });
    });
  }

  async update(userId: string, addressId: string, input: UpdateAddressInput) {
    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    return prisma.$transaction(async (tx) => {
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
  }

  async setDefault(userId: string, addressId: string) {
    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    return prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });
  }

  async delete(userId: string, addressId: string) {
    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    await prisma.address.delete({ where: { id: addressId } });
  }
}
