"use client";

import type React from "react";

import { ProductCard } from "./ProductCard";
import type { ProductSingleResponse } from "@/data/product";

interface ProductGridProps {
  products: ProductSingleResponse[];
  className?: string;
}

export function ProductGrid({ products, className = "" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-gray-500">
        <p className="text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
      role="list"
      aria-label="Products"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGrid;