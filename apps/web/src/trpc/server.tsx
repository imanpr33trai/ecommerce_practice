// web/src/trpc/server.tsx
import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { appRouter } from "@ecomerceNextjs/api/routers/index";
import { auth } from "@ecomerceNextjs/auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCOptionsProxy, type TRPCQueryOptions } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import { createQueryClient } from "./query-client";

export const getQueryClient = cache(createQueryClient);

/**
 * 1. Define the context creator.
 * This is used for direct router calls to ensure the server component
 * has the same session/header info as your Hono backend.
 */
async function createServerContext() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    session,
    headers: await headers(), // Include headers if your router needs them
  };
}

// For server-side calls that go through HTTP
function getUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/trpc`;
  }
  return process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/trpc`
    : "http://localhost:3000/trpc";
}

// HTTP client for server-side tRPC calls
const serverClient = createTRPCClient<typeof appRouter>({
  links: [
    httpLink({
      transformer: SuperJSON,
      url: getUrl(),
      headers: async () => {
        const h = await headers();

        // Get all cookies and forward them
        const cookie = h.get("cookie") || "";

        return {
          cookie,
          // Forward all relevant headers
          "x-forwarded-for": h.get("x-forwarded-for") || "",
          "x-forwarded-proto": h.get("x-forwarded-proto") || "",
          "x-forwarded-host": h.get("x-forwarded-host") || "",
        };
      },
      // Important: Include credentials for authentication
      fetch: async (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include", // Include cookies
        });
      },
    }),
  ],
});

// Use the HTTP client for server-side operations
// 1. Define your direct proxy (THIS IS WHAT YOU SHOULD USE)
export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  ctx: createServerContext, // Direct context creation, no HTTP needed
  queryClient: getQueryClient,
});
// export const trpc = createTRPCOptionsProxy({
//   client: serverClient,
//   queryClient: getQueryClient,
// });

// Create caller with context (for direct server-side calls)
// This is the RECOMMENDED way for server components
export const getCaller = cache(async () => {
  const context = await createServerContext();

  // Debug: log session info
  if (process.env.NODE_ENV === "development") {
    console.log(
      "Server Caller - Session:",
      context.session ? "✅ Authenticated" : "❌ Not authenticated",
    );
  }

  return appRouter.createCaller(context);
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}

// Generic prefetch helper using query client
export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  try {
    if (queryOptions.queryKey[1]?.type === "infinite") {
      await queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
      await queryClient.prefetchQuery(queryOptions);
    }
  } catch (e) {
    console.error("Prefetch failed ", e);
  }
}
