"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart, Trash2 } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { useToggleWishlistMutation } from "@/hooks/mutations/useToggleWishlistMutation";
import { useWishListQuery } from "@/data/wish";
import { formatCurrency } from "@/lib/format-currency";
import { authClient } from "@/lib/auth-client";

export function AccountWishlist() {
  const { data: session } = authClient.useSession();
  const { data: items = [], isLoading } = useWishListQuery(!!session);
  const { mutate: toggleWishlist } = useToggleWishlistMutation();

  const wishlistItems = items ?? [];

  const handleRemove = (productId: string) => {
    toggleWishlist(productId);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="mb-6 font-light text-3xl">My Wishlist ({wishlistItems.length})</h2>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <BentoCard key={i} className="h-40 animate-pulse bg-gray-100">
              <div className="h-full" />
            </BentoCard>
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-200 border-dashed bg-white py-20 text-center">
          <Heart size={48} className="mb-4 text-gray-200" />
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link href="/product" className="mt-4">
            <Button variant="outline" size="sm">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => (
            <BentoCard key={item.id} className="group relative bg-white p-4">
              <div className="relative h-48 overflow-hidden rounded-xl bg-gray-100">
                {item.product.images.length === 0 ? (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
                ) : (
                  <Link href={`/product/${item.product.slug}`}>
                    <Image
                      src={item.product.images[0]!.url}
                      alt={item.product.images[0]!.altText || item.product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                )}
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 text-gray-400 transition-colors hover:text-red-500 backdrop-blur-sm"
                  type="button"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="font-bold text-sm line-clamp-2 group-hover:text-black transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{formatCurrency(Number(item.product.price))}</span>
                  <Link href={`/product/${item.product.slug}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      )}
    </div>
  );
}