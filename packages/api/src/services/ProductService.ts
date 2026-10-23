import { AppError } from "@ecommerceNextjs/types";
import type {
  ProductFilterSchema,
  ProductSuggestionInput,
  ProductFilters,
} from "@ecommerceNextjs/types";

import type { ProductRepository } from "../repositories/product.repository";

/**
 * ProductService handles product-related business logic.
 * Depends on ProductRepository interface (injected via constructor).
 * No Prisma or Hono imports in service layer.
 */
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  /**
   * Get products with filtering, sorting, and pagination
   */
  async getProducts(filters: ProductFilters) {
    return this.productRepository.findMany(filters);
  }

  /**
   * Get available filter options (facets)
   */
  async getFilterOptions() {
    return this.productRepository.findFilterOptions();
  }

  /**
   * Get product by slug
   * @throws AppError with NOT_FOUND code if product doesn't exist
   */
  async getBySlug(slug: string) {
    const product = await this.productRepository.findBySlug(slug);

    if (!product) {
      throw AppError.notFound("Product", slug);
    }

    return product;
  }

  /**
   * Get search suggestions for autocomplete
   */
  async getSuggestions(input: ProductSuggestionInput) {
    return this.productRepository.findSuggestions(input);
  }
}