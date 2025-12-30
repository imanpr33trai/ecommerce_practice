import { useOrderMutations, useOrderQueries } from "./client";
import { orderKeys } from "./keys";
import * as OrderTypes from "./type";

export const Order = {
  types: OrderTypes,
  keys: orderKeys,
  hooks: {
    ...useOrderQueries,
    ...useOrderMutations,
  },
};
