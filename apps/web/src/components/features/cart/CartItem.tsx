"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useUpdateQuantityMutation } from "@/hooks/mutations/useUpdateQuantityMutation";
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";
import Button from "@/components/Button";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    color: string | null;
    productId: string;
    product: {
      id: string;
      name: string;
      slug: string;
      price: string | number;
      category: {
        id: string;
        name: string;
        slug: string;
      } | null;
      discountPrice: string | number | null;
      stock: number;
      colors: string[] | null;
      images: Array<{
        id: string;
        url: string;
        altText: string | null;
      }>;
    };
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { mutate: updateQuantity } = useUpdateQuantityMutation();
  const { mutate: removeItem } = useRemoveFromCartMutation();

  const product = item.product;
  const price = product.discountPrice
    ? typeof product.discountPrice === "string"
      ? parseFloat(product.discountPrice)
      : product.discountPrice
    : typeof product.price === "string"
    ? parseFloat(product.price)
    : product.price;

  const originalPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const isOnSale = product.discountPrice && originalPrice > price;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.stock) return;
    updateQuantity({ productId: item.id, quantity: newQuantity });
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="group flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h3 className="font-semibold text-gray-900 truncate pr-2">{product.name}</h3>
          <span className="font-bold text-gray-900 whitespace-nowrap">${price.toFixed(2)}</span>
        </div>

        <p className="mt-1 text-sm text-gray-500 truncate">
          {product.category?.name} {item.color && `• ${item.color}`}
        </p>

        {/* Quantity Selector */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center rounded-full border border-gray-200">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-l-full bg-white text-xs text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= product.stock}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-r-full bg-white text-xs text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <span className="text-sm text-gray-500">Max: {product.stock}</span>
        </div>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <div className="font-bold text-gray-900">
            ${(price * item.quantity).toFixed(2)}
          </div>
          {isOnSale && (
            <div className="text-xs text-gray-400 line-through">
              ${(originalPrice * item.quantity).toFixed(2)}
            </div>
          )}
        </div>
        <button
          onClick={handleRemove}
          type="button"
          className="p-2 text-gray-400 rounded-lg transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label="Remove from cart"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}