import { ProductFilters } from "./types";

export const productKeys = {
    all: ["product"] as const,

    // Key for the List: e.g., ['product', 'list', { category: 'shoes', page: 1 }]
    list: (filters: ProductFilters) => ["product", "list", filters] as const,

    // Key for Details: e.g., ['product', 'detail', 'nike-air-max']
    detail: (slug: string) => ["product", "detail", slug] as const,

    // Key for Infinite Scroll (if you add it later)
    infinite: (filters: ProductFilters) => ["product", "infinite", filters] as const,
};