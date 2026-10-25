import Link from "next/link";
import { useRef, useState } from "react";
import type React from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import type { ProductSingleResponse } from "@/data/product";

interface FeaturedProductsProps {
  title: string;
  subtitle: string;
  products: ProductSingleResponse[];
  categoryLink: string;
  viewTransitionName?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  products,
  categoryLink,
  viewTransitionName,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 320;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * 1;

      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll =
        direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="featured-products"
      className="group relative animate-slide-up space-y-6"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={viewTransitionName ? { viewTransitionName } : undefined}
    >
      <div className="flex items-end justify-between px-2">
        <div>
          <h2 className="font-light text-3xl">{title}</h2>
          <p className="mt-1 text-gray-500 text-sm">{subtitle}</p>
        </div>
        <Link href={{ pathname: categoryLink }}>
          <Button variant="outline" size="sm" className="rounded-full">
            View Collection
          </Button>
        </Link>
      </div>

      <Button
        variant="icon"
        onClick={() => scroll("left")}
        className="absolute top-[55%] left-0 z-20 -ml-5 hidden -translate-y-1/2 border border-gray-100 bg-white text-black opacity-0 shadow-xl transition-all duration-300 hover:scale-110 group-hover:opacity-100 md:flex"
        aria-label="Scroll left"
      >
        <ArrowLeft size={20} />
      </Button>

      <Button
        variant="icon"
        onClick={() => scroll("right")}
        className="absolute top-[55%] right-0 z-20 -mr-5 hidden -translate-y-1/2 border border-gray-100 bg-white text-black opacity-0 shadow-xl transition-all duration-300 hover:scale-110 group-hover:opacity-100 md:flex"
        aria-label="Scroll right"
      >
        <ArrowRight size={20} />
      </Button>

      <div
        ref={scrollRef}
        className="no-scrollbar -mx-2 flex snap-x items-start gap-4 overflow-x-auto scroll-smooth p-2 pt-4 pb-8"
        style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-75 shrink-0 snap-center md:min-w-85">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;