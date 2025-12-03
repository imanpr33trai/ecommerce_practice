import { trpc } from "@/utils/trpc"
import { useQuery } from "@tanstack/react-query";



export const useCategory = {
    toplevel: () => {
        return useQuery(trpc.category.getTopLevelCategories.queryOptions())

    },
    /**
* Fetches a single category by its slug, including its immediate children.
* @param slug - The slug of the category to fetch.
*/

    bySlugWithChildren: (slug: string | undefined) => {
        const queryOptions = trpc.category.getCategoryWithChildrenBySlug.queryOptions({
            slug: slug!,

        });

        return useQuery({
            ...queryOptions,

            enabled: !!slug,
        })
    },
    byCategory: (slug: string[] | undefined) => {

        const queryOptions = trpc.product.getByCategorySlug.queryOptions({
            slug: slug!
        });
        return useQuery({
            ...queryOptions,
            enabled: !!slug,

        });
    },
    allCategories: () => {
        return useQuery(trpc.category.getAllCategories.queryOptions())
    },
    byCategoryHierarchy: (slugs: string[] | undefined) => {
        const queryOptions = trpc.product.getByCategoryHierarchy.queryOptions({
            slugs: slugs!
        });
        return useQuery({
            ...queryOptions,
            enabled: !!slugs && slugs.length > 0,
        })
    }
}