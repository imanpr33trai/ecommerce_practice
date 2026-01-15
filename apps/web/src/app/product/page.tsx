

import { ProductContent } from "./_component/product-content";

export default async function ProductsPage() {
  return (
    // <Suspense fallback={<LoadingSkeleton type="products" />}>
      <ProductContent />
    // </Suspense>
  );
}
