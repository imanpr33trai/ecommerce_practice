"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ArrowLeftRight, Filter } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { ProductFilters as ProductFiltersComponent, ProductGrid } from "@/components/features/products";
import { useShop } from "@/context/ShopContext";
import { INITIAL_FILTERS, type ProductFilters } from "@/data/product";
import { useProductsQuery } from "@/hooks/queries/useProductsQuery";

export function ProductListingClient({
  initialData,
}: {
  initialData: {
    data: Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
      price: string;
      compareAtPrice: string | null;
      sku: string;
      stock: number;
      images: string[];
      categoryId: string;
      brandId: string;
      isActive: boolean;
      isFeatured: boolean;
      rating: string;
      reviewCount: number;
      createdAt: string;
      updatedAt: string;
      category?: {
        id: string;
        name: string;
        slug: string;
      };
      brand?: {
        id: string;
        name: string;
        slug: string;
      };
      variants?: Array<{
        id: string;
        color: string;
        size: string;
        stock: number;
        price: string;
      }>;
    }>;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  } | null;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { setCompareOpen, compareList } = useShop();

  // --- Sync URL to State ---
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const isSaleParam = searchParams.get("sale") === "true";
    const searchParam = searchParams.get("q");
    const sortParam = searchParams.get("sort") as
      | "newest"
      | "rating"
      | "price_asc"
      | "price_desc"
      | null;

    if (categoryParam || isSaleParam || searchParam || sortParam) {
      setFilters((prev: ProductFilters) => ({
        ...prev,
        categories: categoryParam && categoryParam !== "All" ? [categoryParam] : [],
        onSale: isSaleParam || prev.onSale,
        search: searchParam || prev.search,
        sort: sortParam || prev.sort,
      }));
    }
  }, [searchParams]);

  // --- Sync Filters to URL ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.categories.length > 0) params.set("category", filters.categories[0]!);
    if (filters.onSale) params.set("sale", "true");
    if (filters.search) params.set("q", filters.search);
    params.set("sort", filters.sort);
    if (filters.page > 1) params.set("page", String(filters.page));
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, pathname, router]);

  // --- Data Fetching ---
  const {
    data: productsData,
    isError,
    error,
    isLoading,
    isPlaceholderData,
  } = useProductsQuery(filters);

  // Use initial data on first render, then switch to query data
  const displayData = initialData && !isPlaceholderData ? initialData : productsData;

  // --- Handlers ---
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

  const handlePageChange = (page: number) => {
    setFilters((prev: ProductFilters) => ({ ...prev, page }));
  };

  // --- Helpers ---
  const categoryParam = searchParams.get("category") || "All";
  const displayTitle =
    filters.categories.length === 1
      ? filters.categories[0]
      : categoryParam === "All"
        ? "Shop"
        : categoryParam;

  // --- Conditional Renders ---
  if (isLoading && !initialData) {
    return <LoadingSkeleton type="products" />;
  }

  if (isError || !displayData) {
    console.error("Product Load Error:", error);
    return (
      <div className="mx-auto flex min-h-screen max-w-400 flex-col items-center justify-center p-4 text-red-500 md:px-8">
        <h2 className="font-bold text-xl">Unable to load products</h2>
        <p className="mb-4 text-gray-500">{error?.message || "Unknown error occurred"}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const products = displayData.data;
  const { total, page, limit, totalPages } = displayData.meta;

  // --- Success Render ---
  return (
    <div className="relative mx-auto max-w-[1600px] animate-fade-in p-4 md:px-8">
      <div className="relative z-[200] mb-8 flex items-end justify-between">
        <div>
          <h1 className="mb-2 font-light text-5xl">
            {displayTitle} Collection
          </h1>
          <p className="text-gray-500">
            {total} product{total !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="relative flex gap-2">
          {compareList.length > 0 && (
            <Button
              onClick={() => setCompareOpen(true)}
              className="!px-4 animate-fade-in rounded-full bg-black text-white"
            >
              <ArrowLeftRight size={16} className="mr-2" />{" "}
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
              className={`!px-4 rounded-full transition-all duration-300 ${
                showFilters ? "border-black bg-black text-white" : ""
              }`}
            >
              <Filter size={16} className="mr-2" />{" "}
              Filters
            </Button>

            <div
              className={`absolute top-full right-0 z-[150] mt-2 origin-top-right transform transition-all duration-300 ease-premium w-[90vw] max-w-[850px] ${
                showFilters
                  ? "pointer-events-auto visible translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
              }`}
            >
              <ProductFiltersComponent
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductGrid products={products} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "primary" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                  className="h-10 w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
        </div>
      )}

      {/* Bento Card */}
      <BentoCard className="mt-10 col-span-1 row-span-1 flex h-[440px] flex-col items-center justify-center border border-gray-800 bg-black p-8 text-center text-white lg:col-span-1">
        <h3 className="mb-4 font-light text-3xl">
          Summer <br />
          Clearance
        </h3>
        <p className="mb-6 text-gray-400 text-sm">Up to 60% off on selected items.</p>
        <Button className="bg-white text-black hover:bg-gray-200">View Sale</Button>
      </BentoCard>
    </div>
  );
}

export default ProductListingClient;
