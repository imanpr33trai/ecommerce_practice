import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// --- READ HOOKS ---

/**
 * useCategoryTree
 * Best for: Mega Menu, Sidebar, Footer.
 * Caches data for 10 minutes because categories rarely change.
 */

export const useCategory = {
  categoryTree: () => {
    return useQuery(
      trpc.category.getRoots.queryOptions(undefined, {
        staleTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false,
      })
    );
  },

  /**
   * useCategoryPage
   * Best for: The /category/[slug] dynamic page.
   */
  ctegoryPage: (slug: string) => {
    return useQuery(
      trpc.category.getBySlug.queryOptions(
        { slug },
        {
          enabled: !!slug, // Don't fetch if slug is empty
          retry: false, // Don't retry 404s
        }
      )
    );
  },
  /**
   * useCategorySelect
   * Best for: Admin forms where you need to pick a Parent Category.
   */
  categorySelect: () => {
    return useQuery(trpc.category.getAllFlat.queryOptions());
  },
  getBySlug: (slug: string) => {
    return useQuery(trpc.category.getBySlug.queryOptions({ slug }));
  },
};
// --- WRITE HOOKS (Admin) ---

export function useCategoryActions() {
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: () => {
        toast.success("Category created");
        queryClient.invalidateQueries({
          queryKey: trpc.category.getRoots.queryKey(),
        }); // Refresh the menu
        queryClient.invalidateQueries({
          queryKey: trpc.category.getAllFlat.queryKey(),
        }); // Refresh admin selects
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.category.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Category deleted");
        queryClient.invalidateQueries({
          queryKey: trpc.category.getRoots.queryKey(),
        });
      },
      onError: (err) => toast.error(err.message),
    })
  );

  return {
    createMutation,
    deleteMutation,
  };
}
