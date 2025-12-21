"use client";

import { usePathname, useSearchParams } from "next/navigation"; // 1. Add useSearchParams
import { useEffect, useRef, useState } from "react";

import { ArrowLeftRight, Filter } from "lucide-react";

import ModalFilter from "@/components/ModalFilter";
import ProductCard from "@/components/ProductCard";
import BentoCard from "@/components/ui/BentoCard";
import Button from "@/components/ui/Button";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/feature/product";

export default function ProductsPage() {
	// --- 1. ALL HOOKS MUST BE CALLED UNCONDITIONALLY HERE ---
	const [showFilters, setShowFilters] = useState(false);
	const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const location = usePathname();
	const searchParams = useSearchParams(); // 2. Correct hook for query params (?)

	// Context Hooks
	const { filters, setFilters, setCompareOpen, compareList } = useShop();
	// Data fetching hook - MUST be called before any returns
	// const { data: PRODUCTS, isError, error, isLoading } = Product.hooks.list();

	// Effects - AFTER all hooks
	useEffect(() => {
		const categoryParam = searchParams.get("category");
		const isSaleParam = searchParams.get("sale") === "true";

		if (categoryParam || isSaleParam) {
			setFilters((prev) => ({
				...prev,
				// Only update if different to prevent loops
				categories: categoryParam && categoryParam !== "All" ? [categoryParam] : prev.categories,
				onSale: isSaleParam || prev.onSale,
			}));
		}
	}, [searchParams, setFilters]);

	// --- 2. HANDLERS & DATA PROCESSING (after all hooks) ---
	const categoryParam = searchParams.get("category") || "All";

	const handleFilterEnter = () => {
		if (filterTimeoutRef.current) {
			clearTimeout(filterTimeoutRef.current);
		}
		setShowFilters(true);
	};

	const handleFilterLeave = () => {
		filterTimeoutRef.current = setTimeout(() => {
			setShowFilters(false);
		}, 300);
	};

	// --- 3. DATA FETCHING ---
	// Always call this hook. Never put it inside an 'if'.
	const { data: PRODUCTS, isError, error, isLoading } = Product.hooks.useList(filters);

	// --- 4. CONDITIONAL RENDERS (Only after all hooks are done) ---

	if (isLoading) {
		return (
			<div className="p-4 md:px-8 max-w-400 mx-auto min-h-screen flex items-center justify-center">
				<div>Loading products...</div>
			</div>
		);
	}

	if (isError || !PRODUCTS) {
		console.error("Product Load Error:", error);
		return (
			<div className="p-4 md:px-8 max-w-400 mx-auto min-h-screen flex flex-col items-center justify-center text-red-500">
				<h2 className="text-xl font-bold">Unable to load products</h2>
				<p>{error?.message || "Unknown error occurred"}</p>
				<Button onClick={() => window.location.reload()} className="mt-4">
					Retry
				</Button>
			</div>
		);
	}

	// --- 5. SUCCESS RENDER ---
	return (
		<div className="p-4 md:px-8 max-w-400 mx-auto animate-fade-in relative min-h-screen">
			{/* Header */}
			<div className="flex justify-between items-end mb-8 relative z-20">
				<div>
					<h1 className="text-5xl font-light mb-2">{filters.categories.length === 1 ? filters.categories[0] : categoryParam === "All" ? "Shop" : categoryParam} Collection</h1>
					<p className="text-gray-500">Curated specifically for modern living.</p>
				</div>

				{/* Actions */}
				<div className="flex gap-2 relative">
					{compareList.length > 0 && (
						<Button onClick={() => setCompareOpen(true)} className="rounded-full px-4! bg-black text-white animate-fade-in">
							<ArrowLeftRight size={16} className="mr-2" /> Compare ({compareList.length})
						</Button>
					)}

					<div className="relative" onMouseEnter={handleFilterEnter} onMouseLeave={handleFilterLeave}>
						<Button variant="outline" className={`rounded-full px-4! transition-colors ${showFilters ? "bg-black text-white border-black" : ""}`}>
							<Filter size={16} className="mr-2" /> Filters
						</Button>

						<div className={`absolute top-full right-0 mt-2 z-60 origin-top-right transition-all duration-300 ease-out transform ${showFilters ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible" : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible"}`}>
							<ModalFilter />
						</div>
					</div>
				</div>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{PRODUCTS.items.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}

				{/* Promo Card */}
				<BentoCard className="bg-black text-white p-8 flex flex-col justify-center items-center text-center col-span-1 lg:col-span-1 row-span-1 border border-gray-800">
					<h3 className="text-3xl font-light mb-4">
						Summer <br /> Clearance
					</h3>
					<p className="text-gray-400 text-sm mb-6">Up to 60% off on selected items.</p>
					<Button className="bg-white text-black hover:bg-gray-200">View Sale</Button>
				</BentoCard>
			</div>
		</div>
	);
}
