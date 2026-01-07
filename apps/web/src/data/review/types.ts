import { z } from "zod";

import type { RouterInputs, RouterOutputs } from "@/trpc/client"; // Adjust to your API client path

// Validation Schema
export const ReviewListSchema = z.object({
  productId: z.string(),
  page: z.number().default(1),
  sort: z.enum(["newest", "highest", "lowest"]).default("newest"),
});

export type ReviewFilters = z.infer<typeof ReviewListSchema>;

// Return Types
export type ReviewItem = RouterOutputs["review"]["listByProduct"]["items"][number];
export type ReviewSummary = RouterOutputs["review"]["getSummary"];
export type ReviewProductListInput = RouterInputs["review"]["listByProduct"];
