"use client"
import React from 'react';
import Link  from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/ui/Button';
import { PRODUCTS } from '@/constants';
import { usePathname, useSearchParams } from 'next/navigation';

export default function SearchResultsPage() {
  const location = usePathname();
  const searchParams = useSearchParams();
  searchParams.get(location)
  const query = searchParams.get('q') || '';

  const searchResults = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto animate-slide-up min-h-[80vh]">
      <div className="mb-8 pt-4">
        <h1 className="text-4xl font-light mb-2">Search Results</h1>
        <p className="text-gray-500">
          Found {searchResults.length} results for "<span className="text-black font-medium">{query}</span>"
        </p>
      </div>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Search size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            We couldn't find any products matching "{query}". Try checking for typos or using different keywords.
          </p>
          <Link href="/products">
            <Button size="lg">Browse All Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}