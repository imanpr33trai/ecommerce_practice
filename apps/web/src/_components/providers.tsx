"use client";

import { queryClient } from "@/trpc/client";
import { Toaster } from "@comp/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools, ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/context/AuthContext";
import { ShopProvider } from "@/context/ShopContext";
import { LayoutContext } from "@/context/LayoutContext";
import { useState } from "react";
import { TanStackDevtools } from '@tanstack/react-devtools'


import CartDrawer from "@/components/CartDrawer";

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
      <QueryClientProvider client={queryClient}>

        <LayoutContext.Provider value={{ isCartOpen, toggleCart }}>
        <ToastProvider>
          <AuthProvider>
            <ShopProvider>
              {/* <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}> */}
              <ReactQueryDevtools />


              <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              <Toaster richColors />
              {children}
            </ShopProvider>
          </AuthProvider>
        </ToastProvider>
        </LayoutContext.Provider>
        {/* </TRPCProvider> */}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
