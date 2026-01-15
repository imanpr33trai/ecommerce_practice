"use client";

// import React from 'react';

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import {
  useCartItemRemoveMutation,
  useCartListItemsQuery,
  useCartUpdateItemQuantityMutation,
} from "@/data/cart";

export default function CartPage() {
  const { data: cartData, isLoading: isCartLoading, error: cartError } = useCartListItemsQuery();
  const { mutate: removeItem } = useCartItemRemoveMutation();
  const { mutate: updateQuantity } = useCartUpdateItemQuantityMutation();

  const cart = cartData?.data;

  if (isCartLoading) {
    return <div>cart page is isLoading</div>;
  }

  if (!cart || cartError) {
    return <div>cart page error{cartError?.message}</div>;
  }

  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cart.items.length === 0) {
    return (
      <div className="p-4 md:px-8 max-w-[1200px] mx-auto animate-fade-in min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Breadcrumbs />
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag
            size={32}
            className="text-gray-400"
          />
        </div>
        <h1 className="text-3xl font-light mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/product">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:px-8 max-w-[1200px] mx-auto animate-fade-in min-h-[80vh]">
      <Breadcrumbs />
      <h1 className="text-4xl font-light mb-8">
        Your Cart <span className="text-gray-400 text-2xl">({cart.items.length})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <BentoCard
              key={item.id}
              className="p-4 flex gap-4 items-center bg-white group"
            >
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                {item.product.images.map((image) => (
                  <Image
                    src={image.url}
                    width={200}
                    height={300}
                    key={image.id}
                    alt={image.altText || item.product.name}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                ))}
              </div>

              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <h3 className="font-bold text-lg">{item.product.name}</h3>
                  <span className="font-medium">${item.product.price}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {item.product.category?.name} {item.color && `• ${item.color}`}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity({ productId: item.id, quantity: item.quantity + -1 })
                      }
                      type="button"
                      className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs hover:bg-gray-50"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity({ productId: item.id, quantity: item.quantity + 1 })
                      }
                      type="button"
                      className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs hover:bg-gray-50"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                type="button"
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </BentoCard>
          ))}

          <Link href="/product">
            <Button
              variant="outline"
              className="mt-4"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="lg:col-span-1">
          <BentoCard className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href={{ pathname: "/checkout" }}
              className="block w-full"
            >
              <Button className="w-full group !justify-between px-6">
                <span>Checkout</span>
                <span className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={16} />
                </span>
              </Button>
            </Link>

            <p className="text-xs text-center text-gray-400 mt-4">
              Secure checkout provided by Nestify.
            </p>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
