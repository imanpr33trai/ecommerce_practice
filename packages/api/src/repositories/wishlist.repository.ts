import type { ToggleWishInput } from "@ecommerceNextjs/types";

export interface WishlistRepository {
  findAll(userId: string): Promise<unknown>;
  findIds(userId: string): Promise<string[]>;
  toggle(userId: string, input: ToggleWishInput): Promise<{ added: boolean; message: string }>;
  clear(userId: string): Promise<number>;
}
