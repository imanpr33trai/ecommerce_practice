"use client";

import { ArrowRight, LogIn, ShoppingBag, X } from "lucide-react";

import { useCartQuery } from "@/hooks/queries/useCartQuery";
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";
import { useUpdateQuantityMutation } from "@/hooks/mutations/useUpdateQuantityMutation";
import { authClient } from "@/lib/auth-client";

import Button from "@/components/Button";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const { mutate: removeItem } = useRemoveFromCartMutation();
  const { mutate: updateQuantity } = useUpdateQuantityMutation();

  // Only fetch cart if logged in
  const { data: cartData, isLoading: isCartLoading, error: cartError } = useCartQuery();

  // If drawer is closed, don't render anything (Performance)
  if (!isOpen) return null;

  // --- LOGGED OUT STATE ---
  if (!session) {
    return (
      <>
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md animate-slide-left flex-col items-center justify-center space-y-6 bg-white p-6 text-center shadow-2xl">
          <ShoppingBag size={64} className="text-gray-300" aria-hidden="true" />
          <h2 className="font-bold text-2xl">Your Cart is Hidden</h2>
          <p className="text-gray-500">
            Please sign in to view your shopping cart and save your items.
          </p>
          <a
            href="/log-in"
            onClick={onClose}
          >
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" /> Sign In
            </Button>
          </a>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 text-sm hover:text-black"
          >
            Close
          </button>
        </div>
      </>
    );
  }

  // --- LOADING / ERROR STATES (Inside Drawer) ---
  const isLoading = isAuthPending || isCartLoading;

  const cart = cartData?.data;
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const totalItems = cart?.totalItems || 0;

  const handleCheckout = () => {
    onClose();
    window.location.href = "/checkout";
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-gray-100 border-b p-6">
            <h2 className="font-bold text-xl">Shopping Cart ({totalItems})</h2>
            <button
              onClick={onClose}
              type="button"
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                Loading...
              </div>
            ) : cartError ? (
              <div className="text-center text-red-500">Error loading cart.</div>
            ) : items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 text-center opacity-50">
                <ShoppingBag size={48} aria-hidden="true" />
                <p>Your cart is empty.</p>
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              // Cart Items List
              <>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}

                <CartSummary
                  subtotal={subtotal}
                  totalItems={totalItems}
                  onCheckout={handleCheckout}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}