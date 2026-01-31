import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accountKeys } from "@/data/account/keys";
import type { GetDeleteAddressResponse } from "@/data/account/types";
import { client } from "@/lib/hono-client";

const deleteAddressFn = async ({ id }: { id: string }) => {
  const res = await client.address[":id"].$delete({
    param: { id },
  });

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Network connection failed",
  }))) as GetDeleteAddressResponse;

  if (!res.ok || result.success === false) {
    // Type-safe check: check if 'error' exists in the result object
    const errorMessage = "error" in result ? result.error : "Failed to delete address";
    throw new Error(errorMessage);
  }

  return result;
};

export const deleteAddressOptions = (utils: QueryClient) => {
  return {
    mutationFn: ({ id }: { id: string }) => deleteAddressFn({ id }),
    onSuccess: (data: GetDeleteAddressResponse) => {
      // Safely access message if it exists in the success type
      const msg = "message" in data ? data.message : "Address deleted";
      toast.success(msg);

      utils.invalidateQueries({ queryKey: accountKeys.addresslist });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  };
};

/**
 * 3. Hook
 */
export const useAddressDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteAddressOptions(queryClient));
};
