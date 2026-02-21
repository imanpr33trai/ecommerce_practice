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
        className="absolute inset-0 animate-fade-in bg-black/40 backdrop-blur-sm"
        onClick={() => setCompareOpen(false)}
      />
      <div className="relative flex h-[85vh] w-full max-w-6xl animate-slide-up flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-gray-100 border-b p-6">
          <h2 className="font-light text-2xl">
            Compare Products <span className="text-gray-400">({compareList.length})</span>
          </h2>
          <button
            onClick={() => setCompareOpen(false)}
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {compareList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
              <span className="text-4xl">⚖️</span>
            </div>
            <h3 className="mb-2 font-bold text-xl">No products to compare</h3>
            <p className="mb-6 text-gray-500">
              Add products to the comparison list to see them side by side.
            </p>
            <Button onClick={() => setCompareOpen(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-8">
            <div className="grid min-w-[800px] grid-cols-1 md:grid-cols-4">
              <div className="col-span-1 hidden space-y-8 pt-[320px] pr-8 md:block">
                <div className="flex h-12 items-center font-bold text-gray-500">Price</div>
                <div className="flex h-12 items-center font-bold text-gray-500">Rating</div>
                <div className="flex h-12 items-center font-bold text-gray-500">Category</div>
                <div className="flex h-24 items-center font-bold text-gray-500">Description</div>
                <div className="flex h-12 items-center font-bold text-gray-500">Materials</div>
                <div className="flex h-12 items-center font-bold text-gray-500">Action</div>
              </div>

              {compareList.map((product) => (
                <div
                  key={product.id}
                  className="group relative col-span-1 border-gray-100 border-l px-6 first:border-l-0"
                >
                  <Button
                    onClick={() => removeFromCompare(product.id)}
                    variant={"outline"}
                    className="group absolute top-0 right-6 z-1000 rounded-full bg-gray-100 p-2 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2
                      size={16}
                      className=""
                    />
                  </Button>

                  <div className="mb-8 h-[280px] overflow-hidden rounded-2xl bg-gray-50">
                    <Image
                      alt={product.name}
                      width={100}
                      height={100}
                      src={product.images.at(0)?.url || "no Image"}
                      className="h-full w-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <h3 className="mb-8 truncate font-bold text-xl">{product.name}</h3>

                  <div className="space-y-8">
                    <div className="flex h-12 items-center border-gray-50 border-b font-medium text-xl md:border-b-0">
                      <span className="w-24 font-bold text-gray-400 text-sm md:hidden">Price:</span>{" "}
                      ${product.price}
                    </div>
                    <div className="flex h-12 items-center border-gray-50 border-b md:border-b-0">
                      <span className="w-24 font-bold text-gray-400 text-sm md:hidden">
                        Rating:
                      </span>{" "}
                      ⭐ {product.rating}
                    </div>
                    <div className="flex h-12 items-center border-gray-50 border-b md:border-b-0">
                      <span className="w-24 font-bold text-gray-400 text-sm md:hidden">
                        Category:
                      </span>{" "}
                      {product.category?.name}
                    </div>
                    <div className="flex h-auto items-center border-gray-50 border-b py-2 text-gray-500 text-sm leading-relaxed md:h-24 md:border-b-0 md:py-0">
                      {product.description}
                    </div>
                    <div className="flex h-12 items-center border-gray-50 border-b md:border-b-0">
                      <span className="w-24 font-bold text-gray-400 text-sm md:hidden">
                        Material:
                      </span>{" "}
                      Solid Wood / Fabric
                    </div>
                    <div className="flex h-12 items-center pt-4">
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
