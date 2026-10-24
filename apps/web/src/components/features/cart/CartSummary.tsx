"use client";

import { ArrowRight } from "lucide-react";

import Button from "@/components/Button";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  onCheckout: () => void;
  className?: string;
}

export default function CartSummary({
  subtotal,
  totalItems,
  onCheckout,
  className = "",
}: CartSummaryProps) {
  const tax = subtotal * 0.08;
  const shipping = subtotal > 200 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <div
      className={`sticky top-24 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}
      aria-labelledby="cart-summary-heading"
    >
      <h2 id="cart-summary-heading" className="mb-6 font-bold text-xl">
        Order Summary ({totalItems})
      </h2>

      <div className="mb-6 space-y-3">
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600 text-sm">
          <span>Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-600 text-sm">
          <span>Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="my-4 h-px bg-gray-100" />

        <div className="flex justify-between font-bold text-xl text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {subtotal > 0 && subtotal < 200 && (
        <p className="mb-4 text-sm text-gray-500 text-center">
          Add ${(200 - subtotal).toFixed(2)} more for free shipping!
        </p>
      )}

      <button
        onClick={onCheckout}
        disabled={totalItems === 0}
        className="group w-full justify-between px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Checkout</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 p-1 transition-colors group-hover:bg-white/30">
          <ArrowRight size={16} className="text-white" />
        </span>
      </button>

      <p className="mt-4 text-center text-gray-400 text-xs">
        Secure checkout provided by Nestify.
      </p>
    </div>
  );
}