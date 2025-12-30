"use client";

import { useState } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "@/components/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { LayoutContext } from "@/context/LayoutContext";
import { ShopProvider } from "@/context/ShopContext";
import { authClient } from "@/lib/auth-client";
import { TRPCReactProvider } from "@/trpc/client";

import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const { data: isUser } = authClient.useSession();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* <QueryClientProvider client={queryClient}> */}
      <TRPCReactProvider>
        <LayoutContext.Provider value={{ isCartOpen, toggleCart }}>
          {/*<ToastProvider>*/}
          <AuthProvider>
            <ShopProvider>
              {/* <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}> */}
              <ReactQueryDevtools />
              {isUser && (
                <CartDrawer
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                />
              )}

              {children}
              <Toaster richColors />
            </ShopProvider>
          </AuthProvider>
          {/*</ToastProvider>*/}
        </LayoutContext.Provider>
        {/* </TRPCProvider> */}
        {/* </QueryClientProvider> */}
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
