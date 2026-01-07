import { z } from "zod";

import type { RouterInputs, RouterOutputs } from "@/trpc/client";

// Infer types from backend router outputs
export type OrderListResponse = RouterOutputs["order"]["list"];
export type OrderListItem = OrderListResponse[number]; // Single order in the list

export type OrderDetailResponse = RouterOutputs["order"]["getById"]; // Single order detail

// Infer input types from backend router inputs
export type CreateOrderInput = RouterInputs["order"]["createFromCart"];
export type UpdateOrderStatusInput = RouterInputs["order"]["updateStatus"];
export type UpdateOrderPaymentStatusInput = RouterInputs["order"]["updatePaymentStatus"];
