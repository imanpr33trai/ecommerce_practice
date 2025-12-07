"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/_componentsnts/ui/button";
import { cn } from "@/lib/utils";
import type { ProductDetailed } from "@/utils/typesClient";

interface ProductImageGalleryProps {
	product: ProductDetailed;
}

export const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
	const [mainImage, setMainImage] = useState(
		product.images[0]?.url || "/placeholder.png",
	);

	// Find average rating (placeholder logic)
	const averageRating =
		product.reviews.length > 0
			? (
					product.reviews.reduce((sum, review) => sum + review.rating, 0) /
					product.reviews.length
				).toFixed(1)
			: "0";
	const hasReviews = product._count?.reviews > 0;

	return (
		<div className="relative rounded-2xl bg-neutral-800 p-4 shadow-xl lg:p-6">
			{/* Main Product Image */}
			<div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
				<Image
					src={mainImage}
					alt={product.name}
					layout="fill"
					objectFit="contain"
					className="transition-transform duration-300 ease-in-out hover:scale-105"
				/>
				{/* Rating Overlay on Main Image */}
				<div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
					<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
					<span className="font-bold">{averageRating}</span>
				</div>
			</div>

			{/* Thumbnail Strip */}
			<div className="relative mt-4">
				<div className="no-scrollbar flex space-x-2 overflow-x-auto pb-2">
					{product.images.map((image) => (
						<div
							key={image.id}
							className={cn(
								"relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-200",
								mainImage === image.url
									? "border-blue-500"
									: "border-transparent hover:border-gray-600",
							)}
							onClick={() => setMainImage(image.url)}
						>
							<Image
								src={image.url}
								alt={image.altText || product.name}
								layout="fill"
								objectFit="cover"
							/>
						</div>
					))}
				</div>
				{/* Navigation Arrows for Thumbnail Strip (optional, for many images) */}
				{/* <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full"><ArrowLeft className="h-4 w-4" /></Button> */}
				{/* <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full"><ArrowRight className="h-4 w-4" /></Button> */}
			</div>
		</div>
	);
};
