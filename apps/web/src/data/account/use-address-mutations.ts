"use client";

import {
  mutationOptions,
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { accountKeys } from "@/data/account/keys";
import { client } from "@/lib/hono-client";
import type {
  GetAddAddressRequest,
  GetUpdateAddressRequest,
  GetSetDefaultResponse,
  GetDeleteAddressResponse,
} from "@/data/account/types";

/**
 * 1. Standalone Functions (Fetchers)
 */

const addAddressFn = async (json: GetAddAddressRequest["json"]) => {
  const res = await client.address.$post({ json });
  if (!res.ok) {
    throw new Error("Failed to add address");
  }
  return res.json();
};

const updateAddressFn = async ({ id, json }: { id: string; json: GetUpdateAddressRequest["json"] }) => {
  const res = await client.address[":id"].$put({ param: { id }, json });
  const result = await res.json();
  if (!res.ok || result.success === false) {
    if ("error" in result) {
      throw new Error(result.error || "Failed to update address");
    }
  }
  return result.data;
};

const setDefaultAddressFn = async ({ id }: { id: string }) => {
  const res = await client.address[":id"].default.$put({ param: { id } });
  const result = (await res.json()) as GetSetDefaultResponse;
  if (!res.ok || result.success === false) {
    if ("error" in result) {
      throw new Error(result.error || "Failed to set default address");
    }
    throw new Error("Failed to set default address");
  }
  return result.data;
};

const deleteAddressFn = async ({ id }: { id: string }) => {
  const res = await client.address[":id"].$delete({ param: { id } });
  const result = (await res.json().catch(() => ({
    success: false,
    error: "Network connection failed",
  }))) as GetDeleteAddressResponse;
  if (!res.ok || result.success === false) {
    const errorMessage = "error" in result ? result.error : "Failed to delete address";
    throw new Error(errorMessage);
  }
  return result;
};

/**
 * 2. Mutation Options Factory
 */
export const createAddressMutations = (utils: QueryClient) => {
  const queryKey = accountKeys.addresslist;

  return {
    create: mutationOptions({
      mutationFn: (json: GetAddAddressRequest["json"]) => addAddressFn(json),
      onSuccess: () => {
        toast.success("Address saved successfully");
        utils.invalidateQueries({ queryKey });
      },
      onError: (err: Error) => toast.error(err.message),
    }),

    update: mutationOptions({
      mutationFn: ({ id, json }: { id: string; json: GetUpdateAddressRequest["json"] }) =>
        updateAddressFn({ id, json }),
      onSuccess: () => {
        toast.success("Address updated successfully");
        utils.invalidateQueries({ queryKey });
      },
      onError: (err: Error) => toast.error(err.message),
    }),

    setDefault: mutationOptions({
      mutationFn: ({ id }: { id: string }) => setDefaultAddressFn({ id }),
      onSuccess: () => {
        toast.success("Default address updated");
        utils.invalidateQueries({ queryKey });
      },
      onError: (err: Error) => toast.error(err.message),
    }),

    delete: mutationOptions({
      mutationFn: ({ id }: { id: string }) => deleteAddressFn({ id }),
      onSuccess: (data: GetDeleteAddressResponse) => {
        const msg = "message" in data ? data.message : "Address deleted";
        toast.success(msg);
        utils.invalidateQueries({ queryKey });
      },
      onError: (err: Error) => toast.error(err.message),
    }),
  };
};

/**
 * 3. React Hook - Consolidated address mutations
 * Provides a single hook with all address mutations
 */
export function useAddressMutations() {
  const queryClient = useQueryClient();
  const mutations = createAddressMutations(queryClient);

  return {
    create: useMutation(mutations.create),
    update: useMutation(mutations.update),
    setDefault: useMutation(mutations.setDefault),
    delete: useMutation(mutations.delete),
  };
}

/**
 * Individual mutation hooks for backward compatibility
 */
export const useAddAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createAddressMutations(queryClient).create);
};

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createAddressMutations(queryClient).update);
};

export const useSetDefaultAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createAddressMutations(queryClient).setDefault);
};

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createAddressMutations(queryClient).delete);
};