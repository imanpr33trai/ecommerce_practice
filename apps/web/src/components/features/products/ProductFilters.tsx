"use client";

import type React from "react";

import { Check, RefreshCw, Star, X } from "lucide-react";

import { useProductFilterQuery } from "@/data/product";
import { useShop } from "@/context/ShopContext";
import Button from "@/components/Button";
import type { ProductFilters } from "@/data/product";

interface ProductFiltersProps {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}

export function ProductFilters({
  filters,
  setFilters,
}: ProductFiltersProps) {
  const { resetFilters } = useShop();
  const { data: options, isLoading } = useProductFilterQuery();

  // --- Handlers ---
  const handleSortChange = (sort: "newest" | "rating" | "price_asc" | "price_desc") => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const handleStockChange = () =>
    setFilters((prev) => ({ ...prev, inStock: !prev.inStock }));

  const handleSaleChange = () =>
    setFilters((prev) => ({ ...prev, onSale: !prev.onSale }));

  const handleArrayToggle = (
    key: "materials" | "categories" | "colors",
    value: string,
  ) => {
    setFilters((prev) => {
      const currentArray = prev[key] || [];
      const active = currentArray.includes(value);
      return {
        ...prev,
        [key]: active
          ? currentArray.filter((i) => i !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleRatingChange = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? undefined : rating,
    }));
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const num = parseInt(value) || 0;
    setFilters((prev) => ({
      ...prev,
      [type === "min" ? "minPrice" : "maxPrice"]: num,
    }));
  };

  const handleRemoveFilter = (key: "categories" | "materials" | "colors", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
  };

  const handleClearAll = () => {
    resetFilters();
    setFilters({
      page: 1,
      limit: 12,
      sort: "newest",
      minPrice: 0,
      maxPrice: 100000,
      categories: [],
      materials: [],
      colors: [],
      search: undefined,
      onSale: undefined,
      inStock: undefined,
      rating: undefined,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.colors.length > 0 ||
    filters.onSale ||
    filters.inStock ||
    filters.rating ||
    filters.minPrice > 0 ||
    filters.maxPrice < 100000;

  // --- Render ---
  if (isLoading) {
    return (
      <div className="w-full rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-4 w-20 animate-pulse bg-gray-100 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse bg-gray-100 rounded" />
                <div className="h-4 w-3/4 animate-pulse bg-gray-100 rounded" />
                <div className="h-4 w-1/2 animate-pulse bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const categories: Array<{ id: string; name: string; slug: string }> = options?.data?.categories ?? [];
  const materials: string[] = options?.data?.materials ?? [];
  const colors: string[] = options?.data?.colors ?? [];

  return (
    <div className="flex w-full flex-col gap-6 rounded-[2rem] border border-gray-100 bg-white p-8 text-nest-text shadow-2xl ring-1 ring-black/5">
      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 border-gray-100 border-b pb-4">
          <span className="font-medium text-gray-400 text-xs uppercase tracking-wider">
            Active:
          </span>
          {filters.categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
            >
              {cat}
              <button
                type="button"
                onClick={() => handleRemoveFilter("categories", cat)}
                className="text-gray-500 hover:text-black"
                aria-label={`Remove ${cat} filter`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {filters.materials.map((mat) => (
            <span
              key={mat}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
            >
              {mat}
              <button
                type="button"
                onClick={() => handleRemoveFilter("materials", mat)}
                className="text-gray-500 hover:text-black"
                aria-label={`Remove ${mat} filter`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {filters.colors.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
            >
              <span
                className="relative h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <button
                type="button"
                onClick={() => handleRemoveFilter("colors", color)}
                className="text-gray-500 hover:text-black"
                aria-label={`Remove color filter`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {filters.onSale && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
            >
              On Sale
              <button
                type="button"
                onClick={handleSaleChange}
                className="text-gray-500 hover:text-black"
                aria-label="Remove sale filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.inStock && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
            >
              In Stock
              <button
                type="button"
                onClick={handleStockChange}
                className="text-gray-500 hover:text-black"
                aria-label="Remove stock filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.rating && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
            >
              {filters.rating}★ & Up
              <button
                type="button"
                onClick={() => handleRatingChange(filters.rating!)}
                className="text-gray-500 hover:text-black"
                aria-label="Remove rating filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 100000) && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
            >
              ${filters.minPrice} - ${filters.maxPrice}
              <button
                type="button"
                onClick={() => {
                  handlePriceChange("min", "0");
                  handlePriceChange("max", "100000");
                }}
                className="text-gray-500 hover:text-black"
                aria-label="Remove price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-6">
          <h3 className="border-gray-100 border-b pb-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
            Sort By
          </h3>
          <div className="space-y-3">
            {[
              { value: "newest", label: "Newest" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "rating", label: "Top Rated" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="group flex cursor-pointer items-center gap-3"
                onClick={() => handleSortChange(opt.value as "newest" | "rating" | "price_asc" | "price_desc")}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                    filters.sort === opt.value
                      ? "border-black bg-black"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {filters.sort === opt.value && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span className="font-medium text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-4 border-gray-100 border-b pb-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
              Price Range
            </h3>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-transparent bg-gray-50 px-3 py-2 transition-colors focus-within:border-black/10">
                <span className="mb-1 block font-bold text-[10px] text-gray-400 uppercase">
                  Min Price
                </span>
                <div className="flex items-center">
                  <span className="mr-1 font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    min="0"
                    max={filters.maxPrice}
                    className="w-full bg-transparent font-bold text-black text-sm placeholder-gray-400 outline-none"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-transparent bg-gray-50 px-3 py-2 transition-colors focus-within:border-black/10">
                <span className="mb-1 block font-bold text-[10px] text-gray-400 uppercase">
                  Max Price
                </span>
                <div className="flex items-center">
                  <span className="mr-1 font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    min={filters.minPrice}
                    max="100000"
                    className="w-full bg-transparent font-bold text-black text-sm placeholder-gray-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 border-gray-100 border-b pb-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
              Availability
            </h3>
            <div className="space-y-3">
              <label
                className="group flex cursor-pointer items-center gap-3"
                onClick={handleStockChange}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                    filters.inStock
                      ? "border-black bg-black text-white"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {filters.inStock && <Check size={10} strokeWidth={4} />}
                </div>
                <span className="font-medium text-sm">In Stock Only</span>
              </label>
              <label
                className="group flex cursor-pointer items-center gap-3"
                onClick={handleSaleChange}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                    filters.onSale
                      ? "border-black bg-black text-white"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {filters.onSale && <Check size={10} strokeWidth={4} />}
                </div>
                <span className="font-medium text-sm">On Sale</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-4 border-gray-100 border-b pb-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
              Categories
            </h3>
            <div className="space-y-3">
              {categories
                .filter((c) => c.name !== "All")
                .map((cat) => (
                  <label
                    key={cat.id}
                    className="group flex cursor-pointer items-center gap-3"
                    onClick={() => handleArrayToggle("categories", cat.name)}
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        filters.categories.includes(cat.name)
                          ? "border-black bg-black text-white"
                          : "border-gray-300 group-hover:border-gray-400"
                      }`}
                    >
                      {filters.categories.includes(cat.name) && (
                        <Check size={10} strokeWidth={4} />
                      )}
                    </div>
                    <span className="font-medium text-sm">{cat.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 border-gray-100 border-b pb-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
              Materials
            </h3>
            <div className="flex flex-wrap gap-2">
              {materials.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => handleArrayToggle("materials", mat)}
                  className={`rounded-full border px-3 py-1 font-medium text-xs transition-all ${
                    filters.materials.includes(mat)
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-black"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-4 border-gray-100 border-b pb-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
              Colors
            </h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleArrayToggle("colors", color)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-transform hover:scale-110 ${
                    filters.colors.includes(color)
                      ? "ring-2 ring-black ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {filters.colors.includes(color) && (
                    <Check
                      size={14}
                      className="text-white mix-blend-difference"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 border-gray-100 border-b pb-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
              Rating
            </h3>
            <div className="space-y-3">
              {[4, 3, 2, 1].map((r) => (
                <label
                  key={r}
                  className="group flex cursor-pointer items-center gap-3"
                  onClick={() => handleRatingChange(r)}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                      filters.rating === r
                        ? "border-black bg-black"
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  >
                    {filters.rating === r && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < r ? "black" : "#E5E7EB"}
                          className={i < r ? "text-black" : "text-gray-200"}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-500 text-sm transition-colors group-hover:text-black">
                      & Up
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-gray-100 border-t pt-6">
        <span className="font-medium text-gray-400 text-xs">
          Use controls to refine results
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="h-10 border border-gray-200 bg-white px-6 hover:bg-gray-50"
            onClick={handleClearAll}
          >
            <RefreshCw size={14} className="mr-2" />{" "}
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;