"use client";

import { useState } from "react";

import { ShieldCheck, Star, Truck } from "lucide-react";
import { toast } from "sonner";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { useCartAddItemMutation } from "@/data/cart";
import { useProudctDetailQuery } from "@/data/product";
import { useReviewListQuery } from "@/data/review";
import { authClient } from "@/lib/auth-client";

interface ProductInfoProps {
  slug: string;
}

export default function ProductInfo({ slug }: ProductInfoProps) {
  const { data: session } = authClient.useSession();
  const [activeColor, setActiveColor] = useState("#D9D9D9");
  const { mutate: addItem } = useCartAddItemMutation();

  const { data: product } = useProudctDetailQuery(slug);
  // We need review count, so we fetch review list here too?
  // Or we could rely on product.ratingCount if available?
  // The original code used:
  // const { data: productReviews } = useReviewListQuery({ ... });
  // ({productReviews.items.length})
  // I will duplicate the fetching logic for reviews count to match original behavior exactly,
  // effectively relying on the cache if ProductReviews fetches it too.
  const { data: productReviews } = useReviewListQuery({
    page: 1,
    productId: product?.id,
    sort: "newest",
  });

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (!session) {
      return toast.error("Please login to add to cart");
    }

    addItem({
      productId: product.id,
      quantity: 1,
      color: activeColor,
    });
  };

  return (
    <div className="lg:col-span-4 flex flex-col gap-4">
      <BentoCard className="p-6 bg-white flex flex-col justify-center gap-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 uppercase tracking-widest">
            {product.category?.name}
          </span>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star
              size={14}
              className="text-yellow-500 fill-yellow-500"
            />
            <span className="text-sm font-bold">
              {product.rating}{" "}
              <span className="text-gray-400 font-normal">
                ({productReviews?.items.length || 0})
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-light tracking-tighter">${product.price}</span>
          {product.isOnSale && (
            <span className="text-xl text-gray-400 line-through">
              ${Math.round(product.price * 1.5)}
            </span>
          )}
        </div>
        <p className="text-gray-600 mt-2 leading-relaxed">{product.description}</p>
      </BentoCard>

      <BentoCard className="p-6 bg-white">
        <h3 className="font-bold mb-4">Select Color</h3>
        <div className="flex gap-3 mb-8">
          {(product.colors || ["#D9D9D9", "#3A3A3A", "#8C7A6B"]).map((color, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                activeColor === color ? "border-black scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="w-full"
          >
            Download Spec Sheet
          </Button>
        </div>
      </BentoCard>

      <BentoCard className="flex-1 p-6 flex flex-col justify-center gap-4 bg-[#E8E8E6]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Truck size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Free Shipping</h4>
            <p className="text-xs text-gray-500">On orders over $200</p>
          </div>
        </div>
        <div className="w-full h-px bg-gray-300" />
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm">2 Year Warranty</h4>
            <p className="text-xs text-gray-500">Full coverage included</p>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
