"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { productKeys } from "@/data/product";

/**
 * Server-side fetch function for a single product
 * Used by both Server Components and Client Components
 */
export async function fetchProductDetail(slug: string): Promise<ProductDetailResponse> {
  const params = new URLSearchParams();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${slug}?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
    },
    // Revalidate every 60 seconds for fresh data
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Product not found");
    }
    throw new Error("Failed to fetch product");
  }

  return response.json() as Promise<ProductDetailResponse>;
}

/**
 * Type for the product detail response
 */
export interface ProductDetailResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: string;
    compareAtPrice: string | null;
    sku: string;
    stock: number;
    images: Array<{
      id: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
    }>;
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
    colors?: string[];
    materials?: string[];
  };
}

/**
 * Client-side hook for fetching a single product with React Query
 * Provides caching, deduping, and background refetching
 */
export function useProductDetailQuery(slug: string) {
  return useSuspenseQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => fetchProductDetail(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: Error) => {
      // Don't retry on 404s (typical for product details)
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Prefetch function for Server Components
 * Can be used in layout.tsx or page.tsx to prefetch data
 */
export async function prefetchProductDetail(slug: string) {
  return fetchProductDetail(slug);
}