import {
  INITIAL_PRODUCT_FILTERS,
  ProductFilterSchema,
} from "@ecomerceNextjs/api/routers/product/product.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

import type { ProductFilters } from "../../data/product/types";

export const useProductQueries = {
  // Helper to get fresh default filters
  getInitialFilters: () => ProductFilterSchema.parse({}),
};
