"use client";

import { useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "@/components/sonner";
import { LayoutContext } from "@/context/LayoutContext";
import { ShopProvider } from "@/context/ShopContext";
import { authClient } from "@/lib/auth-client";
import { createQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";

import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={createQueryClient()}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LayoutContext.Provider value={{ isCartOpen, toggleCart }}>
                <ShopProvider>
                  <ReactQueryDevtools />
                  {children}
                  <Toaster richColors />
                </ShopProvider>
              </LayoutContext.Provider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}