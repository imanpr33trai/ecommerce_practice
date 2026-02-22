"use client";

import { ArrowLeftRight, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  // const displayTitle =
  //   filters.categories.length === 1
  //     ? filters.categories[0]
  //     : categoryParam === "All"
  //       ? "Shop"
  //       : categoryParam;

  // // --- 5. CONDITIONAL RENDERS ---

  if (isLoading) {
    return <LoadingSkeleton type="products" />;
  }

  if (isError || !PRODUCTS) {
    console.error("Product Load Error:", error);
    return (
      <div className="mx-auto flex min-h-screen max-w-400 flex-col items-center justify-center p-4 text-red-500 md:px-8">
        <h2 className="font-bold text-xl">Unable to load products</h2>
        <p className="mb-4 text-gray-500">{error?.message || "Unknown error occurred"}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // const products = productData.items; // Extract items from paginated response

  // --- 5. SUCCESS RENDER ---
  return (
    <div className="relative mx-auto max-w-[1600px] animate-fade-in p-4 md:px-8">
      <div className="relative z-[200] mb-8 flex items-end justify-between">
        <div>
          <h1 className="mb-2 font-light text-5xl">
            {filters.categories.length === 1
              ? filters.categories[0]
              : categoryParam === "All"
                ? "Shop"
                : categoryParam}
            Collection
          </h1>
          <p className="text-gray-500">Curated specifically for modern living.</p>
        </div>
        <div className="relative flex gap-2">
          {compareList.length > 0 && (
            <Button
              onClick={() => setCompareOpen(true)}
              className="!px-4 animate-fade-in rounded-full bg-black text-white">
              <ArrowLeftRight size={16} className="mr-2" /> Compare ({compareList.length})
            </Button>
          )}

          <div
            className="relative"
            onMouseEnter={handleFilterEnter}
            onMouseLeave={handleFilterLeave}>
            <Button
              variant="outline"
              className={`!px-4 rounded-full transition-all duration-300 ${showFilters ? "border-black bg-black text-white" : ""}`}>
              <Filter size={16} className="mr-2" /> Filters
            </Button>

            <div
              className={`absolute top-full right-0 z-[150] mt-2 origin-top-right transform transition-all duration-300 ease-premium ${
                showFilters
                  ? "pointer-events-auto visible translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
              }`}>
              <ModalFilter filters={filters} setFilters={setFilters} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.data.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        <BentoCard className="col-span-1 row-span-1 flex h-[440px] flex-col items-center justify-center border border-gray-800 bg-black p-8 text-center text-white lg:col-span-1">
          <h3 className="mb-4 font-light text-3xl">
            Summer <br />
            Clearance
          </h3>
          <p className="mb-6 text-gray-400 text-sm">Up to 60% off on selected items.</p>
          <Button className="bg-white text-black hover:bg-gray-200">View Sale</Button>
        </BentoCard>
      </div>
    </div>
  );
}
