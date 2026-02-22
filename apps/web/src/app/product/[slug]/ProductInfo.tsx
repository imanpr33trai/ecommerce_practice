"use client";

import { ShieldCheck, Star, Truck } from "lucide-react";
import { useState } from "react";
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
  const { data: productReviews } = useReviewListQuery(product?.id, {
    page: "1",

    sort: "newest",
  });

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
    <div className="flex flex-col gap-4 lg:col-span-4">
      <BentoCard className="flex flex-col justify-center gap-2 bg-white p-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm uppercase tracking-widest">
            {product.category?.name}
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-2 py-1">
            <Star size={14} className="fill-yellow-500 text-yellow-500" />
            <span className="font-bold text-sm">
              {product.rating}{" "}
              <span className="font-normal text-gray-400">
                ({productReviews?.data.items.length || 0})
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-light text-5xl tracking-tighter">${product.price}</span>
          {product.isOnSale && (
            <span className="text-gray-400 text-xl line-through">
              ${Math.round(product.price * 1.5)}
            </span>
          )}
        </div>
        <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>
      </BentoCard>

      <BentoCard className="bg-white p-6">
        <h3 className="mb-4 font-bold">Select Color</h3>
        <div className="mb-8 flex gap-3">
          {(product.colors || ["#D9D9D9", "#3A3A3A", "#8C7A6B"]).map((color, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveColor(color)}
              className={`h-10 w-10 rounded-full border-2 transition-all duration-200 ${
                activeColor === color ? "scale-110 border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button variant="outline" className="w-full">
            Download Spec Sheet
          </Button>
        </div>
      </BentoCard>

      <BentoCard className="flex flex-1 flex-col justify-center gap-4 bg-[#E8E8E6] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <Truck size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Free Shipping</h4>
            <p className="text-gray-500 text-xs">On orders over $200</p>
          </div>
        </div>
        <div className="h-px w-full bg-gray-300" />
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm">2 Year Warranty</h4>
            <p className="text-gray-500 text-xs">Full coverage included</p>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
