"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/select";
import { useState } from "react"; // For sorting state
import { Button } from "@/_components/client/button";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@/_components/client/ProductCard";
import { useCategory } from "@/hooks/useCategory";
import { useProduct } from "@/hooks/useProduct";
import type { ProductForCategoryGrid } from "@/utils/typesClient";

interface ProductGridSectionProps {
	slugs: string[];
}

export const ProductGridSection = ({ slugs }: ProductGridSectionProps) => {
	// TODO: Implement actual sorting and pagination logic with tRPC query inputs.
	const [sortBy, setSortBy] = useState("newest"); // Example state for sorting

	// Use your custom hook to fetch the data based on slugs
	const {
		data: products,
		isLoading,
		isError,
		error,
	} = useCategory.byCategoryHierarchy(slugs);

	const displayedProductCount = products?.length ?? 0;
	// TODO: Replace with actual total count from API if using pagination
	const totalProducts = displayedProductCount;
	const productsPerPage = 9; // Example
	const totalPages = Math.ceil(totalProducts / productsPerPage) || 1;

	return (
		<div className="lg:col-span-3">
			<div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p className="text-muted-foreground">
					Showing {displayedProductCount} of {totalProducts} products
				</p>
				<Select value={sortBy} onValueChange={setSortBy}>
					<SelectTrigger className="w-[180px] rounded-lg border-gray-600/50 bg-white/10 text-white">
						<SelectValue placeholder="Sort by: Newest" />
					</SelectTrigger>
					<SelectContent className="rounded-lg border-gray-600/50 bg-white/10 text-white backdrop-blur-sm">
						<SelectItem value="newest" className="focus:bg-white/20">
							Newest
						</SelectItem>
						<SelectItem value="price-asc" className="focus:bg-white/20">
							Price: Low to High
						</SelectItem>
						<SelectItem value="price-desc" className="focus:bg-white/20">
							Price: High to Low
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<ProductCardSkeleton key={i} />
					))}
				</div>
			)}

			{/* Error State */}
			{isError && (
				<div className="rounded-2xl bg-white/10 p-6 py-12 text-center text-red-500 backdrop-blur-md">
					<p>Failed to load products for this category. {error?.message}</p>
				</div>
			)}

			{/* Empty State */}
			{!isLoading && !isError && products && products.length === 0 && (
				<div className="rounded-2xl bg-white/10 p-6 py-12 text-center text-muted-foreground backdrop-blur-md">
					<p>No products found in this category.</p>
				</div>
			)}

			{/* Success State - Product Grid */}
			{!isLoading && !isError && products && products.length > 0 && (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{products.map((product: ProductForCategoryGrid) => (
						<ProductCard key={product.id} item={product} />
					))}
				</div>
			)}

			{/* Pagination */}
			<div className="mt-12 flex justify-center">
				<div className="flex items-center gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-md">
					<Button
						variant="outline"
						className="border-gray-600/50 bg-transparent text-white hover:bg-white/20"
					>
						Previous
					</Button>
					<span className="text-sm text-white">Page 1 of {totalPages}</span>
					<Button
						variant="outline"
						className="border-gray-600/50 bg-transparent text-white hover:bg-white/20"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};
