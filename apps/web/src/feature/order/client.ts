import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useOrderMutations = {
  /**
   * Hook to update the status of an order (Admin only).
   */
  useUpdateStatus: () => {
    const utils = useQueryClient();
    return useMutation(
      trpc.order.updateStatus.mutationOptions({
        onSuccess: () => {
          toast.success("Order status updated");
          utils.invalidateQueries({
            queryKey: [trpc.order.list.queryKey(), trpc.order.getById.queryKey()],
          });
        },
        onError: (err) => toast.error(err.message),
      }),
    );
  },
};
