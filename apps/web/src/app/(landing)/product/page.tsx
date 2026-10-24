import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductListingClient } from "./ProductListingClient";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { prefetchProducts } from "@/hooks/queries/useProductsQuery";

export const metadata: Metadata = {
  title: "Shop - All Products",
  description: "Browse our complete collection of products",
};

async function getInitialProducts() {
  try {
    const data = await prefetchProducts({ page: 1, limit: 12 });
    return data;
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
    return null;
  }
}

export default async function ProductListingPage() {
  // Prefetch initial data on the server
  const initialData = await getInitialProducts();

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<LoadingSkeleton type="products" />}>
        <ProductListingClient initialData={initialData} />
      </Suspense>
    </div>
  );
}
