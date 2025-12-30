import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@ecomerceNextjs/auth"; // Server-side auth check

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
      <AccountContent
        activeTab={activeTab}
        user={session.user}
      />
    </HydrateClient>
  );
}
