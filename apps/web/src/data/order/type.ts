import type { InferRequestType, InferResponseType } from "hono";

import type { client } from "@/lib/hono-client";

export type GetOrderSingleRespose = InferResponseType<(typeof client.api.order)[":id"]["$get"]>;

export type GetCreateOrderRequest = InferRequestType<typeof client.api.order.$post>["json"];
export type GetCreateOrderResponse = InferResponseType<typeof client.api.order.$post>;

export type GetListOrdersResponse = InferResponseType<typeof client.api.order.$get>;
