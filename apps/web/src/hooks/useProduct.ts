import { trpc } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useProduct = {
  allProducts: () => {
    const all = trpc.product.getLandingProducts.queryOptions({});
    return useQuery(all);
  },

  newDeals: () => {
    return useQuery(
      trpc.product.getLandingProducts.queryOptions({
        limit: 4,
        isNew: true,
      }),
    );
  },

  exclusiveDeals: () => {
    return useQuery(
      trpc.product.getLandingProducts.queryOptions({
        limit: 4,
        isExclusive: true,
      }),
    );
  },

  greatValue: () => {
    return useQuery(
      trpc.product.getLandingProducts.queryOptions({
        limit: 8,
        isGreatValue: true,
      }),
    );
  },
};
