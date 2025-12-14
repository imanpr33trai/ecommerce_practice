"use client";

import { CardContent, CardHeader, CardTitle } from "@comp/card";
import { Separator } from "@comp/separator";
import { FileText } from "lucide-react";
import { FrostedCard } from "@/_components/client/FrostedCard";

interface ProductSpecificationsCardProps {
	// Mock data for display, replace with actual product.specifications if available
	specifications?: { label: string; value: string }[];
}

export const ProductSpecificationsCard = ({
	specifications,
}: ProductSpecificationsCardProps) => {
	// Mock specifications if none are passed
	const mockSpecs = specifications || [
		{ label: "Material", value: "Oak Wood, Linen" },
		{ label: "Dimensions", value: '85"W x 35"D x 30"H' },
		{ label: "Weight", value: "150 lbs" },
		{ label: "Warranty", value: "2 Years Manufacturer" },
	];

	return (
		<FrostedCard>
			<CardHeader className="flex flex-row items-center gap-3">
				<FileText className="h-6 w-6 text-white" />
				<CardTitle className="text-2xl text-white">Specifications</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 text-neutral-300">
				{mockSpecs.map((spec, index) => (
					<div key={spec.label}>
						<div className="flex justify-between">
							<span className="font-medium text-neutral-200">{spec.label}</span>
							<span>{spec.value}</span>
						</div>
						{index < mockSpecs.length - 1 && (
							<Separator className="my-2 bg-neutral-700/50" />
						)}
					</div>
				))}
			</CardContent>
		</FrostedCard>
	);
};
