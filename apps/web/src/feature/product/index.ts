import * as ProductTypes from "./types";
import { productKeys } from "./keys";
import { productOptions } from "./server";
import { useProductQueries } from "./client";

// Export individual parts if needed
export * from "./types";

// Export the Feature Namespace
export const Product = {
    types: ProductTypes,
    keys: productKeys,
    //   options: productOptions,
    hooks: useProductQueries,
    // mutations: ... (Add admin mutations here later)
};