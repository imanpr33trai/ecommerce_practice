"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { cartKeys } from "@/data/cart/keys";

/**
 * Server-side fetch function for user's cart
 * Used by both Server Components and Client Components
 */
export async function fetchCart(): Promise<CartResponse | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
    headers: {
      "Content-Type": "application/json",
    },
    // Don't cache cart - it should always be fresh
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw new Error("Failed to fetch cart");
  }

  return response.json() as Promise<CartResponse>;
}

/**
 * Type for the cart response
 */
export interface CartResponse {
  success: boolean;
  data: {
    id: string | null;
    items: CartItem[];
    subtotal: number;
    totalItems: number;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  color: string | null;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
    discountPrice: string | number | null;
    stock: number;
    colors: string[] | null;
    images: Array<{
      id: string;
      url: string;
      altText: string | null;
    }>;
  };
}

interface UseCartQueryOptions {
  initialData?: CartResponse | null;
}

/**
 * Client-side hook for fetching cart with React Query
 * Provides caching, deduping, and background refetching
 */
export function useCartQuery(options: UseCartQueryOptions = {}) {
  const { initialData } = options;

  // Use useQuery when initialData is provided to avoid Suspense boundary issues
  // Use useSuspenseQuery otherwise for better SSR integration
  if (initialData !== undefined) {
    return useQuery({
      queryKey: cartKeys.userCart(),
      queryFn: () => fetchCart(),
      // Don't cache cart too long (stock changes, price changes)
      staleTime: 0,
      initialData: initialData,
      retry: (failureCount, error: Error) => {
        // Don't retry on 401s (unauthorized)
        if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
          return false;
        }
        return failureCount < 3;
      },
    });
  }

  return useSuspenseQuery({
    queryKey: cartKeys.userCart(),
    queryFn: () => fetchCart(),
    // Don't cache cart too long (stock changes, price changes)
    staleTime: 0,
    retry: (failureCount, error: Error) => {
      // Don't retry on 401s (unauthorized)
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
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
export async function prefetchCart() {
  return fetchCart();
}