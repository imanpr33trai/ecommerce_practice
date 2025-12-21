import type { RouterOutputs } from "@/trpc/client";

// 1. The Full Cart Output (includes subtotal, totalItems, items array)
export type CartOutput = RouterOutputs["cart"]["get"];

// 2. A Single Cart Item
// We use NonNullable because 'cart.get' can return null if empty
export type CartItem = NonNullable<CartOutput>["items"][number];