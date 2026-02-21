import type { InferRequestType, InferResponseType } from "hono";

import type { client } from "@/lib/hono-client";

export type GetWishListResponse = InferResponseType<typeof client.wish.$get>;

export type GetWishListIDsResponse = InferResponseType<typeof client.wish.ids.$get>;
export type GetWishToggleResponse = InferResponseType<typeof client.wish.toggle.$post>;
export type GetWishToggleRequest = InferRequestType<typeof client.wish.toggle.$post>;
