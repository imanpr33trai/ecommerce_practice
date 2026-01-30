import { z } from "zod";
import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/hono-client";

const $getReviewProductList = client.api.review[":productId"].$get;

const $getReviewProductSummary = client.api.review[":productId"].summary.$get;

const $getReviewUserList = client.api.review.me.$get;

const $getReviewCreate = client.api.review.$post;

// Validation Schema
export const ReviewListSchema = z.object({
  productId: z.string(),
  page: z.number().default(1),
  sort: z.enum(["newest", "highest", "lowest"]).default("newest"),
});

export type ReviewFilters = z.infer<typeof ReviewListSchema>;

export type GetReviewProductListRequest = InferRequestType<typeof $getReviewProductList>;
export type GetReviewProductListResponse = InferResponseType<typeof $getReviewProductList>;

export type GetReviewProductSummaryResponse = InferResponseType<typeof $getReviewProductSummary>;

export type GetReviewProductUserListRequest = InferRequestType<typeof $getReviewUserList>;
export type GetReviewProductUserListResponse = InferResponseType<typeof $getReviewUserList>;

export type GetReviewProductCreateResponse = InferResponseType<typeof $getReviewCreate>;
export type GetReviewProductCreateRequest = InferRequestType<typeof $getReviewCreate>;
