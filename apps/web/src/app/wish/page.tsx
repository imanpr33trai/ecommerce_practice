"use client"
import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/ui/Button';
import { useShop } from '@/context/ShopContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useShop();

  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto animate-slide-up min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-4xl font-light mb-2">My Wishlist <span className="text-gray-400 text-2xl">({wishlist.length})</span></h1>
        <p className="text-gray-500">Items you've saved for later.</p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
             <Heart size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md">Browse our collection and find something you love.</p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}