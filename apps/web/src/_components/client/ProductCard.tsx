'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Sparkles } from 'lucide-react';

import { Card, CardContent } from '@comp/card';
import { Button } from '@/_components/client/button';
import { Skeleton } from '@comp/skeleton';
import { type ProductForCategoryGrid } from '@/utils/typesClient';
import { useCart } from '@/hooks/useCart';
import { useWish } from '@/hooks/useWish';

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
        <Card className="group relative w-full overflow-hidden rounded-3xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-all duration-500 hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.25)] hover:-translate-y-2 hover:bg-white/90 dark:hover:bg-gray-900/90">

            {/* Animated border gradient on hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[-2px] rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-sm animate-pulse" />
                <div className="absolute inset-0 rounded-3xl bg-white/90 dark:bg-gray-900/90" />
            </div>

            {/* Glass morphism overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/0 rounded-3xl pointer-events-none" />

            {/* Content wrapper with proper z-index */}
            <div className="relative z-10">
                {/* Glassmorphic Wishlist button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-30 h-11 w-11 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/30 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-red-500/20 hover:border-red-300/50 hover:text-red-500"
                    onClick={handleToggleWishList}
                    disabled={isAddingWish}
                    aria-label="Add to wishlist"
                >
                    <Heart className="h-5 w-5 transition-all duration-300 hover:fill-current" />
                </Button>

                {/* Glassmorphic Discount badge */}
                {item.discountPrice && (
                    <div className="absolute top-4 left-4 z-30 rounded-2xl bg-red-500/80 backdrop-blur-md border border-red-400/30 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                        <Sparkles className="inline h-3 w-3 mr-1" />
                        {Number(item.discountPrice).toFixed(2)}% OFF
                    </div>
                )}

                {/* New/Hot badge */}
                {item.createdAt && (
                    <div className="absolute top-4 left-4 z-30 rounded-2xl bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-md border border-purple-400/30 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                        NEW
                    </div>
                )}

                <Link href={`/${item.slug}`} className="block">
                    <CardContent className="p-0">
                        {/* Enhanced Image Container with animated border */}
                        <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                            {/* Animated border lines on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                {/* Top border animation */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-[shimmer_2s_infinite]" />
                                {/* Bottom border animation */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-[shimmer_2s_infinite_reverse]" />
                                {/* Left border animation */}
                                <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-indigo-500 to-transparent animate-[shimmerVertical_2s_infinite]" />
                                {/* Right border animation */}
                                <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-[shimmerVertical_2s_infinite_reverse]" />
                            </div>

                            {/* Primary Image with enhanced hover */}
                            <Image
                                src={primaryImage ?? '/placeholder.png'}
                                alt={item.name}
                                width={500}
                                height={500}
                                className={`h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1 ${secondaryImage ? 'group-hover:opacity-0' : ''
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
                                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-1000 ease-out group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-1"
                                />
                            )}

                            {/* Glassmorphic overlay gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 backdrop-blur-[2px]" />
                        </div>

                        {/* Enhanced Glassmorphic Content Container */}
                        <div className="relative space-y-3 p-6 bg-gradient-to-b from-transparent to-white/50 dark:to-black/30 backdrop-blur-sm">
                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

                            <div className="relative space-y-1">
                                <h3
                                    className="font-bold text-base leading-tight tracking-tight text-gray-900 dark:text-white line-clamp-2 transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text"
                                    title={item.name}
                                >
                                    {item.name}
                                </h3>

                                {item.category && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">
                                        {item.category.name}
                                    </p>
                                )}
                            </div>

                            {/* Glassmorphic Price section */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    ${Number(item.price).toFixed(2)}
                                </span>
                                {item.price && item.price > item.price && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                        ${Number(item.price).toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Glassmorphic Add to Cart Button */}
                            <Button
                                className="w-full rounded-2xl font-semibold bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
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
                                            'Add to Cart'
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
                                <div className="text-xs text-center font-semibold text-orange-600 dark:text-orange-400 bg-orange-100/50 dark:bg-orange-900/30 backdrop-blur-sm rounded-xl py-1.5 border border-orange-200/30">
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
        <Card className="w-full overflow-hidden rounded-3xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
            <div className="p-0">
                <Skeleton className="aspect-square w-full rounded-t-3xl bg-gradient-to-br from-gray-200/50 to-gray-100/50" />

                <div className="space-y-3 p-6 bg-gradient-to-b from-transparent to-white/50 backdrop-blur-sm">
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

