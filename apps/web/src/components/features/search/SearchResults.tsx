"use client";

import Link from "next/link";
import { Loader2, Search } from "lucide-react";

import { useSearchQuery } from "@/hooks/queries/useSearchQuery";
import type { ProductFilters } from "@/data/product";
import ProductCard from "@/components/features/products/ProductCard";
import Button from "@/components/Button";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface SearchResultsProps {
  searchQuery: string;
  filters: ProductFilters;
}

export function SearchResults({ searchQuery, filters }: SearchResultsProps) {
  const {
    data: searchResults,
    isLoading,
    isError,
    isFetching,
  } = useSearchQuery({
    search: searchQuery,
    page: filters.page,
    limit: filters.limit,
    sort: filters.sort,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    categories: filters.categories,
    materials: filters.materials,
    colors: filters.colors,
    onSale: filters.onSale,
    inStock: filters.inStock,
    rating: filters.rating,
  });

  const products = searchResults?.data?.items || [];
  const meta = searchResults?.data?.meta;
  const totalResults = meta?.total || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <LoadingSkeleton key={i} type="products" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        <p className="font-medium">Something went wrong while searching.</p>
        <p className="text-sm text-gray-500 mt-2">Please try again later.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 border-dashed bg-gray-50 py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
          <Search size={32} className="text-gray-300" />
        </div>
        <h2 className="mb-2 font-bold text-2xl">No results found</h2>
        <p className="mb-8 max-w-md text-gray-500">
          We couldn&apos;t find any products matching "{searchQuery}". Try different keywords
          or browse our catalog.
        </p>
        <Link href="/product">
          <Button size="lg" className="rounded-full px-8">
            Browse All Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Showing <span className="font-bold">{products.length}</span> of{" "}
          <span className="font-bold">{totalResults}</span> results for{" "}
          <span className="font-bold text-black">"{searchQuery}"</span>
        </p>
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="animate-spin h-4 w-4" />
            Updating results...
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={meta.page <= 1}
            onClick={() => {
              // TODO: Implement pagination via router.push with updated page param
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
            let pageNum;
            if (meta.totalPages <= 5) {
              pageNum = i + 1;
            } else if (meta.page <= 3) {
              pageNum = i + 1;
            } else if (meta.page >= meta.totalPages - 2) {
              pageNum = meta.totalPages - 4 + i;
            } else {
              pageNum = meta.page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => {
                  // TODO: Implement pagination
                }}
                className={`flex h-10 min-w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  pageNum === meta.page
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={pageNum === meta.page ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            type="button"
            disabled={meta.page >= meta.totalPages}
            onClick={() => {
              // TODO: Implement pagination
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchResults;