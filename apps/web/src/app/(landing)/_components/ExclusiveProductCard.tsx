"use client";
import { Card } from "@comp/card";
import { Expand, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/_components/client/button";
import { useProduct } from "@/hooks/useProduct";

const ExclusiveProductCard = () => {
	const { data } = useProduct.exclusiveDeals();
	const product = data?.items[0];
	return (
		<Card className="relative col-span-12 flex flex-col justify-between rounded-3xl p-6 md:col-span-7 lg:col-span-5">
			<div className="w-1/2">
				<span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
					EXCLUSIVE
				</span>
				<h3 className="mt-2 font-bold text-xl">{product?.name}</h3>
				<p className="mt-1 text-muted-foreground text-sm">
					{product?.description}
				</p>
			</div>
			<div className="absolute right-0 bottom-0 h-full w-1/2">
				<Image
					src={product?.images.at(0)?.url || "/images/krisjanis.jpg"}
					alt="Exclusive Product"
					layout="fill"
					objectFit="contain"
					className="rounded-3xl object-right-bottom"
				/>
			</div>
			<div className="mt-4 flex items-center justify-between">
				<Button className="rounded-full">
					Open <Expand className="ml-2 h-4 w-4" />
				</Button>
				<Button variant="secondary" size="icon" className="rounded-full">
					<Heart className="h-5 w-5 text-red-500" />
				</Button>
			</div>
		</Card>
	);
};
export default ExclusiveProductCard;
