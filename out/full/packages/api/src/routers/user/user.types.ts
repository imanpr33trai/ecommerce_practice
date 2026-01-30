import { z } from "zod";

// Schema for Updating Profile
export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  // Add phone or other fields if your User model supports them
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
