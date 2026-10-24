"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface ColorOption {
  name: string;
  value: string; // hex color code or color name
  inStock: boolean;
}

interface SizeOption {
  name: string;
  value: string;
  inStock: boolean;
}

interface VariantSelectorProps {
  colors?: ColorOption[];
  sizes?: SizeOption[];
  selectedColor?: string;
  selectedSize?: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  className?: string;
}

export default function VariantSelector({
  colors = [],
  sizes = [],
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  className = "",
}: VariantSelectorProps) {
  const [expandedColors, setExpandedColors] = useState(false);
  const [expandedSizes, setExpandedSizes] = useState(false);

  const visibleColors = expandedColors ? colors : colors.slice(0, 6);
  const visibleSizes = expandedSizes ? sizes : sizes.slice(0, 8);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Color Selector */}
      {colors.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-gray-900">Color</legend>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Select color">
            {visibleColors.map((color) => (
              <label
                key={color.value}
                className={`relative inline-flex items-center justify-center h-10 w-10 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                  color.inStock
                    ? selectedColor === color.value
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-gray-300"
                    : "border-gray-100 bg-gray-50 cursor-not-allowed"
                }`}
              >
                <input
                  type="radio"
                  name="color"
                  value={color.value}
                  checked={selectedColor === color.value}
                  onChange={() => color.inStock && onColorChange(color.value)}
                  disabled={!color.inStock}
                  className="sr-only"
                  aria-label={color.name}
                />
                <span
                  className="h-full w-full rounded-full"
                  style={{ backgroundColor: color.value.startsWith("#") ? color.value : undefined }}
                  title={color.name}
                >
                  {color.value.startsWith("#") ? null : color.value.charAt(0).toUpperCase()}
                </span>
                {selectedColor === color.value && color.inStock && (
                  <Check size={14} className="absolute text-primary" aria-hidden="true" />
                )}
                {!color.inStock && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 line-through">
                    OOS
                  </span>
                )}
              </label>
            ))}
            {colors.length > 6 && (
              <button
                type="button"
                onClick={() => setExpandedColors(!expandedColors)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                aria-expanded={expandedColors}
                aria-controls="color-list"
              >
                +{colors.length - 6}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500" aria-live="polite">
            Selected: <span className="font-medium capitalize">{selectedColor || "None"}</span>
          </p>
        </fieldset>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-gray-900">Size</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
            {visibleSizes.map((size) => (
              <label
                key={size.value}
                className={`inline-flex h-10 min-w-[44px] items-center justify-center rounded-lg border-2 px-3 text-sm font-medium cursor-pointer transition-all duration-200 ${
                  size.inStock
                    ? selectedSize === size.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                    : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  value={size.value}
                  checked={selectedSize === size.value}
                  onChange={() => size.inStock && onSizeChange(size.value)}
                  disabled={!size.inStock}
                  className="sr-only"
                  aria-label={`Size ${size.name}`}
                />
                {size.name}
                {!size.inStock && <span className="ml-1 text-xs">(OOS)</span>}
              </label>
            ))}
            {sizes.length > 8 && (
              <button
                type="button"
                onClick={() => setExpandedSizes(!expandedSizes)}
                className="inline-flex h-10 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                aria-expanded={expandedSizes}
                aria-controls="size-list"
              >
                +{sizes.length - 8}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500" aria-live="polite">
            Selected: <span className="font-medium">{selectedSize || "None"}</span>
          </p>
        </fieldset>
      )}
    </div>
  );
}