"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";

import { ArrowRight, LogIn, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import {
  useCartItemRemoveMutation,
  useCartListItemsQuery,
  useCartUpdateItemQuantityMutation,
} from "@/data/cart";
import { authClient } from "@/lib/auth-client";

import Button from "./Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  // const {  removeItem } = useShop();
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const { mutate: removeItem } = useCartItemRemoveMutation();
  const { mutate: updateQuantity } = useCartUpdateItemQuantityMutation();

  // 1. CONDITIONAL FETCH: Only fetch cart if logged in
  const { data: cart, isLoading: isCartLoading, error: cartError } = useCartListItemsQuery();

  // If drawer is closed, don't render anything (Performance)
  // if (!isOpen) return null;

  // --- LOGGED OUT STATE ---
  if (!session) {
    return (
      <>
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md animate-slide-left flex-col items-center justify-center space-y-6 bg-white p-6 text-center shadow-2xl">
          <ShoppingBag
            size={64}
            className="text-gray-300"
          />
          <h2 className="font-bold text-2xl">Your Cart is Hidden</h2>
          <p className="text-gray-500">
            Please sign in to view your shopping cart and save your items.
          </p>
          <Link
            href="/log-in"
            onClick={onClose}
          >
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </Link>
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

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-gray-100 border-b p-6">
            <h2 className="font-bold text-xl">Shopping Cart ({cart?.data.items.length || 0})</h2>
            <button
              onClick={onClose}
              type="button"
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">Loading...</div>
            ) : cartError ? (
              <div className="text-center text-red-500">Error loading cart.</div>
            ) : !cart || cart.data.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 text-center opacity-50">
                <ShoppingBag size={48} />
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
              cart.data.items.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-4"
                >
                  {/* ... (Your existing item rendering code) ... */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between">
                      <h3 className="line-clamp-1 font-medium text-sm">{item.product.name}</h3>
                      <span className="font-bold text-sm">${item.product.price}</span>
                    </div>
                    <p className="mb-2 text-gray-500 text-xs">
                      {item.product.category?.name} {item.color && `• Color`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-gray-200">
                        <button
                          onClick={() =>
                            updateQuantity({ productId: item.id, quantity: item.quantity + -1 })
                          }
                          type="button"
                          className="flex h-6 w-6 items-center justify-center rounded-l-full transition-colors hover:bg-gray-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-medium text-xs">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity({ productId: item.id, quantity: item.quantity + 1 })
                          }
                          type="button"
                          className="flex h-6 w-6 items-center justify-center rounded-r-full transition-colors hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        type="button"
                        className="text-gray-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart && cart.data.items.length > 0 && (
            <div className="space-y-4 border-gray-100 border-t bg-gray-50 p-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">${cart.data.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex-1"
                >
                  <Button
                    variant="secondary"
                    className="w-full border border-gray-200 hover:bg-white"
                  >
                    View Cart
                  </Button>
                </Link>
                <Link
                  href={{ pathname: "/checkout" }}
                  onClick={onClose}
                  className="flex-[2]"
                >
                  <Button className="group w-full justify-between">
                    Checkout{" "}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
