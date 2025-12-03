import { protectedProcedure, publicProcedure, router } from "../index";
import { cartRouter } from "./cart";
import { CategoryRouter } from "./category";
import { productRouter } from "./product";
import { ReviewRouter } from "./review";
import { todoRouter } from "./todo";
import { wishRouter } from "./wish";


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
	todo: todoRouter,
  product: productRouter,
  wish: wishRouter,
  cart: cartRouter,
  review: ReviewRouter,
  category: CategoryRouter
});
export type AppRouter = typeof appRouter;