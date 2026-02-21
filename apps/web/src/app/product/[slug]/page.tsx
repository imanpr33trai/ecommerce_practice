import { Suspense } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import LoadingSkeleton from "@/components/LoadingSkeleton";

import DesignStory from "./DesignStory";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductReviews from "./ProductReviews";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<LoadingSkeleton type="detail" />}>
      <div className="mx-auto max-w-400 animate-fade-in p-4 pb-12 md:px-8">
        <Breadcrumbs />

        <div className="mb-16 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <ProductGallery slug={slug} />
          <ProductInfo slug={slug} />
        </div>

        <ProductReviews slug={slug} />
        <DesignStory slug={slug} />
      </div>
    </Suspense>
  );
}
