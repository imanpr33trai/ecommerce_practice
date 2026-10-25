"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { SearchAutocomplete, SearchFilters, SearchResults } from "@/components/features/search";
import type { ProductFilters } from "@/data/product";
import { INITIAL_FILTERS } from "@/data/product/types";

export function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialQuery = searchParams.get("q") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSort = (searchParams.get("sort") as ProductFilters["sort"]) || "newest";
  const initialMinPrice = parseInt(searchParams.get("minPrice") || "0", 10);
  const initialMaxPrice = parseInt(searchParams.get("maxPrice") || "100000", 10);
  const initialCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const initialMaterials = searchParams.get("materials")?.split(",").filter(Boolean) || [];
  const initialColors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
  const initialOnSale = searchParams.get("onSale") === "true" ? true : searchParams.get("onSale") === "false" ? false : undefined;
  const initialInStock = searchParams.get("inStock") === "true" ? true : searchParams.get("inStock") === "false" ? false : undefined;
  const initialRating = searchParams.get("rating") ? parseInt(searchParams.get("rating")!, 10) : undefined;

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<ProductFilters>({
    ...INITIAL_FILTERS,
    page: initialPage,
    limit: 20,
    sort: initialSort,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    categories: initialCategories,
    materials: initialMaterials,
    colors: initialColors,
    search: initialQuery,
    onSale: initialOnSale,
    inStock: initialInStock,
    rating: initialRating,
  });

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: Partial<ProductFilters>, newQuery?: string) => {
      const params = new URLSearchParams();

      if (newQuery !== undefined) {
        if (newQuery) params.set("q", newQuery);
      } else if (query) {
        params.set("q", query);
      }

      if (newFilters.page !== undefined && newFilters.page > 1) params.set("page", String(newFilters.page));
      if (newFilters.sort !== undefined && newFilters.sort !== "newest") params.set("sort", newFilters.sort);
      if (newFilters.minPrice !== undefined && newFilters.minPrice > 0) params.set("minPrice", String(newFilters.minPrice));
      if (newFilters.maxPrice !== undefined && newFilters.maxPrice < 100000) params.set("maxPrice", String(newFilters.maxPrice));
      if (newFilters.categories !== undefined && newFilters.categories.length > 0) params.set("categories", newFilters.categories.join(","));
      if (newFilters.materials !== undefined && newFilters.materials.length > 0) params.set("materials", newFilters.materials.join(","));
      if (newFilters.colors !== undefined && newFilters.colors.length > 0) params.set("colors", newFilters.colors.join(","));
      if (newFilters.onSale !== undefined) params.set("onSale", String(newFilters.onSale));
      if (newFilters.inStock !== undefined) params.set("inStock", String(newFilters.inStock));
      if (newFilters.rating !== undefined) params.set("rating", String(newFilters.rating));

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, query],
  );

  // Handle search submit
  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
      updateURL({ page: 1, search: searchQuery }, searchQuery);
    },
    [updateURL],
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: Partial<ProductFilters> | ((prev: ProductFilters) => ProductFilters)) => {
      setFilters((prev) => {
        const next = typeof newFilters === 'function' ? newFilters(prev) : { ...prev, ...newFilters, page: 1 };
        updateURL({ ...next, page: 1 });
        return next;
      });
    },
    [updateURL],
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
      updateURL({ page });
    },
    [updateURL],
  );

  // Sync filters with URL on initial load or when searchParams change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: initialPage,
      sort: initialSort,
      minPrice: initialMinPrice,
      maxPrice: initialMaxPrice,
      categories: initialCategories,
      materials: initialMaterials,
      colors: initialColors,
      onSale: initialOnSale,
      inStock: initialInStock,
      rating: initialRating,
      search: initialQuery,
    }));
  }, [
    initialPage,
    initialSort,
    initialMinPrice,
    initialMaxPrice,
    initialCategories,
    initialMaterials,
    initialColors,
    initialOnSale,
    initialInStock,
    initialRating,
    initialQuery,
  ]);

  return (
    <div className="mx-auto min-h-[80vh] max-w-400 animate-fade-in p-4 md:px-8">
      {/* Search Header */}
      <div className="mb-8 border-gray-100 border-b pt-4 pb-6">
        <h1 className="mb-2 font-light text-3xl">Search Results</h1>
        <p className="text-gray-500">
          Showing results for <span className="font-bold text-black">"{query}"</span>
        </p>
      </div>

      {/* Search Autocomplete */}
      <div className="mb-6">
        <SearchAutocomplete
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          placeholder="Search products..."
        />
      </div>

      {/* Main Content - Filters + Results */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <SearchFilters
            filters={filters}
            setFilters={handleFilterChange}
            searchQuery={query}
          />
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <SearchResults
            searchQuery={query}
            filters={filters}
          />
        </main>
      </div>
    </div>
  );
}

export default SearchClient;