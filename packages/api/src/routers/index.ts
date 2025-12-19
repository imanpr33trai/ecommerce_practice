import {
  createCallerFactory,
  protectedProcedure,
  publicProcedure,
  router,
} from "../index";
import { cartRouter } from "./cart/cart.route";
import { productRouter } from "./product/product.route";
import { wishRouter } from "./wish/wish.route";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,

  })),

  product: productRouter,
  wish: wishRouter,
  cart: cartRouter
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
