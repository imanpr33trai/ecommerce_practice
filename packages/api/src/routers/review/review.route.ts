import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { ReviewService } from "../../services/ReviewService";
import { CreateReviewSchema, ReviewQuerySchema, UserReviewQuerySchema } from "@ecommerceNextjs/types";
import type { HonoEnv } from "../../context.js";

export const review = new Hono<HonoEnv>()

  /**
   * GET /:productId
   * List reviews for a specific product with pagination/sorting
   */
  .get("/:productId", zValidator("query", ReviewQuerySchema), async (c) => {
    const productId = c.req.param("productId");
    const options = c.req.valid("query");
    const reviewService = c.get("reviewService") as ReviewService;

    const result = await reviewService.listByProduct(productId, options);

    return c.json({
      success: true,
      data: result,
    });
  })

  /**
   * GET /:productId/summary
   * Get rating stats (Average, Distribution)
   */
  .get("/:productId/summary", async (c) => {
    const productId = c.req.param("productId");
    const reviewService = c.get("reviewService") as ReviewService;

    const result = await reviewService.getSummary(productId);

    return c.json({
      success: true,
      data: result,
    });
  })

  /**
   * Middleware: Auth Guard for Mutation/User Routes
   */
  .use(authMiddleware)

  /**
   * GET /me
   * List the current logged-in user's reviews
   */
  .get("/me", zValidator("query", UserReviewQuerySchema), async (c) => {
    const user = c.get("user");
    const options = c.req.valid("query");
    const reviewService = c.get("reviewService") as ReviewService;

    const result = await reviewService.listByUser(user.id, options);
    return c.json({ success: true, data: result, userId: user.id });
  })

  /**
   * POST /
   * Create a new review
   */
  .post("/", zValidator("json", CreateReviewSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");
    const reviewService = c.get("reviewService") as ReviewService;

    const result = await reviewService.create(user.id, input);
    return c.json({ success: true, data: result });
  })

  /**
   * DELETE /:id
   * Delete a specific review
   */
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const reviewId = c.req.param("id");
    const reviewService = c.get("reviewService") as ReviewService;

    await reviewService.delete(user.id, reviewId);
    return c.json({ success: true, message: "Review deleted" });
  });
