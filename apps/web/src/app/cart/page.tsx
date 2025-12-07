"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@comp/card";
import { Separator } from "@comp/separator";
import { Skeleton } from "@comp/skeleton";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
// Import shadcn/ui and custom types/hooks
import { Button } from "@/_components/client/button";
import { useCart } from "@/hooks/useCart";
import type { CartItem, UserCart } from "@/utils/typesClient";

// =================================================================================
// Section 1: Individual Cart Item Card (Arrow Function Component)
// =================================================================================
const CartItemCard = ({ item }: { item: CartItem }) => {
	const { mutate: removeItem, isPending: isRemoving } = useCart.removeItem();
	const { mutate: updateQuantity, isPending: isUpdating } =
		useCart.updateQuantity();

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity < 1) return;
		updateQuantity({ productId: item.productId, quantity: newQuantity });
	};

	const handleRemove = () => {
		removeItem({ productId: item.productId });
	};

	const isMutating = isRemoving || isUpdating;

	return (
		<div className="flex items-center gap-4 py-4">
			<div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
				<Image
					src={item.product.images?.[0]?.url ?? "/placeholder.png"}
					alt={item.product.name}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex-1">
				<Link
					href={`/${item.product.slug}`}
					className="font-semibold hover:underline"
				>
					{item.product.name}
				</Link>
				<p className="text-muted-foreground text-sm">
					${item.product.price.toString()}
				</p>
				<div className="mt-2 flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => handleQuantityChange(item.quantity - 1)}
						disabled={isMutating}
					>
						<Minus className="h-4 w-4" />
					</Button>
					<span className="w-8 text-center">{item.quantity}</span>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => handleQuantityChange(item.quantity + 1)}
						disabled={isMutating}
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<div className="flex flex-col items-end gap-2">
				<p className="font-semibold">
					${(Number(item.product.price) * item.quantity).toFixed(2)}
				</p>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-muted-foreground"
					onClick={handleRemove}
					disabled={isMutating}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};

// =================================================================================
// Section 2: Order Summary Card (Arrow Function Component)
// =================================================================================
const OrderSummaryCard = ({ items }: { items: CartItem[] }) => {
	const subtotal = useMemo(() => {
		return items.reduce(
			(acc, item) => acc + Number(item.product.price) * item.quantity,
			0,
		);
	}, [items]);

	const shipping = 5.0; // Example shipping cost
	const total = subtotal + shipping;

	return (
		<Card className="rounded-xl shadow-lg">
			<CardHeader>
				<CardTitle>Order Summary</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between">
					<span>Subtotal</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-between">
					<span>Shipping</span>
					<span>${shipping.toFixed(2)}</span>
				</div>
				<Separator />
				<div className="flex justify-between font-bold text-lg">
					<span>Total</span>
					<span>${total.toFixed(2)}</span>
				</div>
				<Button className="w-full" size="lg" asChild>
					<Link href="/checkout">Proceed to Checkout</Link>
				</Button>
			</CardContent>
		</Card>
	);
};

// =================================================================================
// Section 3: Main View for When Cart Has Items (Arrow Function Component)
// =================================================================================
const CartView = ({ cart }: { cart: UserCart | null }) => {
	if (!cart) {
		return (
			<div className="flex h-40 items-center justify-center">
				<span>Your cart is empty.</span>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<Card className="rounded-xl shadow-lg lg:col-span-2">
				<CardHeader>
					<CardTitle>Shopping Cart ({cart.items.length ?? 0} items )</CardTitle>
				</CardHeader>
				<CardContent>
					{cart?.items.map((item, index) => (
						<div key={item.id}>
							<CartItemCard item={item} />
							{index < cart.items.length - 1 && <Separator />}
						</div>
					))}
				</CardContent>
			</Card>
			<div className="lg:col-span-1">
				<OrderSummaryCard items={cart?.items ?? []} />
			</div>
		</div>
	);
};

// =================================================================================
// Section 4: Loading & Empty States (Arrow Function _components)
// =================================================================================
const CartLoadingState = () => (
	<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div className="space-y-4 lg:col-span-2">
			<Skeleton className="h-16 w-full" />
			<Skeleton className="h-24 w-full" />
			<Skeleton className="h-24 w-full" />
		</div>
		<Skeleton className="h-64 w-full lg:col-span-1" />
	</div>
);

const CartEmptyState = () => (
	<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
		<ShoppingCart className="h-16 w-16 text-muted-foreground" />
		<h2 className="mt-6 font-bold text-2xl">Your cart is empty</h2>
		<p className="mt-2 text-muted-foreground">
			Add items to your cart to see them here.
		</p>
		<Button asChild className="mt-6">
			<Link href="/">Continue Shopping</Link>
		</Button>
	</div>
);

// =================================================================================
// Main Page Component
// =================================================================================
export default function CartPage() {
	const { data: cart, isLoading, isError } = useCart.getAll();

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="mb-8 font-extrabold text-4xl tracking-tight">Your Cart</h1>

			{isLoading && <CartLoadingState />}

			{isError && (
				<p className="text-center text-red-500">Could not load your cart.</p>
			)}

			{!isLoading &&
				!isError &&
				(cart && cart.items.length > 0 ? (
					<CartView cart={cart} />
				) : (
					<CartEmptyState />
				))}
		</div>
	);
}
