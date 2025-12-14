"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useToast } from '../components/ui/Toast';

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
}

interface FilterState {
  sort: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  onSale: boolean;
  categories: string[];
  materials: string[];
  rating: number | null;
  colors: string[];
}

interface ShopContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isCompareOpen: boolean;
  setCompareOpen: (isOpen: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  cart: CartItem[];
  addToCart: (product: Product, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

const initialFilters: FilterState = {
  sort: 'newest',
  minPrice: 0,
  maxPrice: 3000,
  inStock: false,
  onSale: false,
  categories: [],
  materials: [],
  rating: null,
  colors: [],
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setCompareOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    const stored = localStorage.getItem('nestify_recent');
    if (stored) setRecentlyViewed(JSON.parse(stored));

    const storedCart = localStorage.getItem('nestify_cart');
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedWishlist = localStorage.getItem('nestify_wishlist');
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem('nestify_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nestify_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const newRecent = [product, ...filtered].slice(0, 10);
      localStorage.setItem('nestify_recent', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const addToCompare = (product: Product) => {
    if (compareList.some(p => p.id === product.id)) {
      addToast('Product already in compare list', 'info');
      return;
    }
    if (compareList.length >= 3) {
      addToast('You can only compare up to 3 products', 'error');
      return;
    }
    setCompareList(prev => [...prev, product]);
    addToast(`${product.name} added to compare`, 'success');
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const addToCart = (product: Product, color?: string) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedColor: color || product.colors?.[0] }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);
  const resetFilters = () => setFilters(initialFilters);

  return (
    <ShopContext.Provider value={{
      recentlyViewed, addToRecentlyViewed,
      compareList, addToCompare, removeFromCompare, isCompareOpen, setCompareOpen,
      quickViewProduct, setQuickViewProduct,
      filters, setFilters, resetFilters,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      wishlist, toggleWishlist, isInWishlist
    }}>
      {children}
    </ShopContext.Provider>
  );
};