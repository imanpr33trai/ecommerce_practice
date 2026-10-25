"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type React from "react";

import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, RefreshCcw, ShieldCheck, Star, Truck } from "lucide-react";

import Image from "next/image";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import { REVIEWS, TEAM } from "@/constants";
import { useShop } from "@/context/ShopContext";
import {
  type GetProductListRequest,
  type ProductSingleResponse,
  type ProductLandingResponse,
  useProductLandingQuery,
} from "@/data/product";
import { FeaturedProducts, Hero, CategoryGrid, LandingFooter } from "@/components/features/landing";

interface TrustBadge {
  icon: React.ElementType;
  id: number;
  title: string;
  desc: string;
}

const TRUST_BADGES: TrustBadge[] = [
  { icon: Truck, id: 1, title: "Free Shipping", desc: "On all orders over $200" },
  { icon: ShieldCheck, id: 2, title: "Secure Payment", desc: "100% secure payment methods" },
  { icon: RefreshCcw, id: 3, title: "30 Days Return", desc: "If goods have problems" },
];

const CATEGORIES = [
  { name: "Modern Sofas", slug: "Sofa", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200", colSpan: 2 },
  { name: "Lighting", slug: "Lamps", image: "https://images.unsplash.com/photo-1507473888900-52e1ad14db3d?auto=format&fit=crop&q=80&w=600" },
  { name: "Chairs", slug: "Chair", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600" },
];

const FEATURED_SLIDERS = [
  { title: "Living Room Comfort", subtitle: "Relax in style with our premium sofas and chairs.", categoryLink: "/products?category=Sofa", viewTransitionName: "slider-living-room" },
  { title: "Workspace & Lighting", subtitle: "Illuminate your ideas with our curated collection.", categoryLink: "/products?category=Table", viewTransitionName: "slider-workspace" },
];

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHeroWishlisted, setIsHeroWishlisted] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { recentlyViewed } = useShop();

  const filters: GetProductListRequest["query"] = {
    sort: "newest",
  };

  const { data: productData } = useProductLandingQuery(filters);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);

    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Type-safe access to product items
  const data = productData?.data?.items ?? [];

  const featuredProduct = data[currentSlide % data.length] ?? data[0];

  if (!featuredProduct) {
    return null;
  }

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % data.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + data.length) % data.length);

  // Subtle parallax offsets
  const parallaxText = scrollPos * 0.15;
  const parallaxImage = scrollPos * 0.05;

  return (
    <div className="mx-auto max-w-[1600px] animate-fade-in space-y-16 p-4 pb-8 md:px-8">
      {/* Hero Section */}
      <div className="grid h-auto grid-cols-1 gap-4 lg:h-[600px] lg:grid-cols-12">
        <Hero product={featuredProduct} />

        <BentoCard
          className="group relative flex flex-col justify-between overflow-hidden bg-black p-8 text-white lg:col-span-4"
        >
          <div className="relative z-10">
            <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">
              Limited Offer
            </span>
            <h2 className="mt-4 mb-2 font-light text-4xl">
              Summer <br />
              Sale
            </h2>
            <p className="max-w-50 text-gray-400 text-sm">Get up to 50% off on selected items.</p>
          </div>
          <div className="relative z-10 mt-8">
            <Link
              href={{
                pathname: "/product",
                query: "sale=true",
              }}
            >
              <Button variant="secondary" className="w-full justify-between group-hover:pl-8">
                Shop Sale <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gray-800 opacity-50 blur-3xl transition-opacity group-hover:opacity-70"></div>
        </BentoCard>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TRUST_BADGES.map((item) => (
          <BentoCard key={item.id} className="flex items-center gap-4 bg-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-50">
              <item.icon size={24} className="text-black" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{item.title}</h3>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </div>
          </BentoCard>
        ))}
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <FeaturedProducts
          title="Recently Viewed"
          subtitle="Pick up where you left off."
          products={recentlyViewed}
          categoryLink="/product"
          viewTransitionName="slider-recently-viewed"
        />
      )}

      {/* Category Grid */}
      <CategoryGrid categories={CATEGORIES} />

      {/* Featured Product Sliders */}
      {FEATURED_SLIDERS.map((slider) => (
        <FeaturedProducts
          key={slider.viewTransitionName}
          title={slider.title}
          subtitle={slider.subtitle}
          products={data}
          categoryLink={slider.categoryLink}
          viewTransitionName={slider.viewTransitionName}
        />
      ))}

      {/* Reviews & Careers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <BentoCard className="flex flex-col justify-center bg-white p-8 md:col-span-8">
          <h3 className="mb-8 font-light text-2xl">What our customers say</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {REVIEWS.slice(0, 2).map((review) => (
              <div key={review.id} className="rounded-3xl bg-gray-50 p-6">
                <div className="mb-3 flex gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(review.rating) ? "currentColor" : "none"}
                      className={i < Math.floor(review.rating) ? "" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="mb-4 text-gray-600 text-sm leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <Image
                    alt="review"
                    width={100}
                    height={200}
                    src={review.avatar}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-xs">{review.name}</div>
                    <div className="text-[10px] text-gray-400">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
        <BentoCard className="group relative flex cursor-pointer flex-col justify-between overflow-hidden bg-[#C6BAA8] p-8 text-black md:col-span-4">
          <div className="relative z-10">
            <span className="rounded-full border border-black/20 px-3 py-1 font-bold text-xs uppercase tracking-wider">
              Careers
            </span>
            <h3 className="mt-4 font-medium text-3xl leading-tight">
              Join the <br />
              craft.
            </h3>
            <p className="mt-4 max-w-[150px] text-sm opacity-80">We are looking for designers.</p>
          </div>
          <div className="relative z-10 mt-8 flex items-center justify-between">
            <div className="flex -space-x-3">
              {TEAM.map((member) => (
                <Image
                  alt={member.name}
                  key={member.id}
                  width={100}
                  height={200}
                  src={member.image}
                  className="h-10 w-10 rounded-full border-2 border-[#C6BAA8] object-cover"
                />
              ))}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="text-white" />
            </div>
          </div>
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        </BentoCard>
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}