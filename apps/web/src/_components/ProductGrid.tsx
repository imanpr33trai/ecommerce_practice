const ProductGrid = ({
	categoryName,
	products,
	isLoading,
	onClearFilter,
}: {
	categoryName: string;
	products: any[] | undefined; // Use your actual ProductListItem type here
	isLoading: boolean;
	onClearFilter: () => void;
}) => (
	<div className="mt-4 animate-fade-in">
		<div className="mb-8 flex items-center justify-between">
			<h2 className="font-bold text-3xl">
				Showing results for:{" "}
				<span className="text-primary">{categoryName}</span>
			</h2>
			<Button
				variant="ghost"
				onClick={onClearFilter}
				className="flex items-center gap-2"
			>
				Clear Filter <X className="h-4 w-4" />
			</Button>
		</div>
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{isLoading
				? Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="flex flex-col space-y-3">
							<Skeleton className="h-[250px] w-full rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-5 w-1/4" />
							</div>
							<Skeleton className="h-10 w-full" />
						</div>
					))
				: products?.map((product) => (
						// You can re-use the ProductCard component from a previous step
						<ProductCard key={product.id} product={product} />
					))}
		</div>
	</div>
);
