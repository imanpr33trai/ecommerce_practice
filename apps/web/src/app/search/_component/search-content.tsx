"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Loader2, Search } from "lucide-react";

import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard"; // Your complex card
import { Product } from "@/feature/product";

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // FIX: Pass object with 'search' key
  const {
    data: searchResults,
    isLoading,
    isError,
  } = Product.hooks.useList({
    search: query,
    limit: 20,
  });

  const products = searchResults?.items || [];

  return (
    <div className="p-4 md:px-8 max-w-400 mx-auto animate-fade-in min-h-[80vh]">
      <div className="mb-8 pt-4 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-light mb-2">Search Results</h1>
        <p className="text-gray-500">
          Showing results for <span className="font-bold text-black">"{query}"</span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2
            className="animate-spin text-gray-400"
            size={32}
          />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-20">Something went wrong while searching.</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Search
              size={32}
              className="text-gray-300"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            We couldn't find any products matching "{query}". Try different keywords or browse our
            catalog.
          </p>
          <Link href="/product">
            <Button
              size="lg"
              className="rounded-full px-8"
            >
              Browse All Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
