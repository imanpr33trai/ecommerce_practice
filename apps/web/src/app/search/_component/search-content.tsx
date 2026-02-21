"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Loader2, Search } from "lucide-react";

import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard"; // Your complex card
import { useProductListQuery } from "@/data/product";

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // FIX: Pass object with 'search' key
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useProductListQuery({
    search: query,
    limit: 20,
  });

  const products = searchResults?.data.items || [];

  return (
    <div className="mx-auto min-h-[80vh] max-w-400 animate-fade-in p-4 md:px-8">
      <div className="mb-8 border-gray-100 border-b pt-4 pb-6">
        <h1 className="mb-2 font-light text-3xl">Search Results</h1>
        <p className="text-gray-500">
          Showing results for <span className="font-bold text-black">"{query}"</span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2
            className="animate-spin text-gray-400"
            size={32}
          />
        </div>
      ) : isError ? (
        <div className="py-20 text-center text-red-500">Something went wrong while searching.</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 border-dashed bg-gray-50 py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
            <Search
              size={32}
              className="text-gray-300"
            />
          </div>
          <h2 className="mb-2 font-bold text-2xl">No results found</h2>
          <p className="mb-8 max-w-md text-gray-500">
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
