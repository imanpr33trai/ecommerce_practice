import type { InferRequestType, InferResponseType } from "hono";

import type { client } from "@/lib/hono-client";

export type GetWishListResponse = InferResponseType<typeof client.api.wish.$get>;

export type GetWishListIDsResponse = InferResponseType<typeof client.api.wish.ids.$get>;
export type GetWishToggleResponse = InferResponseType<typeof client.api.wish.toggle.$post>;
export type GetWishToggleRequest = InferRequestType<typeof client.api.wish.toggle.$post>;
