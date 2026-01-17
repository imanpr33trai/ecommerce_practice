import { Suspense } from "react";

import LoadingSkeleton from "@/components/LoadingSkeleton";

import { ProductContent } from "./_component/product-content";

export default async function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="products" />}>
      <ProductContent />
    </Suspense>
  );
}
