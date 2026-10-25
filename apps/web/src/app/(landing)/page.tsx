import type { Metadata } from "next";
import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { productLandingOptions } from "@/data/product";
import { createQueryClient } from "@/lib/query-client";

import LandingPage from "./LandingPage";

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: "Nestify - Crafting Minimal Spaces for Modern Minds",
  description: "Discover premium furniture and home decor. Modern sofas, chairs, tables, and lighting designed for minimal spaces. Free shipping on orders over $200.",
  openGraph: {
    title: "Nestify - Crafting Minimal Spaces for Modern Minds",
    description: "Discover premium furniture and home decor. Modern sofas, chairs, tables, and lighting designed for minimal spaces.",
    type: "website",
    locale: "en_US",
    url: "https://nestify.example.com",
    siteName: "Nestify",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Nestify - Modern Furniture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nestify - Crafting Minimal Spaces for Modern Minds",
    description: "Discover premium furniture and home decor for modern spaces.",
    images: ["/images/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery(productLandingOptions({ limit: "20", page: "1" }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingSkeleton type="home" />}>
        <LandingPage />
      </Suspense>
    </HydrationBoundary>
  );
}