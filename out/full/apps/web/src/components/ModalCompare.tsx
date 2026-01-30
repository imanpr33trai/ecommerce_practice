"use client";

import Image from "next/image";
import type React from "react";

import { Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { useShop } from "../context/ShopContext";
import Button from "./Button";

const ModalCompare: React.FC = () => {
  const { compareList, isCompareOpen, setCompareOpen, removeFromCompare } = useShop();

  if (!isCompareOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => setCompareOpen(false)}
      />
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden animate-slide-up flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-light">
            Compare Products <span className="text-gray-400">({compareList.length})</span>
          </h2>
          <button
            onClick={() => setCompareOpen(false)}
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {compareList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">⚖️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No products to compare</h3>
            <p className="text-gray-500 mb-6">
              Add products to the comparison list to see them side by side.
            </p>
            <Button onClick={() => setCompareOpen(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 min-w-[800px]">
              <div className="col-span-1 pr-8 space-y-8 pt-[320px] hidden md:block">
                <div className="h-12 flex items-center font-bold text-gray-500">Price</div>
                <div className="h-12 flex items-center font-bold text-gray-500">Rating</div>
                <div className="h-12 flex items-center font-bold text-gray-500">Category</div>
                <div className="h-24 flex items-center font-bold text-gray-500">Description</div>
                <div className="h-12 flex items-center font-bold text-gray-500">Materials</div>
                <div className="h-12 flex items-center font-bold text-gray-500">Action</div>
              </div>

              {compareList.map((product) => (
                <div
                  key={product.id}
                  className="col-span-1 border-l border-gray-100 px-6 first:border-l-0 relative group"
                >
                  <Button
                    onClick={() => removeFromCompare(product.id)}
                    variant={"outline"}
                    className="absolute top-0 right-6 p-2 z-1000 group bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2
                      size={16}
                      className=""
                    />
                  </Button>

                  <div className="h-[280px] bg-gray-50 rounded-2xl mb-8 overflow-hidden">
                    <Image
                      alt={product.name}
                      width={100}
                      height={100}
                      src={product.images.at(0)?.url || "no Image"}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-8 truncate">{product.name}</h3>

                  <div className="space-y-8">
                    <div className="h-12 flex items-center text-xl font-medium md:border-b-0 border-b border-gray-50">
                      <span className="md:hidden font-bold w-24 text-gray-400 text-sm">Price:</span>{" "}
                      ${product.price}
                    </div>
                    <div className="h-12 flex items-center md:border-b-0 border-b border-gray-50">
                      <span className="md:hidden font-bold w-24 text-gray-400 text-sm">
                        Rating:
                      </span>{" "}
                      ⭐ {product.rating}
                    </div>
                    <div className="h-12 flex items-center md:border-b-0 border-b border-gray-50">
                      <span className="md:hidden font-bold w-24 text-gray-400 text-sm">
                        Category:
                      </span>{" "}
                      {product.category?.name}
                    </div>
                    <div className="h-auto md:h-24 flex items-center text-sm text-gray-500 leading-relaxed md:border-b-0 border-b border-gray-50 py-2 md:py-0">
                      {product.description}
                    </div>
                    <div className="h-12 flex items-center md:border-b-0 border-b border-gray-50">
                      <span className="md:hidden font-bold w-24 text-gray-400 text-sm">
                        Material:
                      </span>{" "}
                      Solid Wood / Fabric
                    </div>
                    <div className="h-12 flex items-center pt-4">
                      <Button
                        className="w-full text-sm"
                        onClick={() => toast.success("Added to cart")}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalCompare;
