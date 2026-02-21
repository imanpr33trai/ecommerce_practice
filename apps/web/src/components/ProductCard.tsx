import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import type React from "react";

import { ArrowLeftRight, Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";

import { useCartAddItemMutation } from "@/data/cart";
import { useWishListedQuery, useWishToggleMutation } from "@/data/wish";
import { authClient } from "@/lib/auth-client";
import type { ProductSingleResponse } from "@/data/product";

import { LayoutContext } from "../context/LayoutContext";
import { useShop } from "../context/ShopContext";
import Button from "./Button";
import ImageWithSkeleton from "./ImageWithSkeleton";
import ModalProductCardExpanded from "./ModalProductCardExpanded";

type ProductCardProps = {
  product: ProductSingleResponse;
  className?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const { toggleCart } = useContext(LayoutContext);
  const { data: session } = authClient.useSession();
  const { addToRecentlyViewed, setQuickViewProduct, compareList, addToCompare } = useShop();

  const { mutate: addItem, isPending: isAdding } = useCartAddItemMutation();
  const { mutate: toggleWish } = useWishToggleMutation();

  // Only check wishlist status if logged in, otherwise false
  const isWishlisted = useWishListedQuery(!!session, product.id);

  // Local UI State
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "#D9D9D9");
  const [hoverState, setHoverState] = useState<"idle" | "hovering" | "expanded">("idle");
  const [alignment, setAlignment] = useState<"right" | "left">("right");
  const [isCollapsing, setIsCollapsing] = useState(false);

  const router = useRouter();

  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInCompare = compareList.some((p) => p.id === product.id);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const windowWidth = document.documentElement.clientWidth;
      const expandedWidth = rect.width * 1.85;
      if (rect.left + expandedWidth > windowWidth - 24) {
        setAlignment("left");
      } else {
        setAlignment("right");
      }
    }
    setHoverState("hovering");
    setIsCollapsing(false);
    timerRef.current = setTimeout(() => {
      setHoverState("expanded");
    }, 1500);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setHoverState("idle");
    setIsCollapsing(true);
    setTimeout(() => setIsCollapsing(false), 1000);
  };

  // --- DB ACTION: Wishlist ---
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error("Please sign in to use wishlist");
      router.push("/sign-up");
      return;
    }
    // Optimistic mutation (Toast handled in the hook)
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
    // Call the mutation
    addItem(
      {
        productId: product.id,
        quantity: 1,
        color: selectedColor,
      },
      {
        onSuccess: () => {
          // Open the cart drawer on success
          toggleCart();
        },
      },
    );
  };

  // --- Client Actions (Compare / Quick View / Recent) ---
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
    setSelectedColor(color);
  };

  // --- Styles Logic (Kept as is) ---
  const isExpanded = hoverState === "expanded";
  const isHovering = hoverState === "hovering";

  let zIndexClass = "z-0";
  if (isExpanded) {
    zIndexClass = "z-[101]";
  } else if (isHovering) {
    zIndexClass = "z-[60]";
  } else if (isCollapsing) {
    zIndexClass = "z-[50]";
  }

  const isLeftAlign = alignment === "left";
  // ... (rest of style calculations)

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
      // Calculate discount percentage dynamically if available, else hardcode
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

  // const displayColors = product.colors && product.colors.length > 0 ? product.colors : ["#D9D9D9", "#3A3A3A", "#8C7A6B"];

  const displayColors = product.colors;
  const containerStyle = {
    left: isLeftAlign ? "auto" : "0",
    right: isLeftAlign ? "0" : "auto",
  };

  const imageStyle = {
    left: isLeftAlign ? "auto" : "0",
    right: isLeftAlign ? "0" : "auto",
    borderRadius: isExpanded ? (isLeftAlign ? "0 2rem 2rem 0" : "2rem 0 0 2rem") : "2rem 2rem 0 0",
  };
  const contentStyle: React.CSSProperties = (() => {
    if (isExpanded) {
      return isLeftAlign
        ? {
            right: "54%",
          }
        : {
            left: "54%",
          };
    }

    return isLeftAlign
      ? {
          left: "0",
          right: "auto",
        }
      : {
          right: "0",
          left: "auto",
        };
  })();

  const wishlistButtonStyle = {
    top: isExpanded ? "calc(100% - 60px)" : "16px",
    right: isExpanded ? (isLeftAlign ? "16px" : "auto") : "16px",
    left: isExpanded ? (isLeftAlign ? "auto" : "16px") : "auto",
  };

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 bg-white/80 backdrop-blur-md transition-opacity duration-1000 ease-premium ${isExpanded ? "z-100 opacity-100" : "z-[-1] opacity-0"}`}
      />

      <div
        ref={cardRef}
        className={`relative h-110 w-full transition-all duration-300 ${zIndexClass} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute top-0 origin-top overflow-hidden rounded-4xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-1000 ease-premium will-change-transform ${isHovering ? "scale-[1.02] shadow-xl ring-black/10" : ""}
                ${isExpanded ? "h-110 w-[185%] shadow-2xl ring-black/0" : "h-full w-full"}
              `}
          style={containerStyle}
        >
          <Link
            href={`/product/${product.slug}`}
            onClick={handleClick}
            className="group relative block h-full w-full"
          >
            <div
              className={`absolute top-0 overflow-hidden bg-[#F9F9F9] transition-all duration-1000 ease-premium ${isExpanded ? "h-full w-[54%]" : "h-70 w-full"}`}
              style={imageStyle}
            >
              {product.images.map((image) => (
                <ImageWithSkeleton
                  key={image.id}
                  src={image.url || "/images/caroline.jpg"}
                  alt={image.altText || product.name}
                  className={`h-full w-full transition-transform duration-1000 ease-premium ${hoverState !== "idle" ? "scale-105" : ""}`}
                />
              ))}

              <div className="pointer-events-none absolute top-5 left-5 z-10 flex flex-col gap-2">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`${badge.color} animate-fade-in rounded-full px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest shadow-sm`}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>

              <button
                onClick={handleWishlist}
                type="button"
                style={wishlistButtonStyle}
                className="absolute z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-md transition-all duration-1000 ease-premium hover:scale-110 hover:bg-white active:scale-95"
              >
                <Heart
                  size={20}
                  className={`transition-colors duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                />
              </button>

              <div
                className={`absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 transition-all duration-300 ${isHovering && !isExpanded ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
              >
                <Button
                  variant="icon"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleQuickView}
                  title="Quick View"
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="icon"
                  size="icon"
                  className={`h-10 w-10 rounded-full ${isInCompare ? "bg-black! text-white!" : ""}`}
                  onClick={handleCompare}
                  title="Compare"
                >
                  <ArrowLeftRight size={18} />
                </Button>
              </div>
            </div>

            <div
              className={`absolute overflow-hidden bg-white transition-all duration-1000 ease-premium ${isExpanded ? "top-0 h-full w-[46%]" : "top-70 h-40 w-full"}`}
              style={contentStyle}
            >
              <div
                className={`relative flex h-full flex-col justify-between transition-all duration-1000 ease-premium ${isExpanded ? "p-8" : "p-6"}`}
              >
                <div className="relative z-10">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <p
                        className={`mb-1.5 font-bold text-gray-400 text-xs uppercase tracking-widest transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-80"}`}
                      >
                        {product.category?.name}
                      </p>
                      <h3
                        className={`truncate font-bold text-gray-900 leading-tight transition-all duration-300 ${isExpanded ? "text-2xl" : "text-xl"}`}
                      >
                        {product.name}
                      </h3>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="block font-bold text-gray-900 text-lg transition-all duration-300">
                        ${product.price}
                      </span>
                      <div className="mt-1 ml-auto flex w-fit items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 font-bold text-[10px] text-yellow-600">
                        <Star
                          size={10}
                          fill="currentColor"
                        />{" "}
                        {product.rating}
                      </div>
                    </div>
                  </div>
                </div>

                <ModalProductCardExpanded
                  product={product}
                  isInCompare={isInCompare}
                  isAdding={isAdding}
                  selectedColor={selectedColor}
                  displayColors={displayColors}
                  onQuickView={handleQuickView}
                  onCompare={handleCompare}
                  onAddToCart={handleAddToCart}
                  onSelectColor={handleSelectColor}
                  isExpanded={isExpanded}
                />

                <div
                  className={`absolute right-6 bottom-6 transition-all duration-300 ease-out ${isExpanded ? "pointer-events-none translate-y-4 scale-50 opacity-0" : "translate-y-0 scale-100 opacity-100"}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-black shadow-sm hover:bg-gray-200">
                    <ShoppingBag size={20} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
