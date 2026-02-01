"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import { Button as ShadcnButton } from "@comp/button";
import { ArrowRight, Heart, ShoppingBag, Star, X } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/Button";
import { useCartAddItemMutation } from "@/data/cart";
import { useProudctDetailQuery } from "@/data/product";
import { useWishToggleMutation } from "@/data/wish";
import { authClient } from "@/lib/auth-client";

// Next.js 15+ Params are Promises
export default function ModalProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  // --- HOOKS ---
  const { data: product, isLoading } = useProudctDetailQuery(slug);
  const { mutate: addItem, isPending: isAdding } = useCartAddItemMutation();
  const { mutate: toggleWish } = useWishToggleMutation();
  const { data: session } = authClient.useSession();

  // Safe access to wishlist status (requires product id)

  // --- UI STATE ---
  const [activeColor, setActiveColor] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize color when product loads
  useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      setActiveColor(product.colors[0] || "");
    }
  }, [product]);

  // Animation & Scroll Lock
  useEffect(() => {
    setIsAnimating(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const onDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => router.back(), 300);
  };

  // --- HANDLERS ---

  const handleAddToCart = () => {
    if (!session) {
      return toast.error("Please login to add to cart");
    }
    if (!product) {
      return;
    }

    addItem({
      productId: product.id,
      quantity: 1,
      color: activeColor,
    });
  };

  const handleWishlist = () => {
    if (!session) {
      return toast.error("Please login to save items");
    }
    if (!product) {
      return;
    }
    toggleWish(product.id);
  };

  // --- RENDER ---

  if (isLoading) {
    return null; // Or a transparent spinner
  }
  if (!product) {
    return null;
  }
  // const isWishlisted = useWishQueries.useIsWishlisted(product.id);
  const isWishlisted = true;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
        onClick={onDismiss}
      />

      {/* Modal Content */}
      <div
        className={`relative flex h-[90vh] w-full max-w-6xl transform flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:h-[800px] md:flex-row ${isAnimating ? "translate-y-0 scale-100 opacity-100" : "translate-y-12 scale-95 opacity-0"}
        `}
      >
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/80 p-2 backdrop-blur-md transition-all duration-300 hover:bg-black hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Left: Image */}
        <div className="group relative h-[40vh] w-full bg-gray-100 md:h-full md:w-[60%]">
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute bottom-8 left-8 flex gap-3">
            {product.isNew && (
              <span className="rounded-full bg-black px-4 py-2 font-bold text-white text-xs uppercase">
                New Arrival
              </span>
            )}
            {product.isOnSale && (
              <span className="rounded-full bg-red-500 px-4 py-2 font-bold text-white text-xs uppercase">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-white p-8 md:w-[40%] md:p-10">
          <div className="mb-auto">
            <div className="mb-2 flex items-start justify-between">
              <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                {product.category?.name}
              </span>
              <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-2 py-1 text-yellow-500">
                <Star
                  size={14}
                  fill="currentColor"
                />
                <span className="font-bold text-black text-sm">
                  {product.rating?.toFixed(1) || "New"}
                </span>
              </div>
            </div>

            <h2 className="mb-4 font-light text-4xl leading-tight">{product.name}</h2>

            <div className="mb-8 flex items-baseline gap-3">
              <span className="font-medium text-3xl">${Number(product.price).toFixed(2)}</span>
              {product.discountPrice && (
                <span className="text-gray-400 text-lg line-through">
                  ${Number(product.discountPrice).toFixed(2)}
                </span>
              )}
            </div>

            <p className="mb-8 text-gray-600 text-lg leading-relaxed">
              {product.description || "No description available."}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <span className="mb-4 block font-bold text-gray-400 text-xs uppercase tracking-widest">
                  Select Finish
                </span>
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setActiveColor(color)}
                      className={`h-12 w-12 rounded-full border-2 transition-all duration-300 ${activeColor === color ? "scale-110 border-black" : "border-gray-200 hover:border-gray-400"}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 space-y-4 border-gray-100 border-t pt-8">
            <div className="flex gap-3">
              <Button
                className="group h-14 flex-1 bg-black text-lg text-white hover:bg-gray-800"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                {isAdding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                <ShoppingBag
                  size={20}
                  className="ml-2 transition-transform group-hover:-translate-y-1"
                />
              </Button>

              <button
                onClick={handleWishlist}
                className={`flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 transition-all ${isWishlisted ? "border-red-200 bg-red-50" : "hover:bg-gray-50"}`}
              >
                <Heart
                  size={24}
                  className={isWishlisted ? "fill-red-500 text-red-500" : "text-black"}
                />
              </button>
            </div>

            <ShadcnButton
              variant="link"
              onClick={() => {
                // Hard Navigation to bypass modal
                window.location.href = `/product/${product.slug}`;
              }}
              className="mx-auto mt-2 flex items-center justify-center gap-1 font-bold text-gray-400 text-xs uppercase tracking-widest hover:text-black"
            >
              View Full Details Page <ArrowRight size={12} />
            </ShadcnButton>
          </div>
        </div>
      </div>
    </div>
  );
}
