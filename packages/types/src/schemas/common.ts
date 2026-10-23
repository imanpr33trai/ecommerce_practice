import { z } from "zod";

// Common pagination params
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

// Common ID param
export const IdParamSchema = z.object({
  id: z.string().min(1),
});

export type IdParam = z.infer<typeof IdParamSchema>;

// Common slug param
export const SlugParamSchema = z.object({
  slug: z.string().min(1),
});

export type SlugParam = z.infer<typeof SlugParamSchema>;