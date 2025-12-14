// import "server-only";

// import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
// import { headers } from "next/headers";
// import { cache } from "react";

// // Imports from your monorepo
// import { appRouter } from "@ecomerceNextjs/api/routers/index";
// import { auth } from "@ecomerceNextjs/auth"; // Your Better-Auth instance
// import { makeQueryClient } from "./query-client";

// // 1. Create a stable getter for the Query Client
// export const getQueryClient = cache(makeQueryClient);

// /**
//  * 2. Create the Context for Next.js (RSC)
//  *
//  * CRITICAL: This is different from your Hono context!
//  * Hono uses `c.req.raw.headers`. Next.js uses `next/headers`.
//  * But they both return the same shape: { session }
//  */
// const createContext = cache(async () => {
//   const heads = new Headers(await headers());

//   // Use Better Auth's API to get the session using standard Web Headers
//   const session = await auth.api.getSession({
//     headers: heads,
//   });

//   return {
//     session,
//     // Add other context items here if your router needs them (e.g. db)
//   };
// });

// // 3. The tRPC Proxy (For Prefetching & Hydration)
// export const trpc = createTRPCOptionsProxy({
//   router: appRouter,
//   ctx: createContext,
//   queryClient: getQueryClient,
// });

// // 4. The Direct Caller (For direct server data access without hydration)
// // This is useful if you just want to await data in a server component
// // and pass it as props, without using React Query's cache on the client.
// export const api = appRouter.createCaller(await createContext);
