"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

import { accountKeys } from "./keys";

export const useAccountQueries = {
  useProfile: () => {
    return useQuery(
      trpc.user.getProfile.queryOptions(undefined, {
        staleTime: 1000 * 60 * 5, // 5 mins
      }),
    );
  },

  useAddresses: () => {
    return useQuery(
      trpc.address.list.queryOptions(undefined, {
        staleTime: 1000 * 60 * 1, // 1 min
      }),
    );
  },
};

export const useAccountMutations = {
  useAddAddress: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.address.create.mutationOptions({
        onSuccess: () => {
          toast.success("Address saved successfully");
          utils.invalidateQueries({ queryKey: trpc.address.list.queryKey() });
        },
        onError: (err) => toast.error(err.message),
      }),
    );
  },

  useUpdateAddress: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.address.update.mutationOptions({
        onSuccess: () => {
          toast.success("Address updated");
          utils.invalidateQueries({ queryKey: trpc.address.list.queryKey() });
        },
        onError: (err) => toast.error(err.message),
      }),
    );
  },

  useSetDefaultAddress: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.address.setDefault.mutationOptions({
        onSuccess: () => {
          toast.success("Default address updated");
          utils.invalidateQueries({ queryKey: trpc.address.list.queryKey() });
        },
        onError: (err) => toast.error(err.message),
      }),
    );
  },

  useDeleteAddress: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.address.delete.mutationOptions({
        onSuccess: () => {
          toast.success("Address deleted");
          utils.invalidateQueries({ queryKey: trpc.address.list.queryKey() });
        },
        onError: (err) => toast.error(err.message),
      }),
    );
  },

  useUpdateProfile: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.user.updateProfile.mutationOptions({
        onSuccess: () => {
          toast.success("Profile updated");
          utils.invalidateQueries({ queryKey: trpc.user.getProfile.queryKey() });
        },
        onError: (err) => toast.error(err.message),
      }),
    );
  },
};
