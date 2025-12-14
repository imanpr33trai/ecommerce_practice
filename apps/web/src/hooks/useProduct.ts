import { trpc } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useProduct = {
  allProducts: () => {
    const all = trpc.product.getAll.queryOptions();
    return useQuery(all);
  },
};
