"use client";

import Image from "next/image";
import React from "react";

import { ShoppingBag, Star, X } from "lucide-react";
import { toast } from "sonner";


import { LayoutContext } from "../context/LayoutContext";
import { useShop } from "../context/ShopContext";
import Button from "./ui/Button";

const ModalQuickView: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useShop();

  const { toggleCart } = React.useContext(LayoutContext);

  if (!quickViewProduct) {
    return null;
  }

  const handleAddToCart = () => {
    toast.success(`Added ${quickViewProduct.name} to cart`);
    toggleCart();
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => setQuickViewProduct(null)}
      />
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-slide-up flex flex-col md:flex-row h-[80vh] md:h-auto">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-1/2 bg-gray-50 h-1/2 md:h-auto min-h-[400px]">
          <Image
            src={quickViewProduct.images.at(0)?.url}
            alt={quickViewProduct.name}
            width={100} height={100}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
          <div className="mb-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">{quickViewProduct.category?.name}</span>
            <h2 className="text-3xl font-bold mb-2">{quickViewProduct.name}</h2>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-medium">${quickViewProduct.price}</span>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star
                  size={16}
                  fill="currentColor"
                />
                <span className="font-bold text-sm text-black">{quickViewProduct.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{quickViewProduct.description} This piece exemplifies our commitment to sustainable luxury and timeless design.</p>

            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-3">Color</span>
              <div className="flex gap-3">
                {["#D9D9D9", "#3A3A3A", "#8C7A6B"].map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-100">
            <Button
              className="flex-1 h-14"
              onClick={handleAddToCart}
            >
              Add to Cart{" "}
              <ShoppingBag
                size={18}
                className="ml-2"
              />
            </Button>
            <Button
              variant="secondary"
              className="h-14 px-8"
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalQuickView;
