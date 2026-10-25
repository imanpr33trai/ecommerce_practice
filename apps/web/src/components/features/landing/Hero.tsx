import Image from "next/image";
import Link from "next/link";
import type React from "react";

import { ArrowRight, ArrowUpRight, Heart, Star } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import type { ProductSingleResponse } from "@/data/product";

interface HeroProps {
  product: ProductSingleResponse;
}

export const Hero: React.FC<HeroProps> = ({ product }) => {
  return (
    <BentoCard className="group relative flex flex-col justify-center overflow-hidden bg-[#F2F2F0] lg:col-span-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-bold text-[12vw] text-white uppercase leading-none tracking-tighter">
        Nestify
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-around gap-8 p-8 md:flex-row md:p-12">
        <div className="max-w-md flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-3 py-1 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
            <span className="font-bold text-gray-600 text-xs uppercase tracking-wider">
              New Arrival
            </span>
          </div>

          <h1 className="font-light text-4xl leading-[1.1] tracking-tight md:text-6xl">
            {product.name}
          </h1>

          <div className="flex items-center gap-4">
            <span className="font-medium text-2xl">
              ${product.price}
            </span>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="font-bold text-black">{product.rating}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={`/product/${product.slug}`} className="flex-1">
              <Button className="h-12 w-full px-8!">View Product</Button>
            </Link>
            <Button
              variant="icon"
              className="h-12 w-12 bg-white transition-transform hover:bg-white/80 active:scale-90"
              aria-label="Add to wishlist"
            >
              <Heart
                size={20}
                className="transition-colors duration-300 text-black"
              />
            </Button>
          </div>
        </div>

        <div className="relative aspect-square w-full max-w-[400px] flex-1 transition-transform duration-150 ease-out">
          <div className="absolute inset-0 scale-75 transform rounded-full bg-white/40 blur-3xl"></div>
          <Image
            width={100}
            height={200}
            src={product.images[0]?.url || "/images/caroline.jpg"}
            alt={product.name}
            className="relative h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </div>
    </BentoCard>
  );
};

export default Hero;