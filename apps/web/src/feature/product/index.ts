import { useProductQueries } from "./client";
import { productKeys } from "./keys";
import { productOptions } from "./server";
import * as ProductTypes from "./types";

export const Product = {
    types: ProductTypes,
    keys: productKeys,
    //   server: productOptions,
    hooks: useProductQueries,
};

export * from "./types"