import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import LandingClient from "./landing-client";

export default async function HomePage() {
  await prefetch(trpc.product.getLandingProducts.queryOptions({ limit: 20 }));

  return (
    <HydrateClient>
      <LandingClient />
    </HydrateClient>
  );
}
