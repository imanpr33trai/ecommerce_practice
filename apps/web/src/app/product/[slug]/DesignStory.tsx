"use client";

import { PenTool } from "lucide-react";

import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { useProudctDetailQuery } from "@/data/product";

interface DesignStoryProps {
  slug: string;
}

export default function DesignStory({ slug }: DesignStoryProps) {
  const { data: product } = useProudctDetailQuery(slug);

  if (!product) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 items-center gap-8 border-gray-100 border-t pt-16 md:grid-cols-2">
      <div className="space-y-6 px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1">
          <PenTool size={14} />
          <span className="font-bold text-gray-600 text-xs uppercase tracking-wider">
            The Design Story
          </span>
        </div>
        <h2 className="font-light text-4xl leading-tight md:text-5xl">
          Crafted with intention. <br /> Built for longevity.
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          The {product.name} isn't just a piece of furniture; it's a statement of minimalist
          philosophy. Designed in our Stockholm studio, every curve serves a purpose. We sourced the
          finest materials to ensure that it doesn't just look good on day one, but develops a rich
          patina over years of use.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <h4 className="mb-1 font-bold text-3xl">100%</h4>
            <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">
              Sustainable Wood
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-bold text-3xl">300+</h4>
            <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">
              Hours of Craft
            </p>
          </div>
        </div>
      </div>
      <div className="h-[500px] overflow-hidden rounded-[3rem] shadow-2xl md:h-[600px]">
        <ImageWithSkeleton
          src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1200"
          alt="Craftsmanship"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
