// types.ts or server.ts
import { auth } from "@ecomerceNextjs/auth";

export type HonoEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export type CreateContextOptions = {
  req: Request;
  // Pre-fetched session from Hono middleware
  session?: typeof auth.$Infer.Session | null;
};

export async function createContext({ req, session: prefetchedSession }: CreateContextOptions) {
  // Use prefetched session if available, otherwise fetch it manually
  // (Manual fetch is used when called from Next.js Server Components)
  const session = prefetchedSession !== undefined
    ? prefetchedSession
    : await auth.api.getSession({ headers: req.headers });

  return {
    session,
    headers: req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;




// import { auth } from "@ecomerceNextjs/auth";
// import type { Context as HonoContext } from "hono";

// export type CreateContextOptions = {
//   context: HonoContext;
// };

// /**
//  * Inner function for `createContext` where we create the context.
//  * This is useful for testing when we don't want to mock Next.js' request/response
//  */

// export async function createContext({ context }: CreateContextOptions) {
//   const session = await auth.api.getSession({
//     headers: context.req.raw.headers,
//   });

//   return {
//     session,
//   };
// }

// export type Context = Awaited<ReturnType<typeof createContext>>;
