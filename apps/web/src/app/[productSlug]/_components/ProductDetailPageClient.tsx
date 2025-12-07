"use client"; // 👈 Still a client component

import { Skeleton } from "@comp/skeleton";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "@/_components/max-width-wrapper";
import { useProduct } from "@/hooks/useProduct";
import { CustomerReviewsSection } from "./CustomerReviewsSection";
import { ProductImageGallery } from "./ProductImageGallery"; // Relative imports now correct
import { ProductInfoBlock } from "./ProductInfoBlock";
import { ProductShippingCard } from "./ProductShippingCard";
import { ProductSpecificationsCard } from "./ProductSpecificationsCard";
import { RelatedProductsSection } from "./RelatedProductsSection";

// The component now accepts `productSlug` as a direct prop,
// avoiding any potential Promise-related issues with `params`
export function ProductDetailPageClient({
	productSlug: slug,
}: {
	productSlug: string;
}) {
	// Fetch the detailed product data using your custom hook
	const {
		data: product,
		isLoading,
		isError,
		error,
	} = useProduct.getBySlug(slug);

	// Helper to format category name for breadcrumbs
	const formatCategoryName = (name: string) =>
		name
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

	// --- Loading State ---
	if (isLoading) {
		return (
			<MaxWidthWrapper className="py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<Skeleton className="aspect-square w-full rounded-2xl bg-neutral-800" />
					<div className="space-y-6 rounded-2xl bg-neutral-800 p-6">
						<Skeleton className="h-10 w-3/4 bg-neutral-700" />
						<Skeleton className="h-6 w-1/4 bg-neutral-700" />
						<Skeleton className="h-20 w-full bg-neutral-700" />
						<Skeleton className="h-12 w-1/2 bg-neutral-700" />
						<Skeleton className="h-12 w-full bg-blue-600" />
						<Skeleton className="h-12 w-full bg-neutral-700" />
					</div>
				</div>
				<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
					<Skeleton className="h-48 w-full rounded-2xl bg-neutral-800" />
					<Skeleton className="h-48 w-full rounded-2xl bg-neutral-800" />
					<Skeleton className="h-64 w-full rounded-2xl bg-neutral-800" />
				</div>
				<Skeleton className="mt-8 h-96 w-full rounded-2xl bg-neutral-800" />{" "}
				{/* Related Products */}
			</MaxWidthWrapper>
		);
	}

	// --- Error State (e.g., Product Not Found or API error) ---
	if (isError) {
		return (
			<MaxWidthWrapper className="py-20 text-center">
				<h2 className="font-bold text-2xl text-white">Product Not Found</h2>
				<p className="mt-4 text-neutral-300">
					{error.message ||
						"We couldn't find the product you're looking for. Please try another one."}
				</p>
				<Link
					href="/"
					className="mt-6 inline-flex items-center text-blue-400 hover:underline"
				>
					Go back to homepage <ChevronRight className="ml-1 h-4 w-4" />
				</Link>
			</MaxWidthWrapper>
		);
	}

	// --- Success State ---
	if (!product) return null;

	return (
		<div className="min-h-screen bg-neutral-900 pb-12 dark:bg-gray-950">
			<MaxWidthWrapper className="py-8">
				{/* Breadcrumbs */}
				<div className="mb-6 flex items-center text-neutral-400 text-sm">
					<Link href="/" className="hover:text-blue-400">
						Home
					</Link>
					<ChevronRight className="mx-2 h-4 w-4" />
					{product.category && (
						<>
							<Link
								href={`/categories/${product.category.slug}`}
								className="hover:text-blue-400"
							>
								{formatCategoryName(product.category.name)}
							</Link>
							<ChevronRight className="mx-2 h-4 w-4" />
						</>
					)}
					<span className="text-white">{product.name}</span>
				</div>

				{/* Main Product Section: Image Gallery and Info */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<ProductImageGallery product={product} />
					<ProductInfoBlock product={product} />
				</div>

				{/* Additional Info Sections */}
				<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
					<ProductSpecificationsCard />
					<ProductShippingCard />
					<CustomerReviewsSection product={product} />
				</div>

				{/* Related Products Section */}
				<div className="mt-8">
					<RelatedProductsSection product={product} />
				</div>
			</MaxWidthWrapper>
		</div>
	);
}
