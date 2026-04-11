import { prisma } from "@ecomerceNextjs/db";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { HonoEnv } from "../../context.js"; // Adjust path to your context

import { ConflictError, ForbiddenError } from "../../utils/errors.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { reviewQueries } from "./review.query.js";
import { CreateReviewSchema, ReviewQuerySchema, UserReviewQuerySchema } from "./review.type.js";

export const review = new Hono<HonoEnv>()

  /**
   * GET /:productId
   * List reviews for a specific product with pagination/sorting
   */
  .get("/:productId", zValidator("query", ReviewQuerySchema), async (c) => {
    const productId = c.req.param("productId");
    const options = c.req.valid("query");

    const result = await reviewQueries.listByProduct(productId, options);

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

    const result = await reviewQueries.getSummary(productId);

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

    const totalCount = await prisma.review.count();

    const result = await reviewQueries.listByUser(user.id, options);
    return c.json({ success: true, data: result, count: totalCount, userId: user.id });
  })

  /**
   * POST /
   * Create a new review
   */
  .post("/", zValidator("json", CreateReviewSchema), async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");

    try {
      const result = await reviewQueries.create(user.id, input);
      return c.json({ success: true, data: result });
    } catch (error) {
      throw new ConflictError(error instanceof Error ? error.message : "Failed to create review");
    }
  })

  /**
   * DELETE /:id
   * Delete a specific review
   */
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const reviewId = c.req.param("id");

    try {
      await reviewQueries.delete(user.id, reviewId);
      return c.json({ success: true, message: "Review deleted" });
    } catch (error) {
      throw new ForbiddenError(error instanceof Error ? error.message : "Failed to delete review");
    }
  });
