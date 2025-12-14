"use client";
import React, { useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Filter, ArrowLeftRight } from "lucide-react";
import BentoCard from "@/components/ui/BentoCard";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/ui/Button";
import ModalFilter from "@/components/ModalFilter";
import { PRODUCTS } from "@/constants";
import { useShop } from "@/context/ShopContext";

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = usePathname();
  const searchParams = new URLSearchParams(location);
  const categoryParam = searchParams.get("category") || "All";
  const isSaleParam = searchParams.get("sale") === "true";

  const { filters, setCompareOpen, compareList } = useShop();

  const handleFilterEnter = () => {
    if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
    setShowFilters(true);
  };

  const handleFilterLeave = () => {
    filterTimeoutRef.current = setTimeout(() => {
      setShowFilters(false);
    }, 300);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (filters.categories.length === 0) {
      if (categoryParam !== "All" && p.category !== categoryParam) return false;
    } else {
      if (!filters.categories.includes(p.category)) return false;
    }

    if (isSaleParam && !p.isOnSale) return false;
    if (filters.onSale && !p.isOnSale) return false;
    if (filters.inStock && !p.isOnSale) return true;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;

    if (filters.materials.length > 0) {
      if (!p.material || !filters.materials.includes(p.material)) return false;
    }

    if (filters.colors.length > 0) {
      const productColors = p.colors || [];
      if (!filters.colors.some((c) => productColors.includes(c))) return false;
    }

    if (filters.rating && p.rating < filters.rating) return false;

    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
  });

  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto animate-fade-in relative">
      <div className="flex justify-between items-end mb-8 relative z-20">
        <div>
          <h1 className="text-5xl font-light mb-2">
            {filters.categories.length === 1
              ? filters.categories[0]
              : categoryParam === "All"
              ? "Shop"
              : categoryParam}{" "}
            Collection
          </h1>
          <p className="text-gray-500">
            Curated specifically for modern living.
          </p>
        </div>
        <div className="flex gap-2 relative">
          {compareList.length > 0 && (
            <Button
              onClick={() => setCompareOpen(true)}
              className="rounded-full !px-4 bg-black text-white animate-fade-in"
            >
              <ArrowLeftRight size={16} className="mr-2" /> Compare (
              {compareList.length})
            </Button>
          )}

          <div
            className="relative"
            onMouseEnter={handleFilterEnter}
            onMouseLeave={handleFilterLeave}
          >
            <Button
              variant="outline"
              className={`rounded-full !px-4 transition-colors ${
                showFilters ? "bg-black text-white border-black" : ""
              }`}
            >
              <Filter size={16} className="mr-2" /> Filters
            </Button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-2 z-[60] animate-fade-in origin-top-right">
                <ModalFilter />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} />
        ))}

        <BentoCard className="bg-black text-white p-8 flex flex-col justify-center items-center text-center col-span-1 lg:col-span-1 row-span-1 border border-gray-800">
          <h3 className="text-3xl font-light mb-4">
            Summer <br />
            Clearance
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Up to 60% off on selected items.
          </p>
          <Button className="bg-white text-black hover:bg-gray-200">
            View Sale
          </Button>
        </BentoCard>
      </div>
    </div>
  );
}
