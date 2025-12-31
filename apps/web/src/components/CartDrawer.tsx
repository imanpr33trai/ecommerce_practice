"use client";

import Image from "@/components/AppImage";
import Link from "next/link";
import type React from "react";

import { ArrowRight, LogIn, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { Cart } from "@/feature/cart";
import { authClient } from "@/lib/auth-client";

import Button from "./Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  // const {  removeItem } = useShop();
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const { updateQuantity, removeItem } = Cart.hooks.useActions();

  // 1. CONDITIONAL FETCH: Only fetch cart if logged in
  const { data: cart, isLoading: isCartLoading, error: cartError } = Cart.hooks.useCart();

  // If drawer is closed, don't render anything (Performance)
  // if (!isOpen) return null;

  // --- LOGGED OUT STATE ---
  if (!session) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          onClick={onClose}
        />
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] p-6 flex flex-col justify-center items-center text-center space-y-6 animate-slide-left">
          <ShoppingBag
            size={64}
            className="text-gray-300"
          />
          <h2 className="text-2xl font-bold">Your Cart is Hidden</h2>
          <p className="text-gray-500">Please sign in to view your shopping cart and save your items.</p>
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
            className="text-sm text-gray-400 hover:text-black"
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
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold">Shopping Cart ({cart?.items.length || 0})</h2>
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">Loading...</div>
            ) : cartError ? (
              <div className="text-red-500 text-center">Error loading cart.</div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
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
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 group"
                >
                  {/* ... (Your existing item rendering code) ... */}
                  <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0 relative">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                      <span className="font-bold text-sm">${item.product.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.product.category?.name} {item.color && `• Color`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + -1 })}
                          type="button"
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 rounded-l-full transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                          type="button"
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 rounded-r-full transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem({ itemId: item.id })}
                        type="button"
                        className="text-gray-400 hover:text-red-500 transition-colors"
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
          {cart && cart.items.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">${cart.subtotal.toFixed(2)}</span>
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
                  href={{pathname:"/checkout"}}
                  onClick={onClose}
                  className="flex-[2]"
                >
                  <Button className="w-full justify-between group">
                    Checkout{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
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
