"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";

import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";

import { useCartAddItemMutation } from "@/data/cart";
import { useWishListedQuery, useWishToggleMutation } from "@/data/wish";
import { authClient } from "@/lib/auth-client";
import type { ProductSingleResponse } from "@/data/product";

import { LayoutContext } from "@/context/LayoutContext";
import { useShop } from "@/context/ShopContext";
import Button from "@/components/Button";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

interface ProductCardProps {
  product: ProductSingleResponse;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { toggleCart } = React.useContext(LayoutContext);
  const { data: session } = authClient.useSession();
  const { addToRecentlyViewed, setQuickViewProduct, compareList, addToCompare } = useShop();

  const { mutate: addItem, isPending: isAdding } = useCartAddItemMutation();
  const { mutate: toggleWish } = useWishToggleMutation();

  // Only check wishlist status if logged in, otherwise false
  const isWishlisted = useWishListedQuery(!!session, product.id);

  // Local UI State
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "#D9D9D9");
  const [hovered, setHovered] = useState(false);

  const router = useRouter();

  const isInCompare = compareList.some((p) => p.id === product.id);

  // --- DB ACTION: Wishlist ---
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error("Please sign in to use wishlist");
      router.push("/sign-up");
      return;
    }
    toggleWish(product.id);
  };

  // --- DB ACTION: Add to Cart ---
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error("Please sign in to use cart");
      router.push("/sign-up");
      return;
    }
    addItem(
      {
        productId: product.id,
        quantity: 1,
        color: selectedColor,
      },
      {
        onSuccess: () => {
          toggleCart();
        },
      },
    );
  };

  // --- Client Actions ---
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      toast.info("Info", {
        description: `${product.name} is already in compare`,
      });
    } else {
      addToCompare(product);
    }
  };

  const handleClick = () => {
    addToRecentlyViewed(product);
  };

  const handleSelectColor = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(color);
  };

  // --- Badges ---
  const badges = [];
  if (product.isNew) {
    badges.push({
      text: "NEW",
      color: "bg-black text-white",
      id: 1,
    });
  }
  if (product.isOnSale) {
    badges.push({
      text: product.discountPrice
        ? `-${Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100)}%`
        : "SALE",
      color: "bg-red-500 text-white",
      id: 2,
    });
  }
  if ((product.rating || 0) >= 4.9) {
    badges.push({
      text: "TOP RATED",
      color: "bg-blue-600 text-white",
      id: 3,
    });
  }

  const displayColors = product.colors;

  const wishlistButtonStyle: React.CSSProperties = {
    top: "16px",
    right: "16px",
  };

  return (
    <div
      className={`relative group h-full transition-all duration-300 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/product/${product.slug}`}
        onClick={handleClick}
        className="block h-full"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F9F9F9]">
          {product.images.map((image: { id: string; url?: string; altText?: string }) => (
            <ImageWithSkeleton
              key={image.id}
              src={image.url || "/images/caroline.jpg"}
              alt={image.altText || product.name}
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
          ))}
        </div>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {badges.map((badge, idx) => (
            <span
              key={idx}
              className={`${badge.color} animate-fade-in rounded-full px-2.5 py-1 font-bold text-[9px] uppercase tracking-widest shadow-sm`}
            >
              {badge.text}
            </span>
          ))}
        </div>

        <button
          onClick={handleWishlist}
          type="button"
          style={wishlistButtonStyle}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`}
          />
        </button>

        <div
          className={`absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 transition-all duration-300 ${hovered ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
        >
          <Button
            variant="icon"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={handleQuickView}
            title="Quick View"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
          <Button
            variant="icon"
            size="icon"
            className={`h-9 w-9 rounded-full ${isInCompare ? "bg-black! text-white!" : ""}`}
            onClick={handleCompare}
            title="Compare"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
              <path d="M15 18l6-6-6-6" />
            </svg>
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <p className="font-medium text-gray-400 text-xs uppercase tracking-widest truncate">
            {product.category?.name}
          </p>
          <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-lg">
              ${product.price}
            </span>
            {product.discountPrice && (
              <span className="line-through text-gray-400 text-sm">
                ${product.discountPrice}
              </span>
            )}
            <div className="ml-auto flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-0.5 font-bold text-[9px] text-yellow-600">
              <Star
                size={10}
                fill="currentColor"
              />{" "}
              {product.rating}
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-1.5" aria-label="Color options">
          {displayColors?.map((color: string, idx: number) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleSelectColor(e, color)}
              className={`relative h-6 w-6 rounded-full border-2 transition-all ${
                selectedColor === color ? "ring-2 ring-black ring-offset-2" : "border-transparent hover:border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="mt-4 w-full rounded-xl bg-black px-4 py-3 font-bold text-white transition-colors hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </Link>
    </div>
  );
}

export default ProductCard;