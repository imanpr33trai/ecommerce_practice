"use client";

import { CardContent, CardHeader, CardTitle } from "@comp/card";
import { Truck } from "lucide-react";
import { FrostedCard } from "@/_components/client/FrostedCard";

interface ProductShippingCardProps {
	// Mock data for display, replace with actual shipping policies
	shippingInfo?: { title: string; details: string }[];
}

export const ProductShippingCard = ({
	shippingInfo,
}: ProductShippingCardProps) => {
	const mockShipping = shippingInfo || [
		{ title: "Cost", details: "Free nationwide shipping" },
		{
			title: "Delivery",
			details: "Arrives in 5-7 business days. White glove delivery available.",
		},
		{ title: "Returns", details: "Easy 30-day returns" },
	];

	return (
		<FrostedCard>
			<CardHeader className="flex flex-row items-center gap-3">
				<Truck className="h-6 w-6 text-white" />
				<CardTitle className="text-2xl text-white">Shipping</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 text-neutral-300">
				{mockShipping.map((info) => (
					<div key={info.title}>
						<span className="font-medium text-neutral-200">{info.title}: </span>
						<span>{info.details}</span>
					</div>
				))}
			</CardContent>
		</FrostedCard>
	);
};
