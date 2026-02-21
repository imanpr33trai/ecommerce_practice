"use client";

import Link from "next/link";

import { Heart } from "lucide-react";

import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import { useWishListQuery } from "@/data/wish";
import { authClient } from "@/lib/auth-client";

export default function WishlistPage() {
  const { data } = authClient.useSession();
  const { data: wishlist, isLoading, isError, error } = useWishListQuery(!!data);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || error) {
    return <div>Error {error.message}</div>;
  }
  if (!wishlist) {
    return <div>wishlist is undefined or null</div>;
  }

  return (
    <div className="mx-auto min-h-[80vh] max-w-[1600px] animate-slide-up p-4 md:px-8">
      <div className="mb-8">
        <h1 className="mb-2 font-light text-4xl">
          My Wishlist <span className="text-2xl text-gray-400">({wishlist.data.length})</span>
        </h1>
        <p className="text-gray-500">Items you've saved for later.</p>
      </div>
      {wishlist.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.data.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-200 border-dashed bg-white py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
            <Heart
              size={32}
              className="text-gray-400"
            />
          </div>
          <h2 className="mb-4 font-bold text-2xl">Your wishlist is empty</h2>
          <p className="mb-8 max-w-md text-gray-500">
            Browse our collection and find something you love.
          </p>
          <Link href="/product">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
