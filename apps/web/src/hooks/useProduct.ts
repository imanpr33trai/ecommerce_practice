// 1. Import the standard `useQuery` hook from TanStack Query

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { type RouterInputs, trpc } from "@/utils/trpc"; // Your tRPC client setup

type ProductFilters = RouterInputs["product"]["list"]["filters"];
type ProductSortOption = RouterInputs["product"]["list"]["sort"];

interface UseProductsOptions {
	limit?: number;
	enabled?: boolean;
	sort?: ProductSortOption;
}

/**
 * A collection of custom hooks for product-related data fetching.
 * This pattern groups related tRPC procedures for better organization.
 */
export const useProduct = {
	create: () => {
		return useMutation(
			trpc.product.create.mutationOptions({
				onSuccess: () => {
					console.log("Product created successfully");
				},
				onError: (error) => {
					console.error("Error creating product:", error);
				},
			}),
		);
	},
	list: (filters?: ProductFilters, options?: UseProductsOptions) => {
		return useQuery(
			trpc.product.list.queryOptions(
				{
					limit: options?.limit ?? 20,
					filters,
					sort: options?.sort ?? "newest",
				},
				{
					enabled: options?.enabled,
					placeholderData: keepPreviousData,
					staleTime: 60 * 1000,
				},
			),
		);
	},
	newDeals: () => {
		return useQuery(
			trpc.product.list.queryOptions({
				limit: 1,
				sort: "newest",
				filters: { isNew: true, inStock: true },
			}),
		);
	},
	exclusiveDeals: () => {
		return useQuery(
			trpc.product.list.queryOptions({
				limit: 1,
				filters: { hasDiscount: true, inStock: true },
			}),
		);
	},
	greatValue: () => {
		return useQuery(
			trpc.product.list.queryOptions({
				limit: 2,
				sort: "price_asc", // Cheapest first
				filters: { inStock: true },
			}),
		);
	},
	featuredCategories: () => {
		return useQuery(trpc.category.getRoots.queryOptions());
	},
};
