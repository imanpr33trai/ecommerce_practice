import type { CreateAddressInput, UpdateAddressInput } from "@ecommerceNextjs/types";

export interface AddressRepository {
  findByUserId(userId: string): Promise<unknown>;
  create(userId: string, input: CreateAddressInput): Promise<unknown>;
  update(userId: string, addressId: string, input: UpdateAddressInput): Promise<unknown>;
  setDefault(userId: string, addressId: string): Promise<unknown>;
  delete(userId: string, addressId: string): Promise<void>;
}