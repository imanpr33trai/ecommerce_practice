import type { ProductFilters, ProductSuggestionInput } from "@ecommerceNextjs/types";

export interface ProductRepository {
  findMany(filters: ProductFilters): Promise<unknown>;
  findFilterOptions(): Promise<unknown>;
  findBySlug(slug: string): Promise<unknown>;
  findSuggestions(input: ProductSuggestionInput): Promise<unknown>;
}
