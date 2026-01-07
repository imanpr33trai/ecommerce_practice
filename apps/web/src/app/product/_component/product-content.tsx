"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ArrowLeftRight, Filter } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ModalFilter from "@/components/ModalFilter";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";
import { INITIAL_FILTERS, type ProductFilters, useProductListQuery } from "@/data/product";

export function ProductContent() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchParams = useSearchParams();
  const { setCompareOpen, compareList } = useShop();

  // --- 2. EFFECTS (Sync URL to State) ---
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const isSaleParam = searchParams.get("sale") === "true";
    const searchParam = searchParams.get("q");

    // We only update if URL params indicate a specific view.
    // If category is "All", we explicitly clear the categories array.
    if (categoryParam || isSaleParam || searchParam) {
      setFilters((prev) => ({
        ...prev,
        categories: categoryParam && categoryParam !== "All" ? [categoryParam] : [], // FIX: Clear if All
        onSale: isSaleParam || prev.onSale, // Keep sale if set via UI, or enforce if set via URL
        search: searchParam || prev.search,
      }));
    }
  }, [searchParams]);

  // --- 3. DATA FETCHING ---
  // Pass the filters state to the hook.
  const {
    data: PRODUCTS, // Rename to generic data object to avoid confusion
    isError,
    error,
    isLoading,
  } = useProductListQuery(filters);

  // --- 4. HANDLERS ---
  const handleFilterEnter = () => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    setShowFilters(true);
  };

  const handleFilterLeave = () => {
    filterTimeoutRef.current = setTimeout(() => {
      setShowFilters(false);
    }, 300);
  };

  // Helper variables for UI
  const categoryParam = searchParams.get("category") || "All";
  const displayTitle =
    filters.categories.length === 1
      ? filters.categories[0]
      : categoryParam === "All"
        ? "Shop"
        : categoryParam;

  // --- 5. CONDITIONAL RENDERS ---

  if (isLoading) {
    return <LoadingSkeleton type="products" />;
  }

  if (isError || !PRODUCTS) {
    console.error("Product Load Error:", error);
    return (
      <div className="p-4 md:px-8 max-w-400 mx-auto min-h-screen flex flex-col items-center justify-center text-red-500">
        <h2 className="text-xl font-bold">Unable to load products</h2>
        <p className="mb-4 text-gray-500">{error?.message || "Unknown error occurred"}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // const products = productData.items; // Extract items from paginated response

  // --- 5. SUCCESS RENDER ---
  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto animate-fade-in relative">
      <div className="flex justify-between items-end mb-8 relative z-[200]">
        <div>
          <h1 className="text-5xl font-light mb-2">
            {filters.categories.length === 1
              ? filters.categories[0]
              : categoryParam === "All"
                ? "Shop"
                : categoryParam}{" "}
            Collection
          </h1>
          <p className="text-gray-500">Curated specifically for modern living.</p>
        </div>
        <div className="flex gap-2 relative">
          {compareList.length > 0 && (
            <Button
              onClick={() => setCompareOpen(true)}
              className="rounded-full !px-4 bg-black text-white animate-fade-in"
            >
              <ArrowLeftRight
                size={16}
                className="mr-2"
              />{" "}
              Compare ({compareList.length})
            </Button>
          )}

          <div
            className="relative"
            onMouseEnter={handleFilterEnter}
            onMouseLeave={handleFilterLeave}
          >
            <Button
              variant="outline"
              className={`rounded-full !px-4 transition-all duration-300 ${showFilters ? "bg-black text-white border-black" : ""}`}
            >
              <Filter
                size={16}
                className="mr-2"
              />{" "}
              Filters
            </Button>

            <div
              className={`absolute top-full right-0 mt-2 z-[150] origin-top-right transition-all duration-300 ease-premium transform ${
                showFilters
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible"
              }`}
            >
              <ModalFilter
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PRODUCTS.items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

        <BentoCard className="bg-black text-white p-8 flex flex-col justify-center items-center text-center col-span-1 lg:col-span-1 row-span-1 border border-gray-800 h-[440px]">
          <h3 className="text-3xl font-light mb-4">
            Summer <br />
            Clearance
          </h3>
          <p className="text-gray-400 text-sm mb-6">Up to 60% off on selected items.</p>
          <Button className="bg-white text-black hover:bg-gray-200">View Sale</Button>
        </BentoCard>
      </div>
    </div>
  );
}
