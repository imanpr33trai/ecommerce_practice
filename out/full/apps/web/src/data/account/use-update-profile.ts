import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accountKeys } from "@/data/account/keys";
import { client } from "@/lib/hono-client";
import type { GetUpdateProfileRequest, GetUpdateProfileResponse } from "@/data/account/types";

/**
 * Type inference for Request (JSON body) and Response
 */

/**
 * 1. Standalone Function (Fetcher)
 */
const updateProfileFn = async (json: GetUpdateProfileRequest) => {
  const res = await client.api.user.me.$put({
    json,
  });

  const result = (await res.json().catch(() => ({
    success: false,
    error: "Network error: Failed to parse update response",
  }))) as GetUpdateProfileResponse;

  if (!res.ok || result.success === false) {
    // Type-safe property access using the 'in' operator for the union type
    const errorMessage = "error" in result ? result.error : "Failed to update profile";
    throw new Error(errorMessage);
  }

  // Returning the updated user data
  return "data" in result ? result.data : null;
};

/**
 * 2. Mutation Options Configuration
 */
export const updateProfileOptions = (utils: QueryClient) => {
  return {
    mutationFn: (json: GetUpdateProfileRequest) => updateProfileFn(json),
    onSuccess: () => {
      toast.success("Profile updated successfully");

      // Invalidate both profile and session keys to ensure UI consistency
      utils.invalidateQueries({
        queryKey: accountKeys.profile(),
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  };
};

/**
 * 3. React Hook
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateProfileOptions(queryClient));
};
