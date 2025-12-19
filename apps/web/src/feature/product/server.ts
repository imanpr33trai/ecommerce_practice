import { trpc } from "@/trpc/server"; // Your Server Proxy
import { ProductFilters } from "./types";

export const productOptions = {
    /**
     * Options for prefetching the Product List on the server.
     * Useful for SEO on Category Pages.
     */
    list: (filters: ProductFilters) => {
        return trpc.product.list.queryOptions(filters);
    },

    /**
     * Options for prefetching a Single Product Detail.
     * Useful for SEO on PDP (Product Detail Page).
     */
    detail: (slug: string) => {
        return trpc.product.getBySlug.queryOptions({ slug });
    },
};