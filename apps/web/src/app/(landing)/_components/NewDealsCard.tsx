"use client";
import { Button } from "@/_components/client/button";
import { useProduct } from "@/hooks/useProduct";
import { useWish } from "@/hooks/useWish";
import { Card } from "@comp/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowLeft, ArrowRight, Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";

// import type { CartAddItemResult } from '@/utils/typesClient';

const NewDealsCard = () => {
	const { data, isLoading,isError } = useProduct.newDeals();
	const product = data?.items[0];

	const {toggle,isPending} = useWish.wishlistToggle()

	if (isLoading) {
    return <Skeleton className="col-span-12 h-[400px] rounded-3xl md:col-span-5 lg:col-span-4" />;
  }

	if(!product) return null

	return (
		<Card className="col-span-12 flex flex-col rounded-3xl bg-gray-100 p-6 md:col-span-5 md:p-8 lg:col-span-4 dark:bg-gray-800/50">
			<h2 className="mb-4 font-bold text-3xl md:text-4xl">New Deals</h2>

			{/* Image container */}
			<div className="relative h-[350px] w-full overflow-hidden rounded-3xl">
				<Image
					src={product?.images.at(0)?.url || "/images/pavlo.jpg"}
					alt="Long Chair"
					fill
					className="object-cover"
				/>

				{/* Price + Name */}
				<div className="absolute top-2 left-2 rounded-3xl bg-white/70 px-4 py-2 text-black/40 backdrop-blur-sm">
					{/* <p className="font-bold text-2xl">  ${newDeals?.price.toFixed(2) ?? '0.00'}</p> */}
					<p className="font-bold text-2xl"> 00</p>
					<p className="text-sm">{product?.name}</p>
				</div>

				{/* Rating */}
				<div className="absolute top-2 right-2 flex items-center gap-2 rounded-full bg-white/70 p-3 backdrop-blur-sm">
					<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
					<span className="font-bold">4.9</span>
				</div>

				{/* Action buttons */}
				<div className="absolute right-2 bottom-2 flex items-center gap-3 rounded-full bg-white/70 p-2 backdrop-blur-sm">
					<Button
						variant="secondary"
						size="icon"
						className="h-10 w-10 rounded-full"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							toggle(product?.id)
						}}
					>
						<Heart className="h-5 w-5" />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						className="h-10 w-10 rounded-full"
					>
						<ShoppingBag className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* Slider controls */}
			<div className="mt-4 flex items-center justify-between rounded-full bg-white/20 p-2 backdrop-blur-sm">
				<Button
					variant="secondary"
					size="icon"
					className="h-10 w-10 rounded-full"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<span className="text-sm">Slide left and right</span>
				<Button
					variant="secondary"
					size="icon"
					className="h-10 w-10 rounded-full"
				>
					<ArrowRight className="h-5 w-5" />
				</Button>
			</div>
		</Card>
	);
};
export default NewDealsCard;
