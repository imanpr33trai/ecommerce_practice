export const dynamic = "force-dynamic";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { productLandingOptions } from "@/data/product";
import { createQueryClient } from "@/lib/query-client";

import LandingPage from "./LandingPage";

export default async function Page() {
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(productLandingOptions({ limit: "20", page: "1" }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingSkeleton type="home" />}>
        <LandingPage />
      </Suspense>
    </HydrationBoundary>
  );
}
