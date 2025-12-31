import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

// Check imports match your package names exactly
import { appRouter } from "@ecomerceNextjs/api/routers/index";
import { auth } from "@ecomerceNextjs/auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCOptionsProxy, type TRPCQueryOptions } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import { createQueryClient } from "./query-client";

export const getQueryClient = cache(createQueryClient);

// Create server context that matches your API's context structure
async function createServerContext() {
  // Extract headers to pass to Better Auth
  const heads = await headers();

  const session = await auth.api.getSession({
    headers: heads,
  });

  return {
    session,
    // Add other context items if your API needs them (e.g., db)
  };
}

// FIX: Helper to get the correct URL for Server-to-Server communication
function getUrl() {
  // 1. Production (Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/trpc`;
  }
  // 2. Custom Environment Variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/trpc`;
  }
  // 3. Local Development Fallback
  // MUST point to Port 3001 (Hono) not 3000 (Next.js)
  return "http://localhost:3001/trpc";
}

// HTTP client for server-side tRPC calls (Prefetching)
const serverClient = createTRPCClient<typeof appRouter>({
  links: [
    httpLink({
      transformer: SuperJSON,
      url: getUrl(),
      headers: async () => {
        const h = await headers();
        const cookie = h.get("cookie") || "";

        return {
          cookie,
          "x-trpc-source": "rsc", // Useful for debugging
          // Forwarding these helps Auth logic work correctly
          "x-forwarded-for": h.get("x-forwarded-for") || "",
          "x-forwarded-proto": h.get("x-forwarded-proto") || "",
          "x-forwarded-host": h.get("x-forwarded-host") || "",
        };
      },
    }),
  ],
});

// Proxy for prefetching (uses the HTTP client above)
export const trpc = createTRPCOptionsProxy({
  client: serverClient,
  queryClient: getQueryClient,
});

// Direct Caller (Optional: For fetching data without Hydration)
export const getCaller = cache(async () => {
  const context = await createServerContext();
  return appRouter.createCaller(context);
});

// Component to Hydrate State to Client
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}

// Helper to prefetch queries easily
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
