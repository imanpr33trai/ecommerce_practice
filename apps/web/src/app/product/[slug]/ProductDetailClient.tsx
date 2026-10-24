"use client";

import { use } from "react";
import { Suspense } from "react";

import { ProductImageGallery, ProductInfo, ReviewSection } from "@/components/features/product-detail";

interface ProductDetailClientProps {
  initialData: {
    success: boolean;
    data: {
      id: string;
      name: string;
      slug: string;
      description: string;
      price: string;
      compareAtPrice: string | null;
      sku: string;
      stock: number;
      images: Array<{
        id: string;
        url: string;
        altText: string | null;
        isPrimary: boolean;
      }>;
      categoryId: string;
      brandId: string;
      isActive: boolean;
      isFeatured: boolean;
      rating: string;
      reviewCount: number;
      createdAt: string;
      updatedAt: string;
      category?: {
        id: string;
        name: string;
        slug: string;
      };
      brand?: {
        id: string;
        name: string;
        slug: string;
      };
      variants?: Array<{
        id: string;
        color: string;
        size: string;
        stock: number;
        price: string;
      }>;
      colors?: string[];
      materials?: string[];
    };
  };
}

export default function ProductDetailClient({ initialData }: ProductDetailClientProps) {
  const product = initialData.data;

  return (
    <>
      <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Product Gallery - 8 columns on lg */}
        <div className="lg:col-span-7">
          <ProductImageGallery product={product} />
        </div>

        {/* Product Info - 5 columns on lg */}
        <div className="lg:col-span-5">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Reviews Section */}
      <Suspense fallback={<div className="py-8 text-center text-gray-500">Loading reviews...</div>}>
        <ReviewSection
          productId={product.id}
          productName={product.name}
          averageRating={Number(product.rating)}
          totalReviews={product.reviewCount}
        />
      </Suspense>
    </>
  );
}