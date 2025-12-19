// web/src/trpc/server.tsx
import "server-only";
import { createTRPCOptionsProxy, type TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createQueryClient } from "./query-client";
import { appRouter } from "@ecomerceNextjs/api/routers/index";
import { headers } from "next/headers";
import { auth } from "@ecomerceNextjs/auth";
import { createTRPCClient, httpLink } from "@trpc/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import SuperJSON from "superjson";

export const getQueryClient = cache(createQueryClient);

async function createServerContext() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return { session };
}

// For server-side calls that go through HTTP
function getUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/trpc`;
  }
  return process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/trpc` : "http://localhost:3000/trpc";
}

const serverClient = createTRPCClient<typeof appRouter>({
  links: [
    httpLink({
      transformer: SuperJSON,
      url: getUrl(),
      headers: async () => {
        const h = await headers();
        return {
          cookie: h.get("cookie") || "",
        };
      },
    }),
  ],
});

// Use the HTTP client for server-side operations
export const trpc = createTRPCOptionsProxy({
  client: serverClient,
  queryClient: getQueryClient,
});

// Create caller with context (for direct server-side calls without HTTP)
export const getCaller = cache(async () => {
  const context = await createServerContext();
  return appRouter.createCaller(context);
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}

// Generic prefetch helper using query client
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
