import {
  mutationOptions,
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { GetUpdateAddressRequest } from "@/data/account/types";

import { accountKeys } from "@/data/account/keys";
import { client } from "@/lib/hono-client";

const updateAdd = async ({ id, json }: { id: string; json: GetUpdateAddressRequest["json"] }) => {
  const res = await client.address[":id"].$put({
    param: { id },
    json,
  });

  const result = await res.json();
  if (!res.ok || result.success === false) {
    if ("error" in result) {
      const errMsg = result.error || "Failed to update address";
      throw new Error(errMsg);
    }
  }
  return result.data;
};

export const userUpdateAddressOptions = (utils: QueryClient) => {
  return mutationOptions({
    mutationFn: ({ id, json }: { id: string; json: GetUpdateAddressRequest["json"] }) =>
      updateAdd({ id, json }),
    onSuccess: () => {
      toast.success("Address updated");
      utils.invalidateQueries({ queryKey: accountKeys.addresslist });
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useAddressUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(userUpdateAddressOptions(queryClient));
};
