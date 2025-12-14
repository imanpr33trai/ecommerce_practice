import { CreateContextOptions } from "@ecomerceNextjs/api/context";
import { appRouter } from "@ecomerceNextjs/api/routers/index";
import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import "server-only"; // <-- ensure this file cannot be imported from the client
import { makeQueryClient } from "./query-client";
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: ,
  router: appRouter,
  queryClient: getQueryClient,
});
// If your router is on a separate server, pass a client:
createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: "..." })],
  }),
  queryClient: getQueryClient,
});
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import { TRPCQueryOptions } from "@trpc/tanstack-react-query";
// import { makeQueryClient } from "./query-client";
// // export function prefetch<
// //   T extends ReturnType<typeof trpc.category.getBySlug.queryOptions>
// // >(queryOptions: T) {
// //   const queryClient = makeQueryClient();

// //   // Handle Infinite Queries vs Standard Queries
// //   if (queryOptions.queryKey[1]?.type === "infinite") {
// //     void queryClient.prefetchInfiniteQuery(queryOptions as any);
// //   } else {
// //     void queryClient.prefetchQuery(queryOptions);
// //   }
// // }

// export function HydrateClient(props: { children: React.ReactNode }) {
//   const queryClient = makeQueryClient();
//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       {props.children}
//     </HydrationBoundary>
//   );
// }
// export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
//   queryOptions: T
// ) {
//   const queryClient = makeQueryClient();
//   if (queryOptions.queryKey[1]?.type === "infinite") {
//     void queryClient.prefetchInfiniteQuery(queryOptions as any);
//   } else {
//     void queryClient.prefetchQuery(queryOptions);
//   }
// }
