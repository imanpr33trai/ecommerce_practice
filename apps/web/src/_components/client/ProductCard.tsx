"use client";

import { Card, CardContent } from "@comp/card";
import { Skeleton } from "@comp/skeleton";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/_components/client/button";
import { useCart } from "@/hooks/useCart";
import { useWish } from "@/hooks/useWish";
import type { ProductForCategoryGrid } from "@/utils/typesClient";

/**
 * A reusable card component with glassmorphism effects and enhanced animations
 */
export const ProductCard = ({ item }: { item: ProductForCategoryGrid }) => {
	const { mutate: addItem, isPending: isAddingCart } = useCart.addToCart();
	const { mutate: addWish, isPending: isAddingWish } = useWish.toggleWish();

	if (!item) return <div>error</div>;

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		addItem({ productId: item.id, quantity: 1 });
	};

	const handleToggleWishList = (e: React.MouseEvent) => {
		e.preventDefault();
		addWish({ productId: item.id });
	};

	const primaryImage = item.images?.[0]?.url;
	const secondaryImage = item.images?.[1]?.url;

	return (
		<Card className="group hover:-translate-y-2 relative w-full overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-xl transition-all duration-500 hover:bg-white/90 hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.25)] dark:bg-gray-900/80 dark:hover:bg-gray-900/90">
			{/* Animated border gradient on hover */}
			<div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
				<div className="absolute inset-[-2px] animate-pulse rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-sm" />
				<div className="absolute inset-0 rounded-3xl bg-white/90 dark:bg-gray-900/90" />
			</div>

			{/* Glass morphism overlay for depth */}
			<div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/0" />

			{/* Content wrapper with proper z-index */}
			<div className="relative z-10">
				{/* Glassmorphic Wishlist button */}
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-4 right-4 z-30 h-11 w-11 rounded-2xl border border-white/30 bg-white/60 opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-red-300/50 hover:bg-red-500/20 hover:text-red-500 group-hover:opacity-100 dark:bg-black/40"
					onClick={handleToggleWishList}
					disabled={isAddingWish}
					aria-label="Add to wishlist"
				>
					<Heart className="h-5 w-5 transition-all duration-300 hover:fill-current" />
				</Button>

				{/* Glassmorphic Discount badge */}
				{item.discountPrice && (
					<div className="absolute top-4 left-4 z-30 rounded-2xl border border-red-400/30 bg-red-500/80 px-3 py-1.5 font-bold text-white text-xs shadow-lg backdrop-blur-md">
						<Sparkles className="mr-1 inline h-3 w-3" />
						{Number(item.discountPrice).toFixed(2)}% OFF
					</div>
				)}

				{/* New/Hot badge */}
				{item.createdAt && (
					<div className="absolute top-4 left-4 z-30 rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-500/80 to-pink-500/80 px-3 py-1.5 font-bold text-white text-xs shadow-lg backdrop-blur-md">
						NEW
					</div>
				)}

				<Link href={`/${item.slug}`} className="block">
					<CardContent className="p-0">
						{/* Enhanced Image Container with animated border */}
						<div className="relative aspect-square overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
							{/* Animated border lines on hover */}
							<div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
								{/* Top border animation */}
								<div className="absolute top-0 right-0 left-0 h-[2px] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
								{/* Bottom border animation */}
								<div className="absolute right-0 bottom-0 left-0 h-[2px] animate-[shimmer_2s_infinite_reverse] bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
								{/* Left border animation */}
								<div className="absolute top-0 bottom-0 left-0 w-[2px] animate-[shimmerVertical_2s_infinite] bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />
								{/* Right border animation */}
								<div className="absolute top-0 right-0 bottom-0 w-[2px] animate-[shimmerVertical_2s_infinite_reverse] bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
							</div>

							{/* Primary Image with enhanced hover */}
							<Image
								src={primaryImage ?? "/placeholder.png"}
								alt={item.name}
								width={500}
								height={500}
								className={`h-full w-full object-cover transition-all duration-1000 ease-out group-hover:rotate-1 group-hover:scale-110 ${
									secondaryImage ? "group-hover:opacity-0" : ""
								}`}
								priority={false}
							/>

							{/* Secondary Image on Hover */}
							{secondaryImage && (
								<Image
									src={secondaryImage}
									alt={`${item.name} alternate view`}
									width={500}
									height={500}
									className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-1000 ease-out group-hover:rotate-1 group-hover:scale-110 group-hover:opacity-100"
								/>
							)}

							{/* Glassmorphic overlay gradient on hover */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100" />
						</div>

						{/* Enhanced Glassmorphic Content Container */}
						<div className="relative space-y-3 bg-gradient-to-b from-transparent to-white/50 p-6 backdrop-blur-sm dark:to-black/30">
							{/* Subtle background pattern */}
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

							<div className="relative space-y-1">
								<h3
									className="line-clamp-2 font-bold text-base text-gray-900 leading-tight tracking-tight transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent dark:text-white"
									title={item.name}
								>
									{item.name}
								</h3>

								{item.category && (
									<p className="font-medium text-gray-600 text-xs uppercase tracking-wider dark:text-gray-400">
										{item.category.name}
									</p>
								)}
							</div>

							{/* Glassmorphic Price section */}
							<div className="flex items-baseline gap-2">
								<span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-black text-2xl text-transparent dark:from-white dark:to-gray-300">
									${Number(item.price).toFixed(2)}
								</span>
								{item.price && item.price > item.price && (
									<span className="text-gray-500 text-sm line-through dark:text-gray-400">
										${Number(item.price).toFixed(2)}
									</span>
								)}
							</div>

							{/* Glassmorphic Add to Cart Button */}
							<Button
								className="w-full rounded-2xl border border-white/20 bg-gradient-to-r from-purple-500/80 to-pink-500/80 font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:from-purple-600/90 hover:to-pink-600/90 hover:shadow-xl active:scale-[0.98]"
								size="lg"
								onClick={handleAddToCart}
								disabled={isAddingCart}
							>
								{item.stock ? (
									<span className="flex items-center justify-center">
										<ShoppingCart className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
										{isAddingCart ? (
											<span className="animate-pulse">Adding...</span>
										) : (
											"Add to Cart"
										)}
									</span>
								) : (
									<span className="flex items-center justify-center">
										Out of Stock
									</span>
								)}
							</Button>

							{/* Glassmorphic Stock indicator */}
							{item.stock && item.stock <= 5 && !item.stock && (
								<div className="rounded-xl border border-orange-200/30 bg-orange-100/50 py-1.5 text-center font-semibold text-orange-600 text-xs backdrop-blur-sm dark:bg-orange-900/30 dark:text-orange-400">
									🔥 Only {item.stock} left in stock
								</div>
							)}
						</div>
					</CardContent>
				</Link>
			</div>
		</Card>
	);
};

/**
 * Enhanced skeleton with glassmorphism
 */
export const ProductCardSkeleton = () => {
	return (
		<Card className="w-full overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-xl dark:bg-gray-900/80">
			<div className="p-0">
				<Skeleton className="aspect-square w-full rounded-t-3xl bg-gradient-to-br from-gray-200/50 to-gray-100/50" />

				<div className="space-y-3 bg-gradient-to-b from-transparent to-white/50 p-6 backdrop-blur-sm">
					<div className="space-y-2">
						<Skeleton className="h-5 w-3/4 bg-gray-200/50" />
						<Skeleton className="h-3 w-1/3 bg-gray-200/50" />
					</div>
					<Skeleton className="h-6 w-1/4 bg-gray-200/50" />
					<Skeleton className="h-11 w-full rounded-2xl bg-gradient-to-r from-purple-200/50 to-pink-200/50" />
				</div>
			</div>
		</Card>
	);
};
