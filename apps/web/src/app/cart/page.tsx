"use client";

// import React from 'react';

import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
      <div className="mx-auto flex min-h-[60vh] max-w-[1200px] animate-fade-in flex-col items-center justify-center p-4 text-center md:px-8">
        <Breadcrumbs />
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h1 className="mb-2 font-light text-3xl">Your Cart is Empty</h1>
        <p className="mb-8 max-w-md text-gray-500">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/product">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[80vh] max-w-[1200px] animate-fade-in p-4 md:px-8">
      <Breadcrumbs />
      <h1 className="mb-8 font-light text-4xl">
        Your Cart <span className="text-2xl text-gray-400">({cart.items.length})</span>
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <BentoCard key={item.id} className="group flex items-center gap-4 bg-white p-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                {item.product.images.map((image) => (
                  <Image
                    src={image.url}
                    width={200}
                    height={300}
                    key={image.id}
                    alt={image.altText || item.product.name}
                    className="h-full w-full object-cover mix-blend-multiply"
                  />
                ))}
              </div>

              <div className="flex-1">
                <div className="mb-1 flex justify-between">
                  <h3 className="font-bold text-lg">{item.product.name}</h3>
                  <span className="font-medium">${item.product.price}</span>
                </div>
                <p className="mb-2 text-gray-500 text-sm">
                  {item.product.category?.name} {item.color && `• ${item.color}`}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 rounded-full bg-gray-100 px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity({ productId: item.id, quantity: item.quantity + -1 })
                      }
                      type="button"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-sm hover:bg-gray-50">
                      <Minus size={10} />
                    </button>
                    <span className="w-4 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity({ productId: item.id, quantity: item.quantity + 1 })
                      }
                      type="button"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-sm hover:bg-gray-50">
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                type="button"
                className="p-2 text-gray-400 transition-colors hover:text-red-500">
                <X size={20} />
              </button>
            </BentoCard>
          ))}

          <Link href="/product">
            <Button variant="outline" className="mt-4">
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="lg:col-span-1">
          <BentoCard className="sticky top-24 p-6">
            <h2 className="mb-6 font-bold text-xl">Order Summary</h2>
            <div className="mb-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="my-4 h-px bg-gray-100" />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href={{ pathname: "/checkout" }} className="block w-full">
              <Button className="group !justify-between w-full px-6">
                <span>Checkout</span>
                <span className="rounded-full bg-white/20 p-1 transition-colors group-hover:bg-white/30">
                  <ArrowRight size={16} />
                </span>
              </Button>
            </Link>

            <p className="mt-4 text-center text-gray-400 text-xs">
              Secure checkout provided by Nestify.
            </p>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
