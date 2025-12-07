import { protectedProcedure, publicProcedure, router } from "../index";
import { addressRouter } from "./address.route";
import { cartRouter } from "./cart.route";
import { categoryRouter } from "./category.route";
import { orderRouter } from "./order.route";
import { productRouter } from "./product.route";
import { userRouter } from "./user.route";
import { wishRouter } from "./wish.route";

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

	product: productRouter,
	category: categoryRouter,
	address: addressRouter,
	user: userRouter,
	wish: wishRouter,
	order: orderRouter,
	cart: cartRouter,
});
export type AppRouter = typeof appRouter;
