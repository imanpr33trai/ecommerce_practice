import type { GetProductListRequest } from "./types";

export const productKeys = {
  all: ["product"] as const,

  // List with specific filters (e.g. { category: 'shoes', sort: 'price_asc' })
  list: (filters: GetProductListRequest["query"]) => ["product", "list", filters] as const,

  // Single Product Detail
  detail: (slug: string) => ["product", "detail", slug] as const,

  // Facets (Categories, Colors, Materials)
  filters: () => ["product", "filters"] as const,

  // Landing Page Sections
  landing: () => ["product", "landing"] as const,

  suggestion: (search: string) => ["product", "suggestion", search] as const,
};
