"use client";

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from "react";
import { callRpc, cartClient } from "@/lib/hono-client";
import type { CartItem } from "@/context/ShopContext";

// Cart API response types
interface CartData {
  id: string | null;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

interface CartContextType {
  // State
  cart: CartData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number, options?: { color?: string; size?: string }) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Computed
  itemCount: number;
  subtotal: number;
  isEmpty: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * CartProvider - Manages cart state and API interactions
 * Syncs with backend cart API
 */
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await callRpc(cartClient.$get());
      if (fetchError) throw new Error(fetchError);
      // API returns { success: true, data: CartData }
      if (data && "success" in data && data.success) {
        setCart(data.data);
      } else {
        setCart({ id: null, items: [], subtotal: 0, totalItems: 0 });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
      // Initialize with empty cart on error
      setCart({ id: null, items: [], subtotal: 0, totalItems: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add item to cart
  const addItem = useCallback(
    async (productId: string, quantity = 1, options?: { color?: string; size?: string }) => {
      try {
        setError(null);
        const { data, error: addError } = await callRpc(
          cartClient.$post({ json: { productId, quantity, ...options } }),
        );
        if (addError) throw new Error(addError);
        // Refresh cart to get updated state
        await fetchCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item to cart");
        throw err;
      }
    },
    [fetchCart],
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        setError(null);
        if (quantity <= 0) {
          await removeItem(productId);
          return;
        }
        const { data, error: updateError } = await callRpc(
          cartClient[":productId"].$put({ param: { productId }, json: { quantity } }),
        );
        if (updateError) throw new Error(updateError);
        await fetchCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update quantity");
        throw err;
      }
    },
    [fetchCart],
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (productId: string) => {
      try {
        setError(null);
        const { error: removeError } = await callRpc(
          cartClient[":productId"].$delete({ param: { productId } }),
        );
        if (removeError) throw new Error(removeError);
        await fetchCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove item");
        throw err;
      }
    },
    [fetchCart],
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      const { error: clearError } = await callRpc(cartClient.$delete());
      if (clearError) throw new Error(clearError);
      setCart({ id: null, items: [], subtotal: 0, totalItems: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart");
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Computed values
  const itemCount = useMemo(() => cart?.totalItems ?? 0, [cart]);
  const subtotal = useMemo(() => cart?.subtotal ?? 0, [cart]);
  const isEmpty = useMemo(() => !cart || cart.items.length === 0, [cart]);

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      isLoading,
      error,
      fetchCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
      isEmpty,
    }),
    [
      cart,
      isLoading,
      error,
      fetchCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
      isEmpty,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart context
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Convenience hooks
export function useCartItems() {
  const { cart, isLoading } = useCart();
  return { items: cart?.items ?? [], isLoading };
}

export function useCartCount() {
  const { itemCount, isLoading } = useCart();
  return { count: itemCount, isLoading };
}

export function useCartSubtotal() {
  const { subtotal, isLoading } = useCart();
  return { subtotal, isLoading };
}