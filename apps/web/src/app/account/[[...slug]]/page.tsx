// app/account/[[...slug]]/page.tsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// import { auth } from "@ecomerceNextjs/auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { createQueryClient } from "@/lib/query-client";

// import { auth } from "../../../../../../packages/auth/src/index";
import { AccountContent } from "./_components/account-content";
import { authClient } from "@/lib/auth-client";

interface PageProps {
  params: Promise<{ slug?: string[] }>; // Note the optional '?' as slug can be undefined
}

export default async function AccountPage({ params }: PageProps) {
  // Await params as required in modern Next.js
  // params.slug is string[] | undefined for [[...slug]]
  const { slug } = await params;

  // Ensure activeTab is strictly a string
  const activeTab: string = slug?.[0] ?? "overview";

  const queryClient = createQueryClient();

  // 1. Server-Side Auth Check
  const session = await authClient.getSession({});

  if (!session.data) {
    redirect("/log-in");
  }

  // 2. Prefetch Profile Data
  // queryClient.prefetchQuery(userProfileOptions());

  // 3. Determine Active Tab
  // Safely check if slug exists and has at least one element

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingSkeleton type="account" />}>
        <AccountContent
          activeTab={activeTab}
          user={session.data.user}
        />
      </Suspense>
    </HydrationBoundary>
  );
}
