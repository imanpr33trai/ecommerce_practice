'use client';

import { Grid } from 'lucide-react';
import { CardContent, CardHeader, CardTitle } from '@comp/card';
import { FrostedCard } from '@/_components/client/FrostedCard';
import { ProductCard, ProductCardSkeleton } from '@/_components/client/ProductCard';
import { type ProductDetailed, type ProductForCategoryGrid } from '@/utils/typesClient';
import { api, trpc } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { useProduct } from '@/hooks/useProduct';


interface RelatedProductsSectionProps {
    product: ProductDetailed;
}

export const RelatedProductsSection = ({ product }: RelatedProductsSectionProps) => {
    // MOCK DATA: In a real app, you would fetch related products via tRPC.
    // This could be based on category, tags, or a dedicated recommendation engine.
    // Example: api.product.getRelated({ categoryId: product.categoryId, excludeProductId: product.id })

    const { data: relatedProducts, isLoading, isError } = useProduct.getRelated({
        categoryId: product.categoryId || undefined,
        excludeProductId: product.id,
        limit: 4,
    })// Using getAll as a placeholder

    return (
        <FrostedCard>
            <CardHeader className="flex flex-row items-center gap-3">
                <Grid className="h-6 w-6 text-white" />
                <CardTitle className="text-2xl text-white">You might also like</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : isError ? (
                    <p className="text-red-500">Could not load related products.</p>
                ) : relatedProducts && relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map((relatedProduct: ProductForCategoryGrid) => (
                            <ProductCard key={relatedProduct.id} item={relatedProduct} />
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-300">No related products found.</p>
                )}
            </CardContent>
        </FrostedCard>
    );
};