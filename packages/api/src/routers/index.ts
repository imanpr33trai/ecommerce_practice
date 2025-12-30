import { router } from "../index";
import { addressRouter } from "./address/address.route";
import { cartRouter } from "./cart/cart.route";
import { orderRouter } from "./order/order.route";
import { productRouter } from "./product/product.route";
import { userRouter } from "./user/user.route";
import { wishRouter } from "./wish/wish.route";

export const appRouter = router({
  // healthCheck: publicProcedure.query(() => "OK"),
  // privateData: protectedProcedure.query(({ ctx }) => ({
  //   message: "This is private",
  //   user: ctx.session.user,
  // })),

  product: productRouter,
  wish: wishRouter,
  cart: cartRouter,
  user: userRouter,
  address: addressRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
