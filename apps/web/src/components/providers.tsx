"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "@/components/sonner";
import { LayoutContext } from "@/context/LayoutContext";
import { ShopProvider } from "@/context/ShopContext";
import { authClient } from "@/lib/auth-client";
import { createQueryClient } from "@/lib/query-client";

import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const { data: isUser } = authClient.useSession();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={createQueryClient()}>
        <LayoutContext.Provider value={{ isCartOpen, toggleCart }}>
          {/*<ToastProvider>*/}

          <ShopProvider>
            <ReactQueryDevtools />
            {isUser && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}

            {children}
            <Toaster richColors />
          </ShopProvider>

          {/*</ToastProvider>*/}
        </LayoutContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
