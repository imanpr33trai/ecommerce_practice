import { Suspense } from "react";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { SearchClient } from "./_component/SearchClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="products" />}>
      <SearchClient />
    </Suspense>
  );
}