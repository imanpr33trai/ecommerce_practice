"use client";

import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { useToggleWishlistMutation } from "@/hooks/mutations/useToggleWishlistMutation";
import { authClient } from "@/lib/auth-client";

interface ProductImageGalleryProps {
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{
      id: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
    }>;
  };
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: toggleWish } = useToggleWishlistMutation();

  const handleWishlist = () => {
    if (!session) {
      return toast.error("Please login to save items");
    }
    toggleWish(product.id);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isModalOpen) return;
    if (e.key === "ArrowLeft") {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    } else if (e.key === "ArrowRight") {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    } else if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  };

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const currentImage = product.images[currentImageIndex] || primaryImage;

  return (
    <div className="relative group">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
        <button
          onClick={() => handleImageClick(currentImageIndex)}
          className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="View larger image"
        >
          <ImageWithSkeleton
            src={currentImage?.url || primaryImage?.url || ""}
            alt={currentImage?.altText || product.name}
            className="h-full w-full object-cover object-center transition-opacity duration-300"
            containerClassName="h-full w-full"
          />
        </button>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          type="button"
          className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
          aria-label="Add to wishlist"
        >
          <Heart size={20} className="text-gray-700" />
        </button>

        {/* Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
              }
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-2 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
              }
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-2 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Expand Icon Overlay */}
        <div className="absolute bottom-4 right-4 z-10 rounded-full bg-white/90 p-2 shadow-md backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
          <Expand size={20} className="text-gray-700" />
        </div>
      </div>

      {/* Thumbnail Strip */}
      {product.images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {product.images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(index)}
              type="button"
              className={`relative flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === currentImageIndex ? "true" : "false"}
            >
              <ImageWithSkeleton
                src={image.url}
                alt={image.altText || `${product.name} - view ${index + 1}`}
                className="h-full w-full object-cover object-center"
                containerClassName="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setIsModalOpen(false)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button
            onClick={() => setIsModalOpen(false)}
            type="button"
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close gallery"
          >
            <ChevronRight size={24} className="rotate-45" />
          </button>

          <button
            onClick={() =>
              setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
            }
            type="button"
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="relative max-h-[85vh] max-w-[90vw]">
            <ImageWithSkeleton
              src={product.images[currentImageIndex]?.url || ""}
              alt={product.images[currentImageIndex]?.altText || product.name}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              containerClassName="max-h-[85vh] max-w-[90vw]"
            />
          </div>

          <button
            onClick={() =>
              setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
            }
            type="button"
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:right-8"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          {/* Thumbnail strip in modal */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                type="button"
                className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex ? "border-primary" : "border-white/30 hover:border-white/50"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <ImageWithSkeleton
                  src={image.url}
                  alt={image.altText || `${product.name} - view ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                  containerClassName="h-full w-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}