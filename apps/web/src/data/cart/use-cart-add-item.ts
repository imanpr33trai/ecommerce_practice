import { type QueryClient, useMutation, useQueryClient, mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetCartAddItemRequest } from "./types";
import { client } from "@/lib/hono-client";
import { HTTPException } from "hono/http-exception";
import { cartKeys } from "./keys";


const cartAddItemFn = async(json:GetCartAddItemRequest["json"]) =>{
  const res = await client.api.cart.$post({json})

  if(!res.ok){
    const error = await res.json()

    throw new HTTPException(400,{message:"Failed to add to cart ",cause:error})
  }
  return await res.json()
}


export const cartAddItemOptions = (json:GetCartAddItemRequest["json"]) => {
   const queryClient = useQueryClient();


  return mutationOptions({
  mutationFn:()=>cartAddItemFn(json),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:cartKeys.userCart() });
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

export const useCartAddItemMutation = (json:GetCartAddItemRequest["json"]) => {

  return useMutation(cartAddItemOptions(json));
};
