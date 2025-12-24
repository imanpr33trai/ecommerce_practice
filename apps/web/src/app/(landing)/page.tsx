"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useRef, useState } from "react";
import type React from "react";

import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, RefreshCcw, ShieldCheck, Star, Truck } from "lucide-react";

import { Product, type ProductSingle } from "@/feature/product";
import { useProduct } from "@/hooks/useProduct";

import ProductCard from "../../components/ProductCard";
import BentoCard from "../../components/ui/BentoCard";
import Button from "../../components/ui/Button";
import { REVIEWS, TEAM } from "../../constants";
import { useShop } from "../../context/ShopContext";

// import type { Product } from "../types";

interface ProductSliderProps {
  title: string;
  subtitle: string;
  products: ProductSingle[];
  categoryLink: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, subtitle, products, categoryLink }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 320;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * 1;

      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="space-y-6 animate-slide-up relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-light">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <Link href={categoryLink}>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            View Collection
          </Button>
        </Link>
      </div>

      <Button
        variant="icon"
        onClick={() => scroll("left")}
        className="absolute left-0 top-[55%] -translate-y-1/2 z-20 -ml-5 shadow-xl bg-white text-black border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex hover:scale-110"
      >
        <ArrowLeft size={20} />
      </Button>

      <Button
        variant="icon"
        onClick={() => scroll("right")}
        className="absolute right-0 top-[55%] -translate-y-1/2 z-20 -mr-5 shadow-xl bg-white text-black border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex hover:scale-110"
      >
        <ArrowRight size={20} />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-8 pt-4 snap-x p-2 -mx-2 scroll-smooth items-start"
        style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[300px] md:min-w-[340px] snap-center shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {

  // --- 1. ALL HOOKS CALLED UNCONDITIONALLY AT TOP ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroWishlisted, setIsHeroWishlisted] = useState(false);
  const { recentlyViewed } = useShop();

  // Call each hook individually - NEVER conditionally
  const { data, isLoading } = Product.hooks.useLandingData();
  // const exclusiveDealsQ = Product.hooks.exclusiveDeals();
  // const greatValueQ = Product.hooks.greatValue();
  // const allProductsQ = Product.hooks.allProducts();

  // --- 2. DATA EXTRACTION (after hooks) ---
  // Handle loading states
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  // const newDeals = newDealsQ.data || [];
  // const exclusiveDeals = exclusiveDealsQ.data || [];
  // const greatValue = greatValueQ.data || [];
  // const allProducts = allProductsQ.data || [];

  if (!data) {
    return <h1>products is undefined or null</h1>;
  }

  const featuredProduct = data[currentSlide % data.length] || data[0];

  if(!featuredProduct){
    console.log("featuredProduct is null or undefined")
    return;
  }

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % data.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + data.length) % data.length);

  // const livingRoomProducts = data.filter((p) => ["Sofa", "Chair", "Bed"].includes(p.category?.name || "not"));
  // const workspaceProducts = data.filter((p) => ["Table", "Lamps", "Dressers"].includes(p.category?.name || "not"));

  return (
    <div className="p-4 md:px-8 pb-8 space-y-16 max-w-[1600px] mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[600px]">
        <BentoCard className="lg:col-span-8 relative bg-[#F2F2F0] flex flex-col justify-center overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-bold text-white uppercase tracking-tighter leading-none select-none">Nestify</div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-around h-full p-8 md:p-12 gap-8">
            <div className="flex-1 space-y-6 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/50">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">New Arrival</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]">{featuredProduct.name}</h1>

              <div className="flex items-center gap-4">
                <span className="text-2xl font-medium">${featuredProduct.price}</span>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star
                    size={16}
                    fill="currentColor"
                  />
                  <span className="text-black font-bold">{featuredProduct.rating}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Link
                  href={`/product/${featuredProduct.id}`}
                  className="flex-1"
                >
                  <Button className="w-full !px-8 h-12">View Product</Button>
                </Link>
                <Button
                  variant="icon"
                  className="bg-white hover:bg-white/80 h-12 w-12 transition-transform active:scale-90"
                  onClick={() => setIsHeroWishlisted(!isHeroWishlisted)}
                >
                  <Heart
                    size={20}
                    className={`transition-colors duration-300 ${isHeroWishlisted ? "fill-red-500 text-red-500" : "text-black"}`}
                  />
                </Button>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-[400px] aspect-square">
              <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl transform scale-75"></div>
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="relative w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={prevSlide}
            >
              <ArrowLeft size={20} />
            </Button>
            <Button
              variant="primary"
              size="icon"
              onClick={nextSlide}
            >
              <ArrowRight size={20} />
            </Button>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-4 bg-black text-white p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Limited Offer</span>
            <h2 className="text-4xl font-light mt-4 mb-2">
              Summer <br />
              Sale
            </h2>
            <p className="text-gray-400 text-sm max-w-[200px]">Get up to 50% off on selected items.</p>
          </div>
          <div className="relative z-10 mt-8">
            <Link href="/products?sale=true">
              <Button
                variant="secondary"
                className="w-full justify-between group-hover:pl-8"
              >
                Shop Sale <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gray-800 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
        </BentoCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Truck, title: "Free Shipping", desc: "On all orders over $200" },
          { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment methods" },
          { icon: RefreshCcw, title: "30 Days Return", desc: "If goods have problems" },
        ].map((item, idx) => (
          <BentoCard
            key={idx}
            className="p-6 flex items-center gap-4 bg-white"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <item.icon
                size={24}
                className="text-black"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </BentoCard>
        ))}
      </div>

      {recentlyViewed.length > 0 && (
        <ProductSlider
          title="Recently Viewed"
          subtitle="Pick up where you left off."
          products={recentlyViewed}
          categoryLink="/products"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[400px]">
        <BentoCard className="md:col-span-2 relative group overflow-hidden bg-[#E8E8E6]">
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-6 py-4 rounded-3xl">
            <h3 className="text-xl font-bold mb-1">Modern Sofas</h3>
            <Link
              href="/products?category=Sofa"
              className="text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              Explore Collection <ArrowRight size={12} />
            </Link>
          </div>
        </BentoCard>
        <div className="flex flex-col gap-4">
          <BentoCard className="flex-1 relative group overflow-hidden bg-white">
            <img
              src="https://images.unsplash.com/photo-1507473888900-52e1ad14db3d?auto=format&fit=crop&q=80&w=600"
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Lighting</div>
            <Link
              href="/products?category=Lamps"
              className="absolute inset-0"
            />
          </BentoCard>
          <BentoCard className="flex-1 relative group overflow-hidden bg-white">
            <img
              src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600"
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Chairs</div>
            <Link
              href="/products?category=Chair"
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
      />
      <ProductSlider
        title="Workspace & Lighting"
        subtitle="Illuminate your ideas with our curated collection."
        products={data}
        categoryLink="/products?category=Table"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <BentoCard className="md:col-span-8 p-8 bg-white flex flex-col justify-center">
          <h3 className="text-2xl font-light mb-8">What our customers say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.slice(0, 2).map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 p-6 rounded-3xl"
              >
                <div className="flex gap-1 text-yellow-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(review.rating) ? "currentColor" : "none"}
                      className={i < Math.floor(review.rating) ? "" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold">{review.name}</div>
                    <div className="text-[10px] text-gray-400">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
        <BentoCard className="md:col-span-4 p-8 bg-[#C6BAA8] text-black flex flex-col justify-between group cursor-pointer relative overflow-hidden">
          <div className="relative z-10">
            <span className="border border-black/20 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">Careers</span>
            <h3 className="text-3xl font-medium mt-4 leading-tight">
              Join the <br />
              craft.
            </h3>
            <p className="text-sm mt-4 opacity-80 max-w-[150px]">We are looking for designers.</p>
          </div>
          <div className="relative z-10 flex items-center justify-between mt-8">
            <div className="flex -space-x-3">
              {TEAM.map((member) => (
                <img
                  key={member.id}
                  src={member.image}
                  className="w-10 h-10 rounded-full border-2 border-[#C6BAA8] object-cover"
                />
              ))}
            </div>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="text-white" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </BentoCard>
      </div>
    </div>
  );
}
