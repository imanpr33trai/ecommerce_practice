import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@ecomerceNextjs/auth"; // Server-side auth check
import { dehydrate, HydrationBoundary, useQueryClient } from "@tanstack/react-query";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { userProfileOptions } from "@/data/account/use-user-profile";

import { AccountContent } from "./_components/account-content"; // Client Logic moved here

interface PageProps {
  params: Promise<{ slug?: string[] }>; // Optional array: ['orders'] or undefined
}

export default async function AccountPage({ params }: PageProps) {
  const queryClient = useQueryClient();
  // 1. Server-Side Auth Check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/log-in");
  }

  // 2. Prefetch Profile Data
  queryClient.prefetchQuery(userProfileOptions());
  const { slug } = await params;

  // 3. Determine Active Tab (e.g. "orders", "addresses")
  const activeTab = slug?.[0] || "overview";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingSkeleton type="account" />}>
        <AccountContent
          activeTab={activeTab}
          user={session.user}
        />
      </Suspense>
    </HydrationBoundary>
  );
}
