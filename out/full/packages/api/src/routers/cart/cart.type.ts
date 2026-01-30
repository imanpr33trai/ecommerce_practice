import { z } from "zod";

// Schema for Adding Item
export const AddItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1).default(1),
  color: z.string(), // Optional color selection
});

export type AddItemInput = z.infer<typeof AddItemSchema>;

export const UpdateQuantitySchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});
