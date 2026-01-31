import {
  mutationOptions,
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { accountKeys } from "@/data/account/keys";
import { client } from "@/lib/hono-client";
import type { GetAddAddressRequest } from "@/data/account/types";

const addAddress = async (json: GetAddAddressRequest["json"]) => {
  const res = await client.address.$post({ json });

  if (!res.ok) {
    throw new Error("Failed to add the addresss");
  }
  return res.json();
};

export const userAddAddressOptions = (utils: QueryClient) => {
  const queryKey = accountKeys.addresslist;
  return mutationOptions({
    mutationFn: (json: GetAddAddressRequest["json"]) => addAddress(json),
    onSuccess: () => {
      toast.success("Address saved successfully");
      utils.invalidateQueries({ queryKey });
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useAddAddressQuery = () => {
  const queryClient = useQueryClient();
  return useMutation(userAddAddressOptions(queryClient));
};
