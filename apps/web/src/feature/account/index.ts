import { useAccountMutations, useAccountQueries } from "./client";
import { accountKeys } from "./keys";

export const Account = {
  keys: accountKeys,
  hooks: {
    ...useAccountQueries,
    ...useAccountMutations,
  },
};
