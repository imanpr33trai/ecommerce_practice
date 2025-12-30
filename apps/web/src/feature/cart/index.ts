import { useCartMutations, useCartQueries } from "./client";
import { cartKeys } from "./keys";
import { cartOptions } from "./server";
import * as CartTypes from "./types";

export const Cart = {
  types: CartTypes,
  keys: cartKeys,
  // server: cartOptions,
  hooks: {
    ...useCartQueries,
    ...useCartMutations,
  },
};
