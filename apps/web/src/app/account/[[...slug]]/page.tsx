import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@ecomerceNextjs/auth"; // Server-side auth check

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { AccountContent } from "./_components/account-content"; // Client Logic moved here

interface PageProps {
  params: Promise<{ slug?: string[] }>; // Optional array: ['orders'] or undefined
}

export default async function AccountPage({ params }: PageProps) {
  // 1. Server-Side Auth Check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/log-in");
  }

  // 2. Prefetch Profile Data
  prefetch(
    trpc.user.getProfile.queryOptions(undefined, {
      staleTime: 1000 * 60 * 5,
    }),
  );
  const { slug } = await params;

  // 3. Determine Active Tab (e.g. "orders", "addresses")
  const activeTab = slug?.[0] || "overview";

  return (
    <HydrateClient>
      <Suspense fallback={<LoadingSkeleton type="account" />}>
        <AccountContent
          activeTab={activeTab}
          user={session.user}
        />
      </Suspense>
    </HydrateClient>
  );
}
