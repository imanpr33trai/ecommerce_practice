import type { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono-client";

const $getUpdateAddress = client.address[":id"].$put;
const $getSetDefault = client.address[":id"].default.$put;
const $getDeleteAddress = client.address[":id"].$delete;

export type GetAddressListResponse = InferResponseType<typeof client.address.$get>;

export type GetAddAddressRequest = InferRequestType<typeof client.address.$post>;

export type GetUpdateAddressRequest = InferRequestType<typeof $getUpdateAddress>;

export type GetSetDefaultRequest = InferRequestType<typeof $getSetDefault>;
export type GetSetDefaultResponse = InferResponseType<typeof $getSetDefault>;

export type GetDeleteAddressResponse = InferResponseType<typeof $getDeleteAddress>;
export type GetProfileResponse = InferResponseType<typeof client.user.me.$get>;

export type GetUpdateProfileRequest = InferRequestType<typeof client.user.me.$put>["json"];
export type GetUpdateProfileResponse = InferResponseType<typeof client.user.me.$put>;
