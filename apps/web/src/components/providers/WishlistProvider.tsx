"use client";

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from "react";
import { callRpc, wishClient } from "@/lib/hono-client";
import type { ProductSingleResponse } from "@/data/product/types";

// Wishlist API response types
interface WishlistItem {
  id: string;
  productId: string;
  product: ProductSingleResponse;
  createdAt: string;
}

interface WishlistIdsData {
  data: string[];
}

interface ToggleWishResponse {
  added: boolean;
  item?: WishlistItem;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface WishlistContextType {
  // State
  wishlist: WishlistItem[];
  wishlistIds: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWishlist: () => Promise<void>;
  fetchWishlistIds: () => Promise<void>;
  toggleItem: (productId: string) => Promise<{ added: boolean; item?: WishlistItem }>;
  removeItem: (wishlistItemId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;

  // Computed
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: React.ReactNode;
}

/**
 * WishlistProvider - Manages wishlist state and API interactions
 * Syncs with backend wishlist API
 */
export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to extract data from API response
  const extractData = <T,>(response: unknown): T | null => {
    if (response && typeof response === "object" && "success" in response) {
      const apiResponse = response as ApiResponse<T>;
      if (apiResponse.success) {
        return apiResponse.data;
      }
    }
    return null;
  };

  // Fetch full wishlist from API
  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await callRpc(wishClient.$get());
      if (fetchError) throw new Error(fetchError);
      const items = extractData<WishlistItem[]>(data);
      setWishlist(items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wishlist");
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch just wishlist IDs (lightweight)
  const fetchWishlistIds = useCallback(async () => {
    try {
      const { data, error: fetchError } = await callRpc(wishClient.ids.$get());
      if (fetchError) throw new Error(fetchError);
      const idsData = extractData<WishlistIdsData>(data);
      setWishlistIds(idsData?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wishlist IDs");
      setWishlistIds([]);
    }
  }, []);

  // Toggle item in wishlist (add/remove)
  const toggleItem = useCallback(
    async (productId: string) => {
      try {
        setError(null);
        const { data, error: toggleError } = await callRpc(
          wishClient.toggle.$post({ json: { productId } }),
        );
        if (toggleError) throw new Error(toggleError);

        // Refresh both full wishlist and IDs
        await Promise.all([fetchWishlist(), fetchWishlistIds()]);

        // API returns { success: true, data: { added: boolean, item?: WishlistItem, message: string } }
        const toggleData = extractData<ToggleWishResponse>(data);
        return {
          added: toggleData?.added ?? false,
          item: toggleData?.item,
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle wishlist item");
        throw err;
      }
    },
    [fetchWishlist, fetchWishlistIds],
  );

  // Remove specific wishlist item
  const removeItem = useCallback(
    async (wishlistItemId: string) => {
      try {
        setError(null);
        // Need to use the correct path parameter
        const { error: removeError } = await callRpc(
          // @ts-expect-error - dynamic route access
          wishClient[":id"].$delete({ param: { id: wishlistItemId } }),
        );
        if (removeError) throw new Error(removeError);
        await Promise.all([fetchWishlist(), fetchWishlistIds()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove wishlist item");
        throw err;
      }
    },
    [fetchWishlist, fetchWishlistIds],
  );

  // Clear entire wishlist
  const clearWishlist = useCallback(async () => {
    try {
      setError(null);
      const { error: clearError } = await callRpc(wishClient.$delete());
      if (clearError) throw new Error(clearError);
      setWishlist([]);
      setWishlistIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear wishlist");
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchWishlist();
    fetchWishlistIds();
  }, [fetchWishlist, fetchWishlistIds]);

  // Computed values
  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds],
  );

  const itemCount = useMemo(() => wishlist.length, [wishlist]);

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlist,
      wishlistIds,
      isLoading,
      error,
      fetchWishlist,
      fetchWishlistIds,
      toggleItem,
      removeItem,
      clearWishlist,
      isInWishlist,
      itemCount,
    }),
    [
      wishlist,
      wishlistIds,
      isLoading,
      error,
      fetchWishlist,
      fetchWishlistIds,
      toggleItem,
      removeItem,
      clearWishlist,
      isInWishlist,
      itemCount,
    ],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

/**
 * Hook to access wishlist context
 */
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

// Convenience hooks
export function useWishlistItems() {
  const { wishlist, isLoading } = useWishlist();
  return { items: wishlist, isLoading };
}

export function useWishlistCount() {
  const { itemCount, isLoading } = useWishlist();
  return { count: itemCount, isLoading };
}

export function useIsInWishlist() {
  const { isInWishlist, isLoading } = useWishlist();
  return { isInWishlist, isLoading };
}