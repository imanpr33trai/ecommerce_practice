import {
    mutationOptions,
    type QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
import { toast } from "sonner";

import { client } from "@/lib/hono-client";

import { cartKeys } from "./keys";
import type { GetCartAddItemRequest } from "./types";

const cartAddItemFn = async (json: GetCartAddItemRequest["json"]) => {
  const res = await client.cart.$post({ json });

  if (!res.ok) {
    const error = await res.json();

    throw new HTTPException(400, { message: "Failed to add to cart ", cause: error });
  }
  return await res.json();
};

export const cartAddItemOptions = (queryClient: QueryClient) => {
  return mutationOptions({
    mutationFn: (json: GetCartAddItemRequest["json"]) => cartAddItemFn(json),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.userCart() });
      toast.success("Added to cart");
    },
    onError: (err) => {
      console.log(err.message);
      // Handle "Stock Limit" error specifically
      if (err.stack === "CONFLICT") {
        toast.error(err.message); // e.g., "Only 5 items remaining"
      } else {
        toast.error("Failed to add to cart");
      }
    },
  });
};

export const useCartAddItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(cartAddItemOptions(queryClient));
};
