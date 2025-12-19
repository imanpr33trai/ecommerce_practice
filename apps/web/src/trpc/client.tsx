"use client";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext, createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createQueryClient } from "./query-client";
import type { AppRouter } from "@ecomerceNextjs/api/routers/index";
import SuperJSON from "superjson";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

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
      // Add credentials if you're using cookies for auth
      headers() {
        return {
          // Forward cookies for authentication
          ...(typeof window !== "undefined" ? {} : {}),
        };
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
  }>
) {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
