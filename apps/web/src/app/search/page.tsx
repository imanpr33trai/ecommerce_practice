import { Suspense } from "react";

import LoadingSkeleton from "@/components/LoadingSkeleton";

import { SearchContent } from "./_component/search-content";

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="products" />}>
      <SearchContent />
    </Suspense>
  );
}