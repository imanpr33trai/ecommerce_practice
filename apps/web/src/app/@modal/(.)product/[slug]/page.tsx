"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import { Button as ShadcnButton } from "@comp/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowRight, Heart, ShieldCheck, ShoppingBag, Star, Truck, X } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/Button";
import { useShop } from "@/context/ShopContext";
import { Cart } from "@/feature/cart";
import { Product } from "@/feature/product";
import { useWishMutations, useWishQueries } from "@/feature/wish/client";
import { authClient } from "@/lib/auth-client";

// Next.js 15+ Params are Promises
export default function ModalProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { quickViewProduct, setQuickViewProduct } = useShop();

  // --- HOOKS ---
  const { data: product, isLoading } = Product.hooks.useDetail(slug);
  const { addItem, isAdding } = Cart.hooks.useActions();
  const { mutate: toggleWish } = useWishMutations.useToggle();
  const { data: session } = authClient.useSession();

  // Safe access to wishlist status (requires product id)

  // --- UI STATE ---
  const [activeColor, setActiveColor] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize color when product loads
  useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      setActiveColor(product.colors[0]!);
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
    if (!session) return toast.error("Please login to add to cart");
    if (!product) return;

    addItem({
      productId: product.id,
      quantity: 1,
      color: activeColor,
    });
  };

  const handleWishlist = () => {
    if (!session) return toast.error("Please login to save items");
    if (!product) return;
    toggleWish({ productId: product.id });
  };

  // --- RENDER ---

  if (isLoading) return null; // Or a transparent spinner
  if (!product) return null;
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
        className={`
          relative bg-white w-full max-w-6xl h-[90vh] md:h-[800px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row
          transform transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${isAnimating ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-12 opacity-0"}
        `}
      >
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-black hover:text-white transition-all duration-300"
        >
          <X size={24} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-[60%] h-[40vh] md:h-full bg-gray-100 relative group">
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute bottom-8 left-8 flex gap-3">
            {product.isNew && <span className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase">New Arrival</span>}
            {product.isOnSale && <span className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase">Sale</span>}
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-[40%] flex flex-col h-full bg-white overflow-y-auto no-scrollbar p-8 md:p-10">
          <div className="mb-auto">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{product.category?.name}</span>
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star
                  size={14}
                  fill="currentColor"
                />
                <span className="text-sm font-bold text-black">{product.rating?.toFixed(1) || "New"}</span>
              </div>
            </div>

            <h2 className="text-4xl font-light mb-4 leading-tight">{product.name}</h2>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-medium">${Number(product.price).toFixed(2)}</span>
              {product.discountPrice && <span className="text-lg text-gray-400 line-through">${Number(product.discountPrice).toFixed(2)}</span>}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description || "No description available."}</p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-4">Select Finish</span>
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setActiveColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${activeColor === color ? "border-black scale-110" : "border-gray-200 hover:border-gray-400"}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="space-y-4 pt-8 border-t border-gray-100 mt-8">
            <div className="flex gap-3">
              <Button
                className="flex-1 h-14 text-lg group bg-black text-white hover:bg-gray-800"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                {isAdding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                <ShoppingBag
                  size={20}
                  className="ml-2 group-hover:-translate-y-1 transition-transform"
                />
              </Button>

              <button
                onClick={handleWishlist}
                className={`w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center transition-all ${isWishlisted ? "bg-red-50 border-red-200" : "hover:bg-gray-50"}`}
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
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center justify-center gap-1 mx-auto mt-2"
            >
              View Full Details Page <ArrowRight size={12} />
            </ShadcnButton>
          </div>
        </div>
      </div>
    </div>
  );
}
