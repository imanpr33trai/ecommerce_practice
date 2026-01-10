import { client } from "@/lib/hono-client";
import { InferRequestType, InferResponseType } from "hono";


const $getCartList= client.api.cart.$get
const $getCartAddItem = client.api.cart.$post
// 1. The Full Cart Output (includes subtotal, totalItems, items array)
export type GetCartUserListResponse = InferResponseType<typeof $getCartList>

// 2. A Single Cart Item
// We use NonNullable because 'cart.get' can return null if empty
export type GetCartItemResponse = NonNullable<GetCartUserListResponse>["data"]["items"][number];

export type GetCartAddItemRequest = InferRequestType<typeof $getCartAddItem>
