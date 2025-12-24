// web/src/trpc/client.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext, createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";
import type { AppRouter } from "@ecomerceNextjs/api/routers/index";
import type { QueryClient } from "@tanstack/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createQueryClient } from "./query-client";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") {
      // Client-side: point to API server
      return "http://localhost:3000";
    }
    // Server-side: point to API server
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    // In development, point to your API server (port 3000)
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  })();
  return `${base}/trpc`;
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: getUrl(),

      // CRITICAL: Include credentials to send cookies
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include", // This sends cookies with the request
        });
      },

      // Headers for authentication
      headers() {
        const headers: Record<string, string> = {};

        // Client-side: cookies are automatically included with credentials: "include"
        // Server-side: headers are handled differently (not needed here since we're client-only)

        return headers;
      },
    }),
  ],
});

const queryClient = getQueryClient();

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
