import type { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono-client";

const $getUpdateAddress = client.api.address[":id"].$put;
const $getSetDefault = client.api.address[":id"].default.$put;
const $getDeleteAddress = client.api.address[":id"].$delete;

export type GetAddressListResponse = InferResponseType<typeof client.api.address.$get>;

export type GetAddAddressRequest = InferRequestType<typeof client.api.address.$post>;

export type GetUpdateAddressRequest = InferRequestType<typeof $getUpdateAddress>;

export type GetSetDefaultRequest = InferRequestType<typeof $getSetDefault>;
export type GetSetDefaultResponse = InferResponseType<typeof $getSetDefault>;

export type GetDeleteAddressResponse = InferResponseType<typeof $getDeleteAddress>;
export type GetProfileResponse = InferResponseType<typeof client.api.user.me.$get>;

export type GetUpdateProfileRequest = InferRequestType<typeof client.api.user.me.$put>["json"];
export type GetUpdateProfileResponse = InferResponseType<typeof client.api.user.me.$put>;
