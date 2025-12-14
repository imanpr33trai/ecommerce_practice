import {
  createCallerFactory,
  protectedProcedure,
  publicProcedure,
  router,
} from "../index";
import { ProductRouter } from "./product.route";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),

  product: ProductRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
