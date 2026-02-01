import type React from "react";

import { ArrowLeftRight, ArrowRight, Check } from "lucide-react";

import type { ProductSingleResponse } from "@/data/product";

import Button from "./Button";

type ModalProductCardExpandedProps = {
  product: ProductSingleResponse;
  isInCompare: boolean;
  isAdding: boolean;
  selectedColor: string;
  displayColors: string[];
  onQuickView: (e: React.MouseEvent) => void;
  onCompare: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  onSelectColor: (e: React.MouseEvent, color: string) => void;
  isExpanded: boolean;
};

const ModalProductCardExpanded: React.FC<ModalProductCardExpandedProps> = ({
  product,
  isInCompare,
  isAdding,
  selectedColor,
  displayColors,
  onQuickView,
  onCompare,
  onAddToCart,
  onSelectColor,
  isExpanded,
}) => (
  <div
    className={`flex flex-1 flex-col justify-center space-y-4 transition-all duration-1000 ease-premium ${isExpanded ? "translate-y-0 opacity-100 delay-75" : "pointer-events-none absolute bottom-0 left-0 w-full translate-y-8 p-6 opacity-0"}`}
  >
    <p className="line-clamp-2 text-gray-500 text-sm leading-relaxed">
      {product.description} Crafted with precision to elevate your living space.
    </p>

    <div className="flex gap-2">
      {/*<Button
        className="h-10 flex-1 border-none bg-gray-50 font-bold text-xs uppercase tracking-wider hover:bg-gray-100"
        onClick={onQuickView}
        size="sm"
        variant="secondary"
      >
        <Eye
          className="mr-2"
          size={14}
        />{" "}
        Quick View
      </Button>*/}
      <Button
        className={`h-10 flex-1 border-none font-bold text-xs uppercase tracking-wider ${isInCompare ? "bg-black text-white hover:bg-gray-800" : "bg-gray-50 hover:bg-gray-100"}`}
        onClick={onCompare}
        size="sm"
        variant="secondary"
      >
        <ArrowLeftRight
          className="mr-2"
          size={14}
        />{" "}
        Compare
      </Button>
    </div>

    <div>
      <span className="mb-2 block font-bold text-[10px] text-gray-400 uppercase tracking-widest">
        Available Finishes
      </span>
      <div className="flex gap-3">
        {displayColors.map((color) => (
          <Button
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-md ${selectedColor === color ? "scale-105 ring-2 ring-black ring-offset-2" : ""}`}
            key={color}
            onClick={(e) => onSelectColor(e, color)}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <Check
                className="text-white mix-blend-difference"
                size={14}
              />
            )}
          </Button>
        ))}
      </div>
    </div>

    <div className="mt-auto flex gap-3 pt-2">
      <Button
        className={`h-12 flex-1 font-bold text-sm shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${isAdding ? "bg-green-600" : "bg-black text-white hover:bg-gray-800"}`}
        onClick={onAddToCart}
      >
        {isAdding ? "Added" : "Add to Cart"}
      </Button>
      <Button
        className="h-12 border border-gray-100 px-5 hover:border-gray-300 hover:bg-gray-50"
        variant="secondary"
      >
        Details{" "}
        <ArrowRight
          className="ml-2"
          size={16}
        />
      </Button>
    </div>
  </div>
);

export default ModalProductCardExpanded;
