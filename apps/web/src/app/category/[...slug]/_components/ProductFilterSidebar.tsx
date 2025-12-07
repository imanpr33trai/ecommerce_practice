"use client";

import { Checkbox } from "@comp/checkbox";
import { Label } from "@comp/label";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/_components/client/button";
import { useCategory } from "@/hooks/useCategory";

// TODO: Integrate actual filter state and tRPC queries for filter options here.
// For now, it's a design placeholder.

interface ProductFiltersSidebarProps {
	currentCategorySlug: string;
}

export const ProductFiltersSidebar = ({
	currentCategorySlug,
}: ProductFiltersSidebarProps) => {
	const {
		data: categoryData,
		isLoading: isCateogryLoading,
		isError: isCategoryError,
	} = useCategory.(currentCategorySlug);
	const [expandedSubcategories, setExpandedSubcategories] = useState<
		Set<string>
	>(new Set());

	const toggleSubcategory = (slug: string) => {
		setExpandedSubcategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(slug)) {
				newSet.delete(slug);
			} else {
				newSet.add(slug);
			}
			return newSet;
		});
	};

	return (
		<aside className="hidden lg:block">
			<div className="space-y-8">
				{" "}
				{/* Increased spacing */}
				{/* Material Filter */}
				{isCateogryLoading && (
					<p className="text-muted-foreground">Loading Categories...</p>
				)}
				{isCategoryError && (
					<p className="text-red-500">Error loading categories.</p>
				)}
				<div>
					<h3 className="mb-4 font-bold text-foreground text-lg">Material</h3>
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Checkbox id="wood" />
							<Label htmlFor="wood">Wood</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox id="metal" />
							<Label htmlFor="metal">Metal</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox id="fabric" />
							<Label htmlFor="fabric">Fabric</Label>
						</div>
					</div>
				</div>
				{/* Color Filter */}
				{categoryData &&
					categoryData?.children &&
					categoryData.children.length > 0 && (
						<div>
							<h3 className="mb-4 font-bold text-foreground text-lg">
								Subcategory
							</h3>
							<div className="space-y-2">
								{categoryData.children.map((child) => (
									<div
										key={child.id}
										className="flex items-center justify-between py-1"
									>
										<Link
											href={`/category/${currentCategorySlug}/${child.slug}`}
											className="text-white transition-colors hover:text-blue-400"
										>
											{child.name} ({child._count.products})
										</Link>
										{/* {child.}<Button variant={'ghost'} size={'icon'} onClick={() => toggleSubcategory(child.slug)}>
                                        {expandedSubcategories.has(child.slug) ? <ChevronDown /> : <ChevronRight />}
                                    </Button> */}
									</div>
								))}
							</div>
						</div>
					)}
				{/* Price Range Slider (Placeholder) */}
				<div>
					<h3 className="mb-4 font-bold text-foreground text-lg">
						Price Range
					</h3>
					<p className="text-muted-foreground text-sm">($50 - $1000)</p>{" "}
					{/* Placeholder for a slider */}
					<Button className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700">
						Apply Filters
					</Button>
				</div>
			</div>
		</aside>
	);
};
