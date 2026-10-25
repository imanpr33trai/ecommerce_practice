"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ProductFilters } from "@/data/product";

/**
 * Server-side fetch function for search
 * Used by both Server Components and Client Components
 */
export async function fetchSearch(filters: ProductFilters) {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  params.set("sort", filters.sort);
  params.set("minPrice", String(filters.minPrice));
  params.set("maxPrice", String(filters.maxPrice));
  params.set("categories", filters.categories.join(","));
  params.set("materials", filters.materials.join(","));
  params.set("colors", filters.colors.join(","));

  if (filters.search) params.set("search", filters.search);
  if (filters.onSale !== undefined) params.set("onSale", String(filters.onSale));
  if (filters.inStock !== undefined) params.set("inStock", String(filters.inStock));
  if (filters.rating !== undefined) params.set("rating", String(filters.rating));

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  return response.json() as Promise<SearchResponse>;
}

/**
 * Type for the search results response
 */
export interface SearchResponse {
  data: {
    items: Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
      price: string;
      compareAtPrice: string | null;
      sku: string;
      stock: number;
      images: string[];
      categoryId: string;
      brandId: string;
      isActive: boolean;
      isFeatured: boolean;
      rating: string;
      reviewCount: number;
      createdAt: string;
      updatedAt: string;
      category?: {
        id: string;
        name: string;
        slug: string;
      };
      brand?: {
        id: string;
        name: string;
        slug: string;
      };
      variants?: Array<{
        id: string;
        color: string;
        size: string;
        stock: number;
        price: string;
      }>;
    }>;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  success: boolean;
}

/**
 * Client-side hook for fetching search results with React Query
 * Provides caching, deduping, and background refetching
 */
export function useSearchQuery(filters: Partial<ProductFilters>) {
  // Fill in defaults for missing filter values
  const fullFilters: ProductFilters = {
    page: 1,
    limit: 20,
    sort: "newest",
    minPrice: 0,
    maxPrice: 100000,
    categories: [],
    materials: [],
    colors: [],
    search: undefined,
    onSale: undefined,
    inStock: undefined,
    rating: undefined,
    ...filters,
  };

  // Convert to query key format
  const queryKeyFilters = {
    page: String(fullFilters.page),
    limit: String(fullFilters.limit),
    sort: fullFilters.sort,
    minPrice: String(fullFilters.minPrice),
    maxPrice: String(fullFilters.maxPrice),
    categories: fullFilters.categories.join(","),
    materials: fullFilters.materials.join(","),
    colors: fullFilters.colors.join(","),
    search: fullFilters.search,
    onSale: fullFilters.onSale !== undefined ? String(fullFilters.onSale) : undefined,
    inStock: fullFilters.inStock !== undefined ? String(fullFilters.inStock) : undefined,
    rating: fullFilters.rating !== undefined ? String(fullFilters.rating) : undefined,
  };

  return useQuery({
    queryKey: ["search", queryKeyFilters],
    queryFn: () => fetchSearch(fullFilters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: !!fullFilters.search, // Only fetch when there's a search query
  });
}

/**
 * Prefetch function for Server Components
 * Can be used in layout.tsx or page.tsx to prefetch data
 */
export async function prefetchSearch(filters: Partial<ProductFilters> = {}) {
  const fullFilters: ProductFilters = {
    page: 1,
    limit: 20,
    sort: "newest",
    minPrice: 0,
    maxPrice: 100000,
    categories: [],
    materials: [],
    colors: [],
    search: undefined,
    onSale: undefined,
    inStock: undefined,
    rating: undefined,
    ...filters,
  };

  return fetchSearch(fullFilters);
}