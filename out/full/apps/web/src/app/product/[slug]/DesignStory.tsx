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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-16 border-t border-gray-100">
      <div className="space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
          <PenTool size={14} />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            The Design Story
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-light leading-tight">
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
            <h4 className="font-bold text-3xl mb-1">100%</h4>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              Sustainable Wood
            </p>
          </div>
          <div>
            <h4 className="font-bold text-3xl mb-1">300+</h4>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              Hours of Craft
            </p>
          </div>
        </div>
      </div>
      <div className="h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
        <ImageWithSkeleton
          src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1200"
          alt="Craftsmanship"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
