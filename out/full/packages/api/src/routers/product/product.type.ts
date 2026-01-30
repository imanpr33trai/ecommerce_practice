import { z } from "zod";

// --- Helpers ---

// Helper to handle query params like ?colors=red (string) vs ?colors=red&colors=blue (array)
const coerceArray = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (!val) {
      return undefined;
    }
    const arr = Array.isArray(val) ? val : [val];
    return arr.length > 0 ? arr : undefined;
  });

// --- Schemas ---

export const ProductFilterSchema = z.object({
  // Pagination
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),

  // Sort
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),

  // Filters
  search: z.string().optional(),
  minPrice: z.coerce.number().default(0),
  maxPrice: z.coerce.number().default(10000),

  // Toggles (Coerce handles "true"/"false" strings from URL)
  onSale: z.coerce.boolean().optional(),
  inStock: z.coerce.boolean().optional(),
  rating: z.coerce.number().optional(),

  // Arrays
  categories: coerceArray,
  materials: coerceArray,
  colors: coerceArray,
});

// Infer TypeScript type
export type ProductFilters = z.infer<typeof ProductFilterSchema>;

export const SuggestionSchema = z.object({
  query: z.string().min(1).trim(),
});

export type ProductSuggestionInput = z.infer<typeof SuggestionSchema>;
