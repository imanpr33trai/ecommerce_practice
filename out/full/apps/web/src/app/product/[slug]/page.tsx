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
      <div className="p-4 md:px-8 max-w-400 mx-auto pb-12 animate-fade-in">
        <Breadcrumbs />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
          <ProductGallery slug={slug} />
          <ProductInfo slug={slug} />
        </div>

        <ProductReviews slug={slug} />
        <DesignStory slug={slug} />
      </div>
    </Suspense>
  );
}
