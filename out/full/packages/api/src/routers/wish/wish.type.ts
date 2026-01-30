import { z } from "zod";

// Schema for Toggling (Add/Remove)
export const ToggleWishSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export type ToggleWishInput = z.infer<typeof ToggleWishSchema>;
