import type { AddItemInput } from "@ecommerceNextjs/types";

export interface CartRepository {
  findByUserId(userId: string): Promise<unknown>;
  addItem(userId: string, input: AddItemInput): Promise<unknown>;
  updateQuantity(userId: string, itemId: string, quantity: number): Promise<unknown>;
  removeItem(userId: string, itemId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
}
