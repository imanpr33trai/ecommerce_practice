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
  // 1. Type Guard: Use early return for cleaner logic
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action.",
      // Using 'cause' is good for internal logging, keep it
      cause: "No active session found in context",
    });
  }

  // 2. Type Narrowing: Re-return context with guaranteed session
  // This tells TypeScript that 'ctx.session' is definitely NOT null below this point
  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        user: ctx.session.user, // Explicitly pass the user for better intellisense
      },
    },
  });
});
