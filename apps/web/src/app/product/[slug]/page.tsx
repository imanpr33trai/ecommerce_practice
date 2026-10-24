import { Suspense } from "react";
import { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ProductDetailClient from "./ProductDetailClient";
import { prefetchProductDetail } from "@/hooks/queries/useProductDetailQuery";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  // We could fetch product here for metadata, but let's keep it simple
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: "View product details and purchase",
  };
}

async function getProductData(slug: string) {
  try {
    const data = await prefetchProductDetail(slug);
    return data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // Prefetch product data on the server
  const initialData = await getProductData(slug);

  if (!initialData) {
    // The not-found.tsx will handle this
    return null;
  }

  return (
    <Suspense fallback={<LoadingSkeleton type="detail" />}>
      <div className="mx-auto max-w-7xl animate-fade-in p-4 pb-12 md:px-8">
        <Breadcrumbs />

        <ProductDetailClient initialData={initialData} />
      </div>
    </Suspense>
  );
}