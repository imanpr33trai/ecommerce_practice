import { z } from "zod";
import type { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono-client";

const $getReviewProductListReq = client.api.review[":productId"].$get;
const $getReviewProductListRes = client.api.review[":productId"].$get;
// Validation Schema
export const ReviewListSchema = z.object({
  productId: z.string(),
  page: z.number().default(1),
  sort: z.enum(["newest", "highest", "lowest"]).default("newest"),
});

export type ReviewFilters = z.infer<typeof ReviewListSchema>;

export type GetReviewProductListRequest = InferRequestType<typeof $getReviewProductListReq>;
export type GetReviewProductListResponse = InferResponseType<typeof $getReviewProductListRes>;

// Return Types
export type ReviewItem = RouterOutputs["review"]["listByProduct"]["items"][number];
export type ReviewSummary = RouterOutputs["review"]["getSummary"];
export type ReviewProductListInput = RouterInputs["review"]["listByProduct"];
