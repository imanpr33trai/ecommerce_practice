import { useWishMutations, useWishQueries } from "./client";
import { wishKeys } from "./keys";
import * as WishTypes from "./types";

export const Wish = {
  types: WishTypes,
  keys: wishKeys,

  hooks: {
    ...useWishQueries,
    ...useWishMutations,
  },
};
