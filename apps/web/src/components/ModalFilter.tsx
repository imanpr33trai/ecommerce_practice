/** biome-ignore-all lint/a11y/noLabelWithoutControl: <df> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
"use client";

import type React from "react";

import { Skeleton } from "@comp/skeleton";
import { Check, RefreshCw, Star } from "lucide-react";

import { useShop } from "@/context/ShopContext";
import { type ProductFilters, useProductFilterQuery } from "@/data/product";

import Button from "./Button";

interface ModalFilterProps {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}

const ModalFilter: React.FC<ModalFilterProps> = ({ filters, setFilters }) => {
  // Fetch dynamic options (Facets)
  const { resetFilters } = useShop();
  const { data: options, isLoading } = useProductFilterQuery();

  // --- Handlers (Now using props) ---

  const handleSortChange = (sort: any) => setFilters((prev) => ({ ...prev, sort }));

  const handleStockChange = () => setFilters((prev) => ({ ...prev, inStock: !prev.inStock }));

  const handleSaleChange = () => setFilters((prev) => ({ ...prev, onSale: !prev.onSale }));

  const handleArrayToggle = (key: "materials" | "categories" | "colors", value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] || []; // Safety check
      const active = currentArray.includes(value);
      return {
        ...prev,
        [key]: active ? currentArray.filter((i) => i !== value) : [...currentArray, value],
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

  // --- Render ---

  if (isLoading) {
    return (
      <div className="w-[90vw] rounded-[2rem] bg-white p-8 shadow-2xl md:w-[850px]">
        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="space-y-4"
            >
              <Skeleton className="h-4 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback if options failed to load
  const categories = options?.data.categories || [];
  const materials = options?.data.materials || [];
  const colors = options?.data.colors || [];
  console.log("options", options);
  console.log("setFilters", setFilters);

  return (
    <div className="flex w-[90vw] flex-col gap-6 rounded-[2rem] border border-gray-100 bg-white p-8 text-nest-text shadow-2xl ring-1 ring-black/5 md:w-[850px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-6">
          <h3 className="border-gray-100 border-b pb-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
            Sort By
          </h3>
          <div className="space-y-3">
            {["newest", "price_asc", "price_desc", "rating"].map((opt) => (
              <label
                key={opt}
                className="group flex cursor-pointer items-center gap-3"
                onClick={() => handleSortChange(opt)}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${filters.sort === opt ? "border-black bg-black" : "border-gray-300 group-hover:border-gray-400"}`}
                >
                  {filters.sort === opt && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-medium text-sm capitalize">{opt.replace("_", " ")}</span>
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
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${filters.inStock ? "border-black bg-black text-white" : "border-gray-300 group-hover:border-gray-400"}`}
                >
                  {filters.inStock && (
                    <Check
                      size={10}
                      strokeWidth={4}
                    />
                  )}
                </div>
                <span className="font-medium text-sm">In Stock Only</span>
              </label>
              <label
                className="group flex cursor-pointer items-center gap-3"
                onClick={handleSaleChange}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${filters.onSale ? "border-black bg-black text-white" : "border-gray-300 group-hover:border-gray-400"}`}
                >
                  {filters.onSale && (
                    <Check
                      size={10}
                      strokeWidth={4}
                    />
                  )}
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
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${filters.categories.includes(cat.name) ? "border-black bg-black text-white" : "border-gray-300 group-hover:border-gray-400"}`}
                    >
                      {filters.categories.includes(cat.name) && (
                        <Check
                          size={10}
                          strokeWidth={4}
                        />
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
                  className={`rounded-full border px-3 py-1 font-medium text-xs transition-all ${filters.materials.includes(mat) ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-600 hover:border-black"}`}
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
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-transform hover:scale-110 ${filters.colors.includes(color) ? "ring-2 ring-black ring-offset-2" : ""}`}
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
                    className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${filters.rating === r ? "border-black bg-black" : "border-gray-300 group-hover:border-gray-400"}`}
                  >
                    {filters.rating === r && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
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
        <span className="font-medium text-gray-400 text-xs">Use controls to refine results</span>
        <Button
          variant="secondary"
          className="h-10 border border-gray-200 bg-white px-6 hover:bg-gray-50"
          onClick={resetFilters}
        >
          <RefreshCw
            size={14}
            className="mr-2"
          />{" "}
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ModalFilter;
