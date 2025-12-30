import { initTRPC, TRPCError } from "@trpc/server";
import { SuperJSON } from "superjson";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  isDev: true,
});

export const createCallerFactory = t.createCallerFactory;

// 2. create a caller using your `Context`
export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // const isDev = process.env.NODE_ENV === "development";
  //     const bypass = process.env.TRPC_BYPASS_AUTH === true;

  // // ✅ DEV BYPASS
  // if (isDev && bypass && !ctx.session) {
  //   return next({
  //     ctx: {
  //       ...ctx,
  //       user: {
  //         id: "C6MpMPLWZ7jhzbhmee4V0SV7rPttJL7X",
  //         email: "manpreet.singh01356@gmail.com",
  //         name: "sdfsdf",
  //       },
  //     },
  //   });
  // }
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication require",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
