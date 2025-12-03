'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Minus, Plus, Star } from 'lucide-react';
import { Button } from '@/_components/client/button';
import { Input } from '@comp/input';
import { Label } from '@comp/label';
import { RadioGroup, RadioGroupItem } from '@comp/radio-group'; // For variants
import { toast } from 'sonner';
import { type ProductDetailed } from '@/utils/typesClient';
import { useCart } from '@/hooks/useCart';
import { useWish } from '@/hooks/useWish';
import { cn } from '@/lib/utils'; // For class merging

interface ProductInfoBlockProps {
    product: ProductDetailed;
}

// Helper for displaying stars
const StarRatingDisplay = ({ rating, totalReviews }: { rating: number; totalReviews: number }) => (
    <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={cn("h-4 w-4", i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600')}
            />
        ))}
        <span className="ml-2 text-sm text-neutral-300 font-medium">
            {rating.toFixed(1)} ({totalReviews} reviews)
        </span>
    </div>
);


export const ProductInfoBlock = ({ product }: ProductInfoBlockProps) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('black'); // Mock variant state
    const [selectedSize, setSelectedSize] = useState('M'); // Mock variant state

    const { mutate: cartMutations, isPending: isAddingToCart, isError: cartError } = useCart.addToCart();
    const { mutate: wishMutations, isPending: isAddingToWishlist, isError: wishError } = useWish.toggleWish();

    // Calculate average rating (client-side, as _count.reviews is not for avg)
    const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

    const handleAddToCart = () => {
        cartMutations({ productId: product.id, quantity });
    };

    const handleAddToWishlist = () => {
        wishMutations({ productId: product.id });
    };

    // const isAddingToCart = cartMutations.addItem.isLoading;
    // const isAddingToWishlist = wishMutations.addWish.isLoading;

    return (
        <div className="rounded-2xl bg-neutral-800 p-4 lg:p-6 shadow-xl space-y-6">
            {/* Product Name & Price */}
            <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white">{product.name}</h1>
                <p className="mt-2 text-xl lg:text-3xl font-bold text-white">${product.price.toString()}</p>
                <StarRatingDisplay rating={averageRating} totalReviews={product._count.reviews} />
            </div>

            {/* Description */}
            <p className="text-neutral-300">{product.description}</p>

            {/* Variant Selection (MOCK DATA) */}
            {/* Color Variants */}
            <div>
                <Label className="text-white">Color</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="mt-2 flex space-x-2">
                    {['black', 'white', 'orange', 'blue'].map((color) => (
                        <Label
                            key={color}
                            htmlFor={color}
                            className={cn(
                                "relative h-8 w-8 cursor-pointer rounded-full border-2 p-0.5",
                                selectedColor === color ? "border-blue-500" : "border-transparent hover:border-gray-600"
                            )}
                        >
                            <RadioGroupItem value={color} id={color} className="sr-only" />
                            <span className={cn("block h-full w-full rounded-full",
                                color === 'black' && 'bg-black',
                                color === 'white' && 'bg-white',
                                color === 'orange' && 'bg-orange-500',
                                color === 'blue' && 'bg-blue-500',
                            )} />
                        </Label>
                    ))}
                </RadioGroup>
            </div>

            {/* Size Variants */}
            <div>
                <Label className="text-white">Size</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="mt-2 flex space-x-2">
                    {['S', 'M', 'L'].map((size) => (
                        <Label
                            key={size}
                            htmlFor={size}
                            className={cn(
                                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-neutral-700 text-sm font-medium text-white transition-colors hover:bg-neutral-600",
                                selectedSize === size ? "border-blue-500 bg-blue-600" : "border-neutral-600"
                            )}
                        >
                            <RadioGroupItem value={size} id={size} className="sr-only" />
                            {size}
                        </Label>
                    ))}
                </RadioGroup>
            </div>

            {/* Quantity Selector */}
            <div>
                <Label htmlFor="quantity" className="text-white">Quantity</Label>
                <div className="mt-2 flex h-10 items-center rounded-lg border border-neutral-600 bg-neutral-700">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full rounded-r-none border-r border-neutral-600 hover:bg-neutral-600"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    >
                        <Minus className="h-4 w-4 text-white" />
                    </Button>
                    <Input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="flex-1 border-y-0 border-x-0 h-full text-center text-white bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full rounded-l-none border-l border-neutral-600 hover:bg-neutral-600"
                        onClick={() => setQuantity(prev => prev + 1)}
                    >
                        <Plus className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                    className="w-full bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg py-2.5"
                    onClick={handleAddToWishlist}
                    disabled={isAddingToWishlist}
                >
                    <Heart className="mr-2 h-5 w-5 text-red-400" />
                    {isAddingToWishlist ? 'Adding to Wishlist...' : 'Add to Wishlist'}
                </Button>
            </div>
        </div>
    );
};