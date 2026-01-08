import { Suspense } from "react";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { productLandingOptions } from "@/data/product";
import { getCaller, HydrateClient, prefetch, trpc } from "@/trpc/server";

import LandingPage from "./LandingPage";

export default async function Page() {
  await prefetch(trpc.product.getLandingProducts.queryOptions({ limit: 20 }));

  return (
    <HydrateClient>
      <Suspense fallback={<LoadingSkeleton type="home" />}>
        <LandingPage />
      </Suspense>
    </HydrateClient>
  );
}
