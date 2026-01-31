import type { InferRequestType, InferResponseType } from "hono";

import type { client } from "@/lib/hono-client";

export type GetOrderSingleRespose = InferResponseType<(typeof client.order)[":id"]["$get"]>;

export type GetCreateOrderRequest = InferRequestType<typeof client.order.$post>["json"];
export type GetCreateOrderResponse = InferResponseType<typeof client.order.$post>;

export type GetListOrdersResponse = InferResponseType<typeof client.order.$get>;
