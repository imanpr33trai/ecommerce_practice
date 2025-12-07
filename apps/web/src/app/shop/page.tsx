"use client";
import { Filter, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type React from "react";
import BentoCard from "@/components/bento-card";
import Button from "@/components/button";
import { CATEGORIES, PRODUCTS } from "@/constants";

const Shop: React.FC = () => {
	const searchParams = useSearchParams();
	const category = searchParams.get("category") || "All";
	const isSale = searchParams.get("sale") === "true";

	const filteredProducts = PRODUCTS.filter((p) => {
		if (category !== "All" && p.category !== category) return false;
		if (isSale && !p.isOnSale) return false;
		return true;
	});

	return (
		<div className="mx-auto max-w-[1600px] animate-slide-up p-4 md:px-8">
			<div className="mb-8 flex items-end justify-between">
				<div>
					<h1 className="mb-2 font-light text-5xl">{category} Collection</h1>
					<p className="text-gray-500">
						Curated specifically for modern living.
					</p>
				</div>
				<Button variant="outline" className="!px-4 rounded-full">
					<Filter size={16} className="mr-2" /> Filters
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filteredProducts.map((product) => (
					<BentoCard
						key={product.id}
						className="group flex min-h-[400px] flex-col p-4"
						hoverEffect
					>
						<div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-100">
							<img
								src={product.image}
								alt={product.name}
								className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							<Link
								href={`/product/${product.id}`}
								className="absolute inset-0 z-0"
							/>

							{/* Floating Action Buttons */}
							<div className="absolute top-4 right-4 translate-x-12 transition-transform duration-300 group-hover:translate-x-0">
								<Button size="icon" className="!w-10 !h-10 shadow-md">
									<ShoppingBag size={18} />
								</Button>
							</div>

							{product.isOnSale && (
								<div className="absolute top-4 left-4 rounded-full bg-black px-3 py-1 font-bold text-white text-xs">
									-{product.discount}%
								</div>
							)}
						</div>

						<div className="mt-auto">
							<div className="flex items-start justify-between">
								<div>
									<h3 className="font-medium text-lg">{product.name}</h3>
									<p className="text-gray-400 text-sm">{product.category}</p>
								</div>
								<div className="flex flex-col items-end">
									<span className="font-bold text-lg">${product.price}</span>
									<div className="flex items-center gap-1 font-bold text-xs text-yellow-500">
										<Star size={12} fill="currentColor" /> {product.rating}
									</div>
								</div>
							</div>
						</div>
					</BentoCard>
				))}

				{/* Promotional Bento Card inserted in Grid */}
				<BentoCard className="col-span-1 row-span-1 flex flex-col items-center justify-center border border-gray-800 bg-black p-8 text-center text-white lg:col-span-1">
					<h3 className="mb-4 font-light text-3xl">
						Summer <br />
						Clearance
					</h3>
					<p className="mb-6 text-gray-400 text-sm">
						Up to 60% off on selected items.
					</p>
					<Button className="bg-white text-black hover:bg-gray-200">
						View Sale
					</Button>
				</BentoCard>
			</div>
		</div>
	);
};

export default Shop;
