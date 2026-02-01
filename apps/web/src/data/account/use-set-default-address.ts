import {
  mutationOptions,
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { accountKeys } from "@/data/account/keys";
import { client } from "@/lib/hono-client";
import type { GetSetDefaultResponse } from "@/data/account/types";

const setDefaultAddressFn = async ({ id }: { id: string }) => {
  const res = await client.address[":id"].default.$put({
    param: { id },
  });
  const result = (await res.json()) as GetSetDefaultResponse;

  if (!res.ok || result.success === false) {
    if ("error" in result) {
      const errMsg = result.error || "Failed to set default address";
      throw new Error(errMsg);
    }
    throw new Error("Failed to set default address");
  }
  return result.data;
};

export const setDefaultAddressOptions = (utils: QueryClient) => {
  return mutationOptions({
    mutationFn: ({ id }: { id: string }) => setDefaultAddressFn({ id }),
    onSuccess: () => {
      toast.success("Default address updated");

      utils.invalidateQueries({ queryKey: accountKeys.addresslist });
    },
    onError: (err) => {
      toast.error(err.message);
      console.log("setDefaultAddressHook", err);
    },
  });
};

export const useSetDefaultAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(setDefaultAddressOptions(queryClient));
};
