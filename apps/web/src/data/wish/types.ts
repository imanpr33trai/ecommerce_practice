import type { RouterOutputs } from "@/trpc/client";

// 1. The Full Wishlist (for the page)
export type WishlistOutput = RouterOutputs["wish"]["getAll"];
export type WishlistItem = WishlistOutput[number];

// 2. The IDs (for the heart icons)
export type WishlistIds = RouterOutputs["wish"]["getIds"];
