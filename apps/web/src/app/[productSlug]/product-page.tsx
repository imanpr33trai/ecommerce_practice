/* eslint-disable @next/next/no-img-element */

"use client";
import { Skeleton } from "@comp/skeleton";
import {
	IconArrowLeft,
	IconArrowRight,
	IconHeart,
	IconMessageCircle,
	IconMinus,
	IconPlus,
	IconRuler,
	IconShoppingBag,
	IconTruck,
} from "@tabler/icons-react";
import { Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/_components/client/button";
import Header from "@/_components/Layout/Header";
import { useProduct } from "@/hooks/useProduct";
import type {
	ProductDetailed,
	ProductListItem,
	ProductReview,
	ReviewAddResult,
} from "@/utils/typesClient";

const ProductPage = ({ productSlug }: { productSlug: string }) => {
	const { data: product, isLoading } = useProduct.getBySlug(productSlug);
	const {
		data: reviews,
		isLoading: reviewLoad,
		isError: reviewsError,
	} = useProduct.reviewsByProductId(product?.id);
	const { data: allProduct } = useProduct.getAll();
	// Replace simple loading text with a skeleton loader
	if (isLoading) {
		return (
			<div className="mx-auto min-h-screen max-w-7xl p-2 sm:p-4 lg:p-6">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
					{/* Product Image Skeleton */}
					<div className="lg:col-span-3">
						<div className="h-full rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-800">
							<Skeleton className="mb-4 h-8 w-1/3" />
							<Skeleton className="h-[500px] w-full rounded-2xl" />
							<div className="mt-4 flex gap-2">
								{[1, 2, 3, 4].map((i) => (
									<Skeleton key={i} className="h-20 w-20 rounded-lg" />
								))}
							</div>
						</div>
					</div>

					{/* Product Details Skeleton */}
					<div className="flex flex-col space-y-6 lg:col-span-2">
						<div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-800">
							<Skeleton className="mb-4 h-10 w-3/4" />
							<Skeleton className="mb-4 h-8 w-1/4" />
							<Skeleton className="mb-6 h-24 w-full" />
							<div className="flex gap-2">
								<Skeleton className="h-12 flex-1" />
								<Skeleton className="h-12 w-[20%]" />
							</div>
							<Skeleton className="mt-3 h-12 w-full" />
						</div>

						{/* Color and Size Selector Skeletons */}
						<div className="grid grid-cols-2 gap-6">
							<div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-800">
								<Skeleton className="mb-4 h-6 w-20" />
								<div className="flex space-x-2">
									{[1, 2, 3, 4].map((i) => (
										<Skeleton key={i} className="h-8 w-8 rounded-full" />
									))}
								</div>
							</div>
							<div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-800">
								<Skeleton className="mb-4 h-6 w-16" />
								<div className="flex space-x-2">
									{[1, 2, 3].map((i) => (
										<Skeleton key={i} className="h-10 w-10 rounded-full" />
									))}
								</div>
							</div>
						</div>

						{/* Quantity Selector Skeleton */}
						<div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-800">
							<Skeleton className="h-6 w-24" />
							<div className="flex items-center space-x-3">
								<Skeleton className="h-10 w-10" />
								<Skeleton className="h-6 w-6" />
								<Skeleton className="h-10 w-10" />
							</div>
						</div>
					</div>

					{/* Additional Info Skeletons */}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-5">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-800"
							>
								<Skeleton className="mb-4 h-8 w-40" />
								<Skeleton className="h-24 w-full" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (reviewLoad) {
		return <div>Loading reviews...</div>;
	}

	if (!product || !allProduct) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p>Product not found.</p>
				<Link href="/">Go back to homepage</Link>
			</div>
		);
	}
	const relatedProduct = allProduct.filter(
		(p) => p.category?.id === product.category?.id && p.id !== product.id,
	);
	if (!reviews || reviewsError) {
		console.log(reviewsError);
		return <div>Error loading reviews</div>;
	}
	return (
		<div className="mx-auto min-h-screen max-w-7xl bg-zinc-100 p-2 text-zinc-900 sm:p-4 lg:p-6 dark:bg-zinc-900 dark:text-zinc-100">
			<Header />
			<div className=" ">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
					{/* Main Product Display */}
					<div className="lg:col-span-3">
						<ProductDisplayCard product={product} />
					</div>

					{/* Sidebar with Details and Actions */}
					<div className="flex flex-col space-y-6 lg:col-span-2">
						<ProductDetailsCard product={product} />
						<div className="grid grid-cols-2 gap-6">
							<ColorOptionsCard />
							<SizeSelectorCard />
						</div>
						<QuantitySelectorCard />
					</div>

					{/* Additional Info Grid */}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-5">
						<SpecificationsCard />
						<ShippingInfoCard />
						<CustomerReviewsCard reviews={reviews} />
					</div>

					{/* Related Products and Team/Bonus Cards */}
					<div className="grid grid-cols-1 gap-6 lg:col-span-5 lg:grid-cols-4">
						<div className="lg:col-span-3">
							<AutoScrollProducts products={relatedProduct} />
						</div>
						<div className="grid grid-cols-1 gap-6 lg:col-span-1 lg:grid-cols-1">
							<TeamCard />
							<BonusCard />
						</div>
					</div>
					<div className="grid grid-cols-1 gap-6 lg:col-span-5 lg:grid-cols-4">
						<div className="grid grid-cols-1 gap-6 lg:col-span-3 lg:grid-cols-3">
							<ReviewCard reviews={reviews} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ProductDisplayCard = ({ product }: { product: ProductDetailed }) => {
	const [activeImage, setActiveImage] = useState(0);

	return (
		<div className="flex h-full flex-col gap-2.5 rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-800">
			<h2 className="font-bold text-3xl text-zinc-400 dark:text-zinc-500">
				{product.category?.name}
			</h2>
			<div className="mt-4 flex flex-grow items-center justify-center">
				<div className="relative w-full">
					<img
						src={product.images[activeImage]?.url}
						alt={product.name}
						className="h-[500px] w-full rounded-2xl bg-zinc-200 object-cover dark:bg-zinc-700"
					/>
					<div className="absolute top-4 right-4 rounded-full bg-white/50 p-2 backdrop-blur-lg dark:bg-zinc-900/50">
						<span className="text-yellow-500">⭐</span> {product.reviews.length}
					</div>
				</div>
			</div>
			<div className="flex gap-2 pb-2">
				{product.images.map((image, idx) => (
					<Button
						key={image.id}
						onClick={() => setActiveImage(idx)}
						variant="outline"
						className={`relative h-20 w-20 flex-shrink-0 rounded-lg ${activeImage === idx ? "ring-2 ring-black dark:ring-white" : ""}`}
					>
						<Image
							src={image.url}
							alt={`${product.name} view ${idx + 1}`}
							className="h-full w-full object-cover"
							width={80}
							height={80}
						/>
					</Button>
				))}
			</div>
		</div>
	);
};

const ProductDetailsCard = ({ product }: { product: ProductDetailed }) => (
	<div className="flex h-full w-full flex-col rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-800">
		<h1 className="font-bold text-4xl">{product.name}</h1>
		<p className="mt-2 font-semibold text-2xl">${Number(product.price)}</p>
		<p className="mt-4 flex-grow text-zinc-500 dark:text-zinc-400">
			{product.description}
		</p>

		<div className="mt-6 flex gap-2">
			<Button className="w-full flex-1" size="lg">
				<IconShoppingBag />
				Add to Cart
			</Button>
			<Button className="w-[20%]" variant="outline" size="lg">
				<IconHeart />
			</Button>
		</div>

		<Button href="Buy-Now" className="mt-3" variant="outline" size="lg">
			Buy Now
		</Button>
	</div>
);

const ColorOptionsCard = () => (
	<div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-800">
		<h4 className="mb-2 font-bold text-lg">Color</h4>
		<div className="flex space-x-2">
			<div className="h-8 w-8 cursor-pointer rounded-full border-2 border-zinc-300 bg-black" />
			<div className="h-8 w-8 cursor-pointer rounded-full border-2 border-zinc-300 bg-white" />
			<div className="h-8 w-8 cursor-pointer rounded-full border-2 border-zinc-300 bg-gray-500" />
			<div className="h-8 w-8 cursor-pointer rounded-full border-2 border-zinc-300 bg-amber-800" />
		</div>
	</div>
);

const SizeSelectorCard = () => {
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const sizes = ["S", "M", "L"];
	return (
		<div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-800">
			<h4 className="mb-2 font-bold text-lg">Size</h4>
			<div className="flex space-x-2">
				{sizes.map((size) => (
					<Button
						key={size}
						variant={"outline"}
						className={`rounded-full ${
							selectedSize === size
								? "bg-black text-black dark:bg-white dark:hover:bg-white/90 dark:hover:text-black"
								: ""
						} `}
						onClick={() => setSelectedSize(size)}
					>
						{size}
					</Button>
				))}
			</div>
		</div>
	);
};

const QuantitySelectorCard = () => {
	const [quantity, setQuantity] = useState(1);
	return (
		<div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-800">
			<h4 className="font-bold text-lg">Quantity</h4>
			<div className="flex items-center space-x-3">
				<Button
					size="icon"
					variant="ghost"
					onClick={() => setQuantity(Math.max(1, quantity - 1))}
				>
					<IconMinus />
				</Button>
				<span className="font-semibold text-xl">{quantity}</span>
				<Button
					size="icon"
					variant="ghost"
					onClick={() => setQuantity(quantity + 1)}
				>
					<IconPlus />
				</Button>
			</div>
		</div>
	);
};

const SpecificationsCard = () => (
	<div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-800">
		<h4 className="mb-3 flex items-center font-bold text-xl">
			<IconRuler className="mr-2" /> Specifications
		</h4>
		<ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
			<li>
				<strong>Material:</strong> Oak Wood, Linen
			</li>
			<li>
				<strong>Dimensions:</strong> 85"W x 35"D x 30"H
			</li>
			<li>
				<strong>Weight:</strong> 150 lbs
			</li>
		</ul>
	</div>
);

const ShippingInfoCard = () => (
	<div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-800">
		<h4 className="mb-3 flex items-center font-bold text-xl">
			<IconTruck className="mr-2" /> Shipping
		</h4>
		<p className="text-zinc-600 dark:text-zinc-400">
			Free nationwide shipping. Arrives in 5-7 business days. White glove
			delivery available.
		</p>
	</div>
);

const CustomerReviewsCard = ({ reviews }: { reviews: ProductReview[] }) => {
	const averageRating =
		reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
	return (
		<div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-800">
			<h4 className="mb-3 flex items-center font-bold text-xl">
				<IconMessageCircle className="mr-2" /> Customer Reviews
			</h4>
			<div className="flex items-center space-x-4">
				<span className="font-bold text-2xl">{averageRating.toFixed(1)}</span>
				<div className="flex items-center">
					<div className="flex gap-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`h-5 w-5 ${
									star <= averageRating
										? "fill-yellow-400 text-yellow-400"
										: "text-zinc-300"
								}`}
							/>
						))}
					</div>
					<span className="ml-2 text-sm text-zinc-500">
						({reviews.length} reviews)
					</span>
				</div>
			</div>
			{/* <p className="text-zinc-600 dark:text-zinc-400 mt-4">
        Read what our customers have to say about their experience with this product.
      </p> */}
			<Button
				variant="outline"
				className="mt-4"
				onClick={() => {
					document
						.getElementById("reviews-section")
						?.scrollIntoView({ behavior: "smooth" });
				}}
			>
				Read All Reviews
			</Button>
		</div>
	);
};

const AutoScrollProducts = ({ products }: { products: ProductDetailed[] }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const scrollRef = useRef<HTMLDivElement>(null);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		if (!isPaused) {
			const interval = setInterval(() => {
				if (products.length > 1) {
					setCurrentIndex((prev) => (prev + 1) % products.length);
				}
			}, 3000); // Change slide every 3 seconds

			return () => clearInterval(interval);
		}
	}, [products.length, isPaused]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				left: currentIndex * (300 + 24), // card width + gap
				behavior: "smooth",
			});
		}
	}, [currentIndex]);

	const scroll = (direction: "prev" | "next") => {
		setIsPaused(true); // Pause auto-scroll when manual navigation is used
		if (direction === "prev") {
			setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
		} else {
			setCurrentIndex((prev) => (prev + 1) % products.length);
		}
	};

	return (
		<div
			className="group relative"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<div ref={scrollRef} className="overflow-x-hidden">
				<div className="flex gap-6 transition-transform duration-500 ease-in-out">
					{products.map((product, index) => (
						<div key={product.id} className="w-[300px] flex-shrink-0">
							<Link href={`/${product.slug}`}>
								<RelatedProductCard product={product} />
							</Link>
						</div>
					))}
				</div>
			</div>

			{/* Navigation Buttons */}
			{products.length > 1 && (
				<>
					<button
						onClick={() => scroll("prev")}
						className="-translate-y-1/2 -translate-x-4 absolute top-1/2 left-0 rounded-full bg-white p-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-800"
						aria-label="Previous product"
					>
						<IconArrowLeft className="h-5 w-5" />
					</button>
					<button
						onClick={() => scroll("next")}
						className="-translate-y-1/2 absolute top-1/2 right-0 translate-x-4 rounded-full bg-white p-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-800"
						aria-label="Next product"
					>
						<IconArrowRight className="h-5 w-5" />
					</button>
				</>
			)}

			{/* Dots indicator */}
			{/* <div className="flex justify-center gap-2 mt-4">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
            }}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                ? 'bg-black dark:bg-white w-4'
                : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
		</div>
	);
};

const RelatedProductCard = ({ product }: { product: ProductDetailed }) => (
	<div className="block h-full">
		<div className="h-full cursor-pointer rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[0.98] hover:ring-2 hover:ring-black dark:bg-zinc-800 hover:dark:ring-white/20">
			<span className="self-start rounded-full bg-zinc-200 px-2 py-1 font-semibold text-xs dark:bg-zinc-700">
				{product.category?.name || "RELATED"}
			</span>
			<h3 className="mt-4 font-bold text-xl">{product.name}</h3>
			<div className="mt-4 h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-700">
				<img
					src={product.images[0]?.url}
					alt={product.name}
					className="h-full w-full rounded-2xl object-cover"
				/>
			</div>
			<div className="mt-4 font-semibold text-lg">${Number(product.price)}</div>
		</div>
	</div>
);

const TeamCard = () => (
	<div className="block rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-800">
		<h4 className="font-bold">OUR TEAM</h4>
		<p className="text-sm text-zinc-500 dark:text-zinc-400">
			Designers of luxurious minimalist furniture.
		</p>
		<div className="-space-x-2 mt-2 flex">
			<div className="h-8 w-8 rounded-full border-2 border-white bg-zinc-300 dark:border-zinc-800" />
			<div className="h-8 w-8 rounded-full border-2 border-white bg-zinc-400 dark:border-zinc-800" />
			<div className="h-8 w-8 rounded-full border-2 border-white bg-zinc-500 dark:border-zinc-800" />
		</div>
	</div>
);

const BonusCard = () => (
	<div className="block rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-800">
		<h4 className="font-bold">GET A BONUS</h4>
		<p className="text-sm text-zinc-500 dark:text-zinc-400">
			Discover our latest exclusive deals.
		</p>
		<div className="mt-2 flex">
			<input
				type="email"
				placeholder="Email"
				className="w-full rounded-l-full bg-zinc-100 px-3 py-2 focus:outline-none dark:bg-zinc-700"
			/>
			<button className="rounded-r-full bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-zinc-900">
				Subscribe
			</button>
		</div>
	</div>
);

const ReviewCard = ({ reviews }: { reviews: ProductReview[] }) => {
	return (
		<>
			{reviews.map((u, idx) => (
				<div
					key={idx}
					className="lg rounded-3xl bg-white p-4 shadow-lg hover:ring-2 hover:ring-black dark:bg-zinc-800 hover:dark:ring-white/20"
				>
					<div>
						<div className="mb-2 flex items-center space-x-2">
							<div className="rounded-2xl bg-zinc-200 dark:bg-zinc-700">
								{u.user.image ? (
									<img
										src={u.user.image}
										alt={" "}
										className="h-8 w-8 rounded-full"
									/>
								) : (
									<User className="h-8 w-8 p-1" />
								)}
							</div>
							<span className="font-semibold">{u.user.name}</span>
						</div>
					</div>
					<p className="text-zinc-600 dark:text-zinc-400">{u.comment}</p>
				</div>
			))}
		</>
	);
};
export default ProductPage;
