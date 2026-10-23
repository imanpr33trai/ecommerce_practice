import type { UpdateProfileInput } from "@ecommerceNextjs/types";

export interface UserRepository {
  findById(id: string): Promise<unknown>;
  findByIdWithStats(id: string): Promise<unknown>;
  updateProfile(id: string, data: UpdateProfileInput): Promise<unknown>;
}
