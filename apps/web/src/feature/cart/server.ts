import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/server";

export const cartOptions = {
    get: () => {
        return useQuery(trpc.cart.get.queryOptions());
    },
};
