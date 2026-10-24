"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { useCartQuery } from "@/hooks/queries/useCartQuery";
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";
import { useUpdateQuantityMutation } from "@/hooks/mutations/useUpdateQuantityMutation";
import { useClearCartMutation } from "@/hooks/mutations/useClearCartMutation";
import type { CartResponse } from "@/hooks/queries/useCartQuery";

import BentoCard from "@/components/BentoCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

interface CartPageClientProps {
  initialCartData?: CartResponse | null;
}

export default function CartPageClient({ initialCartData }: CartPageClientProps) {
  const [hydratedCart, setHydratedCart] = useState<CartResponse | null>(initialCartData ?? null);

  const { data: cartData, isLoading: isCartLoading, error: cartError } = useCartQuery({
    initialData: initialCartData ?? undefined,
  });
  const { mutate: removeItem } = useRemoveFromCartMutation();
  const { mutate: updateQuantity } = useUpdateQuantityMutation();
  const { mutate: clearCart } = useClearCartMutation();

  // Use server data initially, then switch to client data after hydration
  const cart = hydratedCart?.data ?? cartData?.data;
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const totalItems = cart?.totalItems || 0;

  const tax = subtotal * 0.08;
  const shipping = subtotal > 200 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  // Update hydrated cart when client data loads
  if (cartData && !hydratedCart) {
    setHydratedCart(cartData);
  }

  // Show loading only if we have no initial data and client is still loading
  const isInitialLoad = !initialCartData && isCartLoading;

  if (isInitialLoad) {
    return (
      <div className="mx-auto min-h-[60vh] max-w-[1200px] animate-fade-in p-4 md:px-8">
        <Breadcrumbs />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black" />
        </div>
      </div>
    );
  }

  if (cartError && !initialCartData) {
    return (
      <div className="mx-auto min-h-[60vh] max-w-[1200px] animate-fade-in p-4 md:px-8">
        <Breadcrumbs />
        <div className="text-center text-red-500">Error loading cart: {cartError.message}</div>
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1200px] animate-fade-in flex-col items-center justify-center p-4 md:px-8">
        <Breadcrumbs />
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={32} className="text-gray-400" aria-hidden="true" />
        </div>
        <h1 className="mb-2 font-light text-3xl">Your Cart is Empty</h1>
        <p className="mb-8 max-w-md text-gray-500 text-center">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/product">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity({ productId: itemId, quantity: newQuantity });
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  return (
    <div className="mx-auto min-h-[80vh] max-w-[1200px] animate-fade-in p-4 md:px-8">
      <Breadcrumbs />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-light text-4xl">
          Your Cart <span className="text-2xl text-gray-400">({totalItems})</span>
        </h1>
        {items.length > 0 && (
          <Button variant="outline" onClick={handleClearCart} className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50">
            <X size={16} className="mr-2" aria-hidden="true" />
            Clear Cart
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="mt-4 flex justify-between">
            <Link href="/product">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            totalItems={totalItems}
            onCheckout={() => {
              window.location.href = "/checkout";
            }}
          />
        </div>
      </div>
    </div>
  );
}