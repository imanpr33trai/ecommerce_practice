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
      rating: prev.rating === rating ? null : rating,
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
      <div className="w-[90vw] md:w-[850px] bg-white rounded-[2rem] p-8 shadow-2xl">
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
  const categories = options?.categories || [];
  const materials = options?.materials || [];
  const colors = options?.colors || [];
  console.log("options", options);
  console.log("setFilters", setFilters);

  return (
    <div className="w-[90vw] md:w-[850px] bg-white text-nest-text rounded-[2rem] shadow-2xl border border-gray-100 p-8 flex flex-col gap-6 ring-1 ring-black/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
            Sort By
          </h3>
          <div className="space-y-3">
            {["newest", "price_asc", "price_desc", "rating"].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleSortChange(opt)}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.sort === opt ? "border-black bg-black" : "border-gray-300 group-hover:border-gray-400"}`}
                >
                  {filters.sort === opt && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-medium capitalize text-sm">{opt.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 mb-4">
              Price Range
            </h3>
            <div className="flex flex-col gap-3">
              <div className="bg-gray-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-black/10 transition-colors">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                  Min Price
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-bold mr-1">$</span>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="w-full bg-transparent text-sm font-bold outline-none text-black placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-black/10 transition-colors">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                  Max Price
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-bold mr-1">$</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="w-full bg-transparent text-sm font-bold outline-none text-black placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 mb-4">
              Availability
            </h3>
            <div className="space-y-3">
              <label
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleStockChange}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.inStock ? "bg-black border-black text-white" : "border-gray-300 group-hover:border-gray-400"}`}
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
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleSaleChange}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.onSale ? "bg-black border-black text-white" : "border-gray-300 group-hover:border-gray-400"}`}
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 mb-4">
              Categories
            </h3>
            <div className="space-y-3">
              {categories
                .filter((c) => c.name !== "All")
                .map((cat) => (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: <df>
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => handleArrayToggle("categories", cat.name)}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.categories.includes(cat.name) ? "bg-black border-black text-white" : "border-gray-300 group-hover:border-gray-400"}`}
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 mb-4">
              Materials
            </h3>
            <div className="flex flex-wrap gap-2">
              {materials.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => handleArrayToggle("materials", mat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filters.materials.includes(mat) ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-600 hover:border-black"}`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 mb-4">
              Colors
            </h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleArrayToggle("colors", color)}
                  className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 relative ${filters.colors.includes(color) ? "ring-2 ring-offset-2 ring-black" : ""}`}
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 mb-4">
              Rating
            </h3>
            <div className="space-y-3">
              {[4, 3, 2, 1].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => handleRatingChange(r)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.rating === r ? "border-black bg-black" : "border-gray-300 group-hover:border-gray-400"}`}
                  >
                    {filters.rating === r && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
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
                    <span className="text-sm text-gray-500 font-medium group-hover:text-black transition-colors">
                      & Up
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium">Use controls to refine results</span>
        <Button
          variant="secondary"
          className="bg-white border border-gray-200 hover:bg-gray-50 h-10 px-6"
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
