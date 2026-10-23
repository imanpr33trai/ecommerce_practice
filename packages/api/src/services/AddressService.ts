import { AppError } from "@ecommerceNextjs/types";
import type { CreateAddressInput, UpdateAddressInput } from "@ecommerceNextjs/types";

import type { AddressRepository } from "../repositories/address.repository";

/**
 * AddressService handles address-related business logic.
 * Depends on AddressRepository interface (injected via constructor).
 * No Prisma or Hono imports in service layer.
 */
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  /**
   * List all addresses for user
   */
  async list(userId: string) {
    return this.addressRepository.findByUserId(userId);
  }

  /**
   * Create address
   * Automatically sets as default if it's the first one
   */
  async create(userId: string, input: CreateAddressInput) {
    return this.addressRepository.create(userId, input);
  }

  /**
   * Update address
   * @throws AppError with NOT_FOUND if address doesn't exist or access denied
   */
  async update(userId: string, addressId: string, input: UpdateAddressInput) {
    const existing = await this.addressRepository.findByUserId(userId);
    const address = Array.isArray(existing) 
      ? existing.find((a: any) => a.id === addressId)
      : null;

    if (!address) {
      throw AppError.notFound("Address", addressId);
    }

    return this.addressRepository.update(userId, addressId, input);
  }

  /**
   * Set address as default
   * @throws AppError with NOT_FOUND if address doesn't exist or access denied
   */
  async setDefault(userId: string, addressId: string) {
    const existing = await this.addressRepository.findByUserId(userId);
    const address = Array.isArray(existing) 
      ? existing.find((a: any) => a.id === addressId)
      : null;

    if (!address) {
      throw AppError.notFound("Address", addressId);
    }

    return this.addressRepository.setDefault(userId, addressId);
  }

  /**
   * Delete address
   * @throws AppError with NOT_FOUND if address doesn't exist or access denied
   */
  async delete(userId: string, addressId: string) {
    const existing = await this.addressRepository.findByUserId(userId);
    const address = Array.isArray(existing) 
      ? existing.find((a: any) => a.id === addressId)
      : null;

    if (!address) {
      throw AppError.notFound("Address", addressId);
    }

    return this.addressRepository.delete(userId, addressId);
  }
}