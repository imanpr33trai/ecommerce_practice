import { Skeleton } from "@comp/skeleton";
import MaxWidthWrapper from "@/_components/max-width-wrapper";

export default function CategoriesLoading() {
	return (
		<MaxWidthWrapper className="py-8">
			{/* Header Skeleton */}
			<div className="mb-8">
				<Skeleton className="h-10 w-1/3" />
				<Skeleton className="mt-2 h-4 w-1/4" />
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				{/* Filter Sidebar Skeleton */}
				<aside className="hidden lg:block">
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-5 w-2/5" />
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-5 w-2/5" />
							<Skeleton className="h-12 w-full" />
						</div>
					</div>
				</aside>

				{/* Product Grid Skeleton */}
				<div className="lg:col-span-3">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex flex-col space-y-3">
								<Skeleton className="aspect-square w-full rounded-2xl" />
								<div className="space-y-2">
									<Skeleton className="h-6 w-3/4" />
									<Skeleton className="h-5 w-1/4" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
