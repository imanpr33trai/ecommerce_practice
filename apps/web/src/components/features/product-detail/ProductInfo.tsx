"use client";

import { Truck, ShieldCheck, RotateCcw, Star } from "lucide-react";

import VariantSelector from "./VariantSelector";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: string | number;
    compareAtPrice: string | number | null;
    sku: string;
    stock: number;
    rating: string | number;
    reviewCount: number;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    brand?: {
      id: string;
      name: string;
      slug: string;
    };
    colors?: string[];
    materials?: string[];
    variants?: Array<{
      id: string;
      color: string;
      size: string;
      stock: number;
      price: string;
    }>;
  };
  isWishlisted?: boolean;
}

export default function ProductInfo({ product, isWishlisted = false }: ProductInfoProps) {
  // Parse variants into color/size options
  const colorMap = new Map<string, { inStock: boolean; count: number }>();
  const sizeMap = new Map<string, { inStock: boolean; count: number }>();

  product.variants?.forEach((variant) => {
    // Colors
    if (variant.color) {
      const existing = colorMap.get(variant.color) || { inStock: false, count: 0 };
      existing.inStock = existing.inStock || variant.stock > 0;
      existing.count += variant.stock;
      colorMap.set(variant.color, existing);
    }
    // Sizes
    if (variant.size) {
      const existing = sizeMap.get(variant.size) || { inStock: false, count: 0 };
      existing.inStock = existing.inStock || variant.stock > 0;
      existing.count += variant.stock;
      sizeMap.set(variant.size, existing);
    }
  });

  // Fallback to product.colors if no variants
  const colorOptions = colorMap.size > 0
    ? Array.from(colorMap.entries()).map(([value, data]) => ({
        name: value,
        value,
        inStock: data.inStock,
      }))
    : (product.colors || []).map((color, index) => ({
        name: `Color ${index + 1}`,
        value: color,
        inStock: product.stock > 0,
      }));

  const sizeOptions = sizeMap.size > 0
    ? Array.from(sizeMap.entries()).map(([value, data]) => ({
        name: value,
        value,
        inStock: data.inStock,
      }))
    : [];

  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const compareAtPrice = product.compareAtPrice
    ? typeof product.compareAtPrice === "string"
      ? parseFloat(product.compareAtPrice)
      : product.compareAtPrice
    : null;

  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discountPercentage = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Category & Rating */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {product.category && (
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {product.category.name}
            </Link>
          )}
          {product.brand && (
            <>
              <span className="text-gray-300">/</span>
              <Link
                href={`/shop?brand=${product.brand.slug}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {product.brand.name}
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Star size={16} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span className="font-semibold text-sm">
            {Number(product.rating).toFixed(1)}
            <span className="font-normal text-gray-400 ml-1">({product.reviewCount})</span>
          </span>
        </div>
      </div>

      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight md:text-4xl">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
        {isOnSale && compareAtPrice && (
          <>
            <span className="text-xl text-gray-400 line-through">${compareAtPrice.toFixed(2)}</span>
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
              -{discountPercentage}%
            </span>
          </>
        )}
        {product.sku && (
          <span className="text-sm text-gray-500 ml-auto">SKU: {product.sku}</span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.stock > 0 ? (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
            In Stock ({product.stock} available)
          </span>
        ) : (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Description */}
      <div className="prose prose-sm max-w-none text-gray-600">
        <p className="whitespace-pre-wrap">{product.description}</p>
      </div>

      {/* Variant Selector */}
      {(colorOptions.length > 0 || sizeOptions.length > 0) && (
        <VariantSelector
          colors={colorOptions}
          sizes={sizeOptions}
          onColorChange={() => {}}
          onSizeChange={() => {}}
        />
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium text-gray-900">
          Quantity
        </label>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            className="h-12 w-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Decrease quantity"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            id="quantity"
            defaultValue={1}
            min={1}
            max={product.stock}
            className="w-16 h-12 text-center border-none focus:outline-none text-lg font-medium"
            aria-label="Quantity"
          />
          <button
            type="button"
            className="h-12 w-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Increase quantity"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          disabled={product.stock === 0}
        />
        <WishlistButton
          productId={product.id}
          productName={product.name}
          isWishlisted={isWishlisted}
          variant="default"
        />
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <RotateCcw size={18} aria-hidden="true" />
          <span>30-Day Returns</span>
        </button>
        <button type="button" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Secure Payment</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shrink-0">
            <Truck size={18} className="text-gray-600" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Free Shipping</h4>
            <p className="text-sm text-gray-500">On orders over $200</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shrink-0">
            <ShieldCheck size={18} className="text-gray-600" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">2 Year Warranty</h4>
            <p className="text-sm text-gray-500">Full coverage included</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shrink-0">
            <RotateCcw size={18} className="text-gray-600" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Easy Returns</h4>
            <p className="text-sm text-gray-500">30-day hassle-free returns</p>
          </div>
        </div>
      </div>

      {/* Share */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-900">Share:</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Share on Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </button>
            <button
              type="button"
              className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Share on Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </button>
            <button
              type="button"
              className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Share on Pinterest"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.573 22.882 10.763 23 12 23c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </button>
            <button
              type="button"
              className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Copy link"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import Link
import Link from "next/link";