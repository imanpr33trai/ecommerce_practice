import Image from "next/image";
import Link from "next/link";
import type React from "react";

import { ArrowRight } from "lucide-react";

import BentoCard from "@/components/BentoCard";

interface Category {
  name: string;
  slug: string;
  image: string;
  colSpan?: number;
}

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div data-testid="category-grid" className="grid min-h-100 grid-cols-1 gap-4 md:grid-cols-3">
      {categories.map((category, index) => (
        <BentoCard
          key={category.slug}
          className={`group relative overflow-hidden ${
            category.colSpan ? `md:col-span-${category.colSpan}` : ""
          }`}
        >
          <Image
            alt={category.name}
            width={100}
            height={200}
            src={category.image}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"></div>
          <div className="absolute bottom-6 left-6 rounded-3xl bg-white/90 px-6 py-4 backdrop-blur">
            <h3 className="mb-1 font-bold text-xl">{category.name}</h3>
            <Link
              href={{
                pathname: "/product",
                query: `category=${category.slug}`,
              }}
              className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider hover:underline"
            >
              Explore Collection{" "}
              <ArrowRight size={12} />
            </Link>
          </div>
        </BentoCard>
      ))}
    </div>
  );
};

export default CategoryGrid;