"use client";

import type React from "react";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Heart,
  RefreshCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** Wrap a DOM update in a View Transition when the browser supports it. */
function withViewTransition(callback: () => void) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    (document as any).startViewTransition(callback);
  } else {
    callback();
  }
}

import Image from "next/image";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import { REVIEWS, TEAM } from "@/constants";
import { useShop } from "@/context/ShopContext";
import {
  type GetProductListRequest,
  type ProductSingleResponse,
  useProductLandingQuery,
} from "@/data/product";

// import type { Product } from "../types";

interface ProductSliderProps {
  title: string;
  subtitle: string;
  products: ProductSingleResponse[];
  categoryLink: string;
  viewTransitionName?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  subtitle,
  products,
  categoryLink,
  viewTransitionName,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 320;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * 1;

      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll =
        direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="group relative animate-slide-up space-y-6"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={viewTransitionName ? { viewTransitionName } : undefined}>
      <div className="flex items-end justify-between px-2">
        <div>
          <h2 className="font-light text-3xl">{title}</h2>
          <p className="mt-1 text-gray-500 text-sm">{subtitle}</p>
        </div>
        <Link href={{ pathname: categoryLink }}>
          <Button variant="outline" size="sm" className="rounded-full">
            View Collection
          </Button>
        </Link>
      </div>

      <Button
        variant="icon"
        onClick={() => scroll("left")}
        className="absolute top-[55%] left-0 z-20 -ml-5 hidden -translate-y-1/2 border border-gray-100 bg-white text-black opacity-0 shadow-xl transition-all duration-300 hover:scale-110 group-hover:opacity-100 md:flex">
        <ArrowLeft size={20} />
      </Button>

      <Button
        variant="icon"
        onClick={() => scroll("right")}
        className="absolute top-[55%] right-0 z-20 -mr-5 hidden -translate-y-1/2 border border-gray-100 bg-white text-black opacity-0 shadow-xl transition-all duration-300 hover:scale-110 group-hover:opacity-100 md:flex">
        <ArrowRight size={20} />
      </Button>

      <div
        ref={scrollRef}
        className="no-scrollbar -mx-2 flex snap-x items-start gap-4 overflow-x-auto scroll-smooth p-2 pt-4 pb-8"
        style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}>
        {products.map((product) => (
          <div key={product.id} className="min-w-75 shrink-0 snap-center md:min-w-85">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function LandingPage() {
  // --- 1. ALL HOOKS CALLED UNCONDITIONALLY AT TOP ---
  const [isLoading, setIsLoading] = useState(true);

  const [isHeroWishlisted, setIsHeroWishlisted] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { recentlyViewed } = useShop();

  const filters: GetProductListRequest["query"] = {
    sort: "newest",
  };

  // Call each hook individually - NEVER conditionally
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

  // --- 2. DATA EXTRACTION (after hooks) ---
  // Handle loading states
  // if (isLoading || isLandingLoading) {
  //   return <LoadingSkeleton type="home" />;
  // }

  // if (!data) {
  //   return <h1>products is undefined or null</h1>;
  // }

  const data = productData.data.items;

  const featuredProduct = data[currentSlide % data.length] || data[0];

  if (!featuredProduct) {
    console.log("featuredProduct is null or undefined");
    return;
  }

  const nextSlide = () => withViewTransition(() => setCurrentSlide((p) => (p + 1) % data.length));
  const prevSlide = () =>
    withViewTransition(() => setCurrentSlide((p) => (p - 1 + data.length) % data.length));

  // Subtle parallax offsets
  const parallaxText = scrollPos * 0.15;
  const parallaxImage = scrollPos * 0.05;

  return (
    <div
      className="mx-auto max-w-[1600px] animate-fade-in space-y-16 p-4 pb-8 md:px-8"
      style={{ viewTransitionName: "landing-page" }}>
      <div
        className="grid h-auto grid-cols-1 gap-4 lg:h-[600px] lg:grid-cols-12"
        style={{ viewTransitionName: "hero-grid" }}>
        <BentoCard className="group relative flex flex-col justify-center overflow-hidden bg-[#F2F2F0] lg:col-span-8">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-bold text-[12vw] text-white uppercase leading-none tracking-tighter transition-transform duration-150 ease-out"
            style={{ transform: `translate(-50%, calc(-50% + ${parallaxText}px))` }}>
            Nestify
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-around gap-8 p-8 md:flex-row md:p-12">
            <div className="max-w-md flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-3 py-1 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                <span className="font-bold text-gray-600 text-xs uppercase tracking-wider">
                  New Arrival
                </span>
              </div>

              <h1
                className="font-light text-4xl leading-[1.1] tracking-tight md:text-6xl"
                style={{ viewTransitionName: "hero-title" }}>
                {featuredProduct.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="font-medium text-2xl" style={{ viewTransitionName: "hero-price" }}>
                  ${featuredProduct.price}
                </span>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold text-black">{featuredProduct.rating}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href={`/product/${featuredProduct.slug}`} className="flex-1">
                  <Button className="h-12 w-full px-8!">View Product</Button>
                </Link>
                <Button
                  variant="icon"
                  className="h-12 w-12 bg-white transition-transform hover:bg-white/80 active:scale-90"
                  onClick={() => setIsHeroWishlisted(!isHeroWishlisted)}>
                  <Heart
                    size={20}
                    className={`transition-colors duration-300 ${isHeroWishlisted ? "fill-red-500 text-red-500" : "text-black"}`}
                  />
                </Button>
              </div>
            </div>

            <div
              className="relative aspect-square w-full max-w-[400px] flex-1 transition-transform duration-150 ease-out"
              style={{ transform: `translateY(${parallaxImage}px)` }}>
              <div className="absolute inset-0 scale-75 transform rounded-full bg-white/40 blur-3xl"></div>
              <Image
                width={100}
                height={200}
                src={"/images/caroline.jpg"}
                alt={featuredProduct.name}
                className="relative h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ viewTransitionName: "hero-image" }}
              />
            </div>
          </div>

          <div className="absolute right-6 bottom-6 flex gap-2">
            <Button variant="secondary" size="icon" onClick={prevSlide}>
              <ArrowLeft size={20} />
            </Button>
            <Button variant="primary" size="icon" onClick={nextSlide}>
              <ArrowRight size={20} />
            </Button>
          </div>
        </BentoCard>

        <BentoCard
          className="group relative flex flex-col justify-between overflow-hidden bg-black p-8 text-white lg:col-span-4"
          style={{ viewTransitionName: "summer-sale" }}>
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
              }}>
              <Button variant="secondary" className="w-full justify-between group-hover:pl-8">
                Shop Sale <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gray-800 opacity-50 blur-3xl transition-opacity group-hover:opacity-70"></div>
        </BentoCard>
      </div>

      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
        style={{ viewTransitionName: "trust-badges" }}>
        {[
          { icon: Truck, id: 1, title: "Free Shipping", desc: "On all orders over $200" },
          {
            icon: ShieldCheck,
            id: 2,
            title: "Secure Payment",
            desc: "100% secure payment methods",
          },
          { icon: RefreshCcw, id: 3, title: "30 Days Return", desc: "If goods have problems" },
        ].map((item) => (
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

      {recentlyViewed.length > 0 && (
        <ProductSlider
          title="Recently Viewed"
          subtitle="Pick up where you left off."
          products={recentlyViewed}
          categoryLink="/product"
          viewTransitionName="slider-recently-viewed"
        />
      )}

      <div
        className="grid min-h-100 grid-cols-1 gap-4 md:grid-cols-3"
        style={{ viewTransitionName: "category-grid" }}>
        <BentoCard className="group relative overflow-hidden bg-[#E8E8E6] md:col-span-2">
          <Image
            alt="Modern sofas"
            width={100}
            height={200}
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"></div>
          <div className="absolute bottom-6 left-6 rounded-3xl bg-white/90 px-6 py-4 backdrop-blur">
            <h3 className="mb-1 font-bold text-xl">Modern Sofas</h3>
            <Link
              href={{
                pathname: "/product",
                query: "category=Sofa",
              }}
              className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider hover:underline">
              Explore Collection <ArrowRight size={12} />
            </Link>
          </div>
        </BentoCard>
        <div className="flex flex-col gap-4">
          <BentoCard className="group relative flex-1 overflow-hidden bg-white">
            <Image
              alt="Lighting"
              width={100}
              height={200}
              src="https://images.unsplash.com/photo-1507473888900-52e1ad14db3d?auto=format&fit=crop&q=80&w=600"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 font-bold text-xs shadow-sm">
              Lighting
            </div>
            <Link
              href={{
                pathname: "/product",
                query: "category=Lamps",
              }}
              className="absolute inset-0"
            />
          </BentoCard>
          <BentoCard className="group relative flex-1 overflow-hidden bg-white">
            <Image
              alt="Chairs"
              width={100}
              height={200}
              src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 font-bold text-xs shadow-sm">
              Chairs
            </div>
            <Link
              href={{
                pathname: "/product",
                query: "category=Chair",
              }}
              className="absolute inset-0"
            />
          </BentoCard>
        </div>
      </div>

      <ProductSlider
        title="Living Room Comfort"
        subtitle="Relax in style with our premium sofas and chairs."
        products={data}
        categoryLink="/products?category=Sofa"
        viewTransitionName="slider-living-room"
      />
      <ProductSlider
        title="Workspace & Lighting"
        subtitle="Illuminate your ideas with our curated collection."
        products={data}
        categoryLink="/products?category=Table"
        viewTransitionName="slider-workspace"
      />

      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-12"
        style={{ viewTransitionName: "reviews-section" }}>
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
        <BentoCard
          className="group relative flex cursor-pointer flex-col justify-between overflow-hidden bg-[#C6BAA8] p-8 text-black md:col-span-4"
          style={{ viewTransitionName: "careers-card" }}>
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
    </div>
  );
}
