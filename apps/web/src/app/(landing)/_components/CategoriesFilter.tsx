"use client";
import { Button } from "@/_components/client/button";
import { useCategory } from "@/hooks/useCategory";
import { SlidersHorizontal } from "lucide-react";

const CategoryFilters = () => {
	const { data: categories, isLoading, isError } = useCategory.categoryTree();
	// const categories = ['Table', 'Dressers', 'Sofa', 'Chair', 'Bed', 'Lamps', 'Apparel'];
	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading categories</div>;
	if (!categories || null) return <div>No categories found</div>;

	return (
		<div className="flex items-center gap-3 overflow-x-auto py-4">
			<Button variant="secondary" className="rounded-full">
				<SlidersHorizontal className="h-4 w-4" />
			</Button>
			{categories.map((cat) => (
				<Button
					key={cat.id}
					href={cat.slug ? `/category/${cat.slug.toLocaleLowerCase()}` : "#"}
					variant="secondary"
					className="flex-shrink-0 rounded-full"
				>
					{cat.name}
				</Button>
			))}
		</div>
	);
};

export default CategoryFilters;
