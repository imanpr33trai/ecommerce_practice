"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type React from "react";

import { toast } from "sonner"; // Assuming shadcn toast path

// Import strict types from your feature slice
import {
  INITIAL_FILTERS,
  type ProductFilters,
  type ProductSingleResponse,
} from "@/data/product/types";

// --- 1. Types ---

export interface CartItem extends ProductSingleResponse {
  id: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string; // Added size support
}

type ShopContextType = {
  // UI State
  quickViewProduct: ProductSingleResponse | null;
  setQuickViewProduct: (product: ProductSingleResponse | null) => void;

  // Lists (Client-side mainly, or synced)
  recentlyViewed: ProductSingleResponse[];
  addToRecentlyViewed: (product: ProductSingleResponse) => void;

  compareList: ProductSingleResponse[];
  addToCompare: (product: ProductSingleResponse) => void;
  removeFromCompare: (productId: string) => void;
  isCompareOpen: boolean;
  setCompareOpen: (isOpen: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: ProductSingleResponse, options?: { color?: string; size?: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: ProductSingleResponse[];
  toggleWishlist: (product: ProductSingleResponse) => void;
  isInWishlist: (productId: string) => boolean;

  // Filters (Note: In Next.js App Router, URL params are preferred, but this works for client-only)
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  resetFilters: () => void;
  updateFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// --- 2. Helper Hook for LocalStorage ---
function useLocalStorage<T>(key: string, initialValue: T) {
  // Always initialize with initialValue to ensure consistent type
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Always return the same state - no conditional returns
  return [storedValue, setValue] as const;
}

// --- 3. The Provider ---

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const {addToast}  = useToast();

  // State Management
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<ProductSingleResponse[]>(
    "nestify_recent",
    [],
  );
  const [compareList, setCompareList] = useLocalStorage<ProductSingleResponse[]>(
    "nestify_compare",
    [],
  );
  const [isCompareOpen, setCompareOpen] = useState(false);

  const [cart, setCart] = useLocalStorage<CartItem[]>("nestify_cart", []);
  const [wishlist, setWishlist] = useLocalStorage<ProductSingleResponse[]>("nestify_wishlist", []);

  const [quickViewProduct, setQuickViewProduct] = useState<ProductSingleResponse | null>(null);

  // Initialize filters with Zod Defaults
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);

  // --- Actions (Memoized with useCallback) ---

  const addToRecentlyViewed = useCallback(
    (product: ProductSingleResponse) => {
      setRecentlyViewed((prev) => {
        // Prevent duplicates and limit to 10
        const filtered = prev.filter((p) => p.id !== product.id);
        return [product, ...filtered].slice(0, 10);
      });
    },
    [setRecentlyViewed],
  );

  const addToCompare = useCallback(
    (product: ProductSingleResponse) => {
      setCompareList((prev) => {
        if (prev.some((p) => p.id === product.id)) {
          toast.success("Already added", {
            description: "Product is already in compare list",
          });
          return prev;
        }
        if (prev.length >= 3) {
          toast("Limit Reached", {
            description: "You can only compare up to 3 products",
          });
          return prev;
        }
        toast("Added", { description: `${product.name} added to compare` });
        return [...prev, product];
      });
    },
    [setCompareList],
  );

  const removeFromCompare = useCallback(
    (productId: string) => {
      setCompareList((prev) => prev.filter((p) => p.id !== productId));
    },
    [setCompareList],
  );

  // Cart Logic
  const addToCart = useCallback(
    (product: ProductSingleResponse, options?: { color?: string; size?: string }) => {
      setCart((prev) => {
        // Find exact match (Same ID, Same Color, Same Size)
        const existingIndex = prev.findIndex(
          (item) =>
            item.id === product.id &&
            item.selectedColor === options?.color &&
            item.selectedSize === options?.size,
        );

        if (existingIndex > -1) {
          const newCart = [...prev];

          if (newCart[existingIndex]) {
            newCart[existingIndex].quantity += 1;
            toast.success("Updated", { description: "Cart quantity updated" });
            return newCart;
          }
        }

        toast.success("Added", { description: "Added to cart" });
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            selectedColor: options?.color,
            selectedSize: options?.size,
          },
        ];
      });
    },
    [setCart],
  );

  const updateQuantity = useCallback(
    (productId: string, delta: number) => {
      setCart((prev) =>
        prev.map((item) => {
          if (item.id === productId) {
            const newQuantity = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        }),
      );
    },
    [setCart],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => prev.filter((item) => item.id !== productId));
    },
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  // Computed Cart Values
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0),
    [cart],
  );

  // Wishlist Logic
  const toggleWishlist = useCallback(
    (product: ProductSingleResponse) => {
      setWishlist((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (exists) {
          return prev.filter((p) => p.id !== product.id);
        }
        return [...prev, product];
      });
    },
    [setWishlist],
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p.id === productId),
    [wishlist],
  );

  // Filter Logic
  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const updateFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // --- 4. Value Memoization ---
  // Crucial: Prevents consumers from re-rendering unless data actually changes
  const value = useMemo(
    () => ({
      recentlyViewed,
      addToRecentlyViewed,
      compareList,
      addToCompare,
      removeFromCompare,
      isCompareOpen,
      setCompareOpen,
      quickViewProduct,
      setQuickViewProduct,
      filters,
      setFilters,
      resetFilters,
      updateFilter,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
    }),
    [
      recentlyViewed,
      addToRecentlyViewed,
      compareList,
      addToCompare,
      removeFromCompare,
      isCompareOpen,
      quickViewProduct,
      filters,
      resetFilters,
      updateFilter,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// --- 5. Custom Hook ---

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
