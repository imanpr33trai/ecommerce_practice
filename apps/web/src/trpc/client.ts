"use client";

import type { AppRouter } from "@ecomerceNextjs/api/routers/index";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import {
  createTRPCContext,
  createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import { toast } from "sonner";
import superjson from "superjson";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

// // ^-- to make sure we can mount the Provider from a server component
// import type { AppRouter } from "@ecomerceNextjs/api/routers/index";
// import type { QueryClient } from "@tanstack/react-query";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { createTRPCClient, httpBatchLink } from "@trpc/client";
// import { createTRPCContext } from "@trpc/tanstack-react-query";
// import { useState } from "react";
// import SuperJSON from "superjson";
// import { makeQueryClient } from "./query-client";
// export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
// let browserQueryClient: QueryClient;
// function getQueryClient() {
//   if (typeof window === "undefined") {
//     // Server: always make a new query client
//     return makeQueryClient();
//   }
//   // Browser: make a new query client if we don't already have one
//   // This is very important, so we don't re-make a new client if React
//   // suspends during the initial render. This may not be needed if we
//   // have a suspense boundary BELOW the creation of the query client
//   if (!browserQueryClient) browserQueryClient = makeQueryClient();
//   return browserQueryClient;
// }
// function getUrl() {
//   const base = (() => {
//     if (typeof window !== "undefined") return "";
//     if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
//     return "http://localhost:3000";
//   })();
//   return `${base}/api/trpc`;
// }
// export function TRPCReactProvider(
//   props: Readonly<{
//     children: React.ReactNode;
//   }>
// ) {
//   // NOTE: Avoid useState when initializing the query client if you don't
//   //       have a suspense boundary between this and the code that may
//   //       suspend because React will throw away the client on the initial
//   //       render if it suspends and there is no boundary
//   const queryClient = getQueryClient();
//   const [trpcClient] = useState(() =>
//     createTRPCClient<AppRouter>({
//       links: [
//         httpBatchLink({
//           transformer: SuperJSON, //<-- if you use a data transformer
//           url: getUrl(),
//         }),
//       ],
//     })
//   );
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
//         {props.children}
//       </TRPCProvider>
//     </QueryClientProvider>
//   );
// }

// // import type { AppRouter } from "@ecomerceNextjs/api/routers/index";
// // import { QueryCache, QueryClient } from "@tanstack/react-query";
// // import { createTRPCClient, httpBatchLink } from "@trpc/client";

// // import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
// // import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
// // import { toast } from "sonner";
// // import superjson from "superjson";

// // // 2. Export Helper Types (Optional but highly recommended)
// // // Use these to infer types for your component props
// // export type RouterInputs = inferRouterInputs<AppRouter>;
// // export type RouterOutputs = inferRouterOutputs<AppRouter>;

// // export const queryClient = new QueryClient({
// //   queryCache: new QueryCache({
// //     onError: (error) => {
// //       toast.error(error.message, {
// //         action: {
// //           label: "retry",
// //           onClick: () => {
// //             queryClient.invalidateQueries();
// //           },
// //         },
// //       });
// //     },
// //   }),
// // });

// // export const trpcClient = createTRPCClient<AppRouter>({
// //   links: [
// //     httpBatchLink({
// //       transformer: superjson,
// //       url: `${process.env.NEXT_PUBLIC_SERVER_URL}/trpc`,
// //       fetch(url, options) {
// //         return fetch(url, {
// //           ...options,
// //           credentials: "include",
// //         });
// //       },
// //     }),
// //   ],
// // });

// // export const trpc = createTRPCOptionsProxy<AppRouter>({
// //   client: trpcClient,
// //   queryClient,
// // });
