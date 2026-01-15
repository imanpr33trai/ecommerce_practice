"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import BentoCard from "@/components/BentoCard";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { useProudctDetailQuery } from "@/data/product";
import { useWishListedQuery, useWishToggleMutation } from "@/data/wish";
import { authClient } from "@/lib/auth-client";

interface ProductGalleryProps {
  slug: string;
}

export default function ProductGallery({ slug }: ProductGalleryProps) {
  const { data: session } = authClient.useSession();
  const { data: product } = useProudctDetailQuery(slug);
  const { mutate: toggleWish } = useWishToggleMutation();
  const isWishlisted = useWishListedQuery(!!session, product.id);

  if (!product) {
    return null;
  }

  const handleWishlist = () => {
    if (!session) {
      return toast.error("Please login to save items");
    }
    toggleWish(product.id);
  };

  return (
    <BentoCard className="lg:col-span-8 min-h-125 lg:h-162.5 bg-[#F4F4F4] relative group overflow-hidden">
      {product.images.map((image) => (
        <ImageWithSkeleton
          src={image.url}
          key={image.id}
          alt={image.altText || product.name}
          className="w-full h-full object-cover object-center"
        />
      ))}
      <button
        onClick={handleWishlist}
        type="button"
        className="absolute top-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur shadow-md transition-all duration-300 hover:scale-110 active:scale-95 z-20"
      >
        <Heart
          size={24}
          className={`transition-colors duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"}`}
        />
      </button>
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-lg z-20">
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
      </div>
    </BentoCard>
  );
}
