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
    <BentoCard className="group relative min-h-125 overflow-hidden bg-[#F4F4F4] lg:col-span-8 lg:h-162.5">
      {product.images.map((image) => (
        <ImageWithSkeleton
          src={image.url}
          key={image.id}
          alt={image.altText || product.name}
          className="h-full w-full object-cover object-center"
        />
      ))}
      <button
        onClick={handleWishlist}
        type="button"
        className="absolute top-6 right-6 z-20 rounded-full bg-white/90 p-3 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Heart
          size={24}
          className={`transition-colors duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"}`}
        />
      </button>
      <div className="absolute bottom-6 left-6 z-20 rounded-full bg-white/90 px-6 py-3 shadow-lg backdrop-blur md:bottom-8 md:left-8">
        <h1 className="font-bold text-2xl md:text-3xl">{product.name}</h1>
      </div>
    </BentoCard>
  );
}
