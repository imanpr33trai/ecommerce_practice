"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import BentoCard from "@/components/ui/BentoCard";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { PRODUCTS } from "@/constants";
import { LayoutContext } from "@/context/LayoutContext";
import { useShop } from "@/context/ShopContext";
import { Heart, PenTool, ShieldCheck, Star, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { useContext, useState } from "react";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const { toggleCart } = useContext(LayoutContext);
  const { addToast } = useToast();
  const { addToCart, toggleWishlist, isInWishlist, cart } = useShop();

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  if (!product) return notFound();
  const [activeColor, setActiveColor] = useState(
    product.colors?.[0] || "#D9D9D9"
  );

  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = () => {
    toggleWishlist(product);
    addToast(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      isWishlisted ? "info" : "success"
    );
  };

  const handleAddToCart = () => {
    const existingItem = cart.find((item) => item.id === product.id);
    addToCart(product, activeColor);
    toggleCart();

    if (existingItem) {
      addToast(`Quantity updated for ${product.name}`, "info");
    } else {
      addToast(`Added ${product.name} to cart`, "success");
    }
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto pb-12 animate-fade-in">
      <Breadcrumbs />
      {/* <Link href={{pathname:"/product"}} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
        <ArrowLeft size={16} /> Back to Collection
      </Link> */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
        <BentoCard className="lg:col-span-8 min-h-[500px] lg:h-[650px] bg-[#F4F4F4] relative group overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <button
            onClick={handleWishlist}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Heart
              size={24}
              className={`transition-colors duration-300 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
            />
          </button>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          </div>
        </BentoCard>

        <div className="lg:col-span-4 flex flex-col gap-4 ">
          <BentoCard className="p-6 bg-white flex flex-col justify-center gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold">{product.rating}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light tracking-tighter">
                ${product.price}
              </span>
              {product.isOnSale && (
                <span className="text-xl text-gray-400 line-through">
                  ${Math.round(product.price * 1.5)}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </BentoCard>

          <BentoCard className="p-6 bg-white">
            <h3 className="font-bold mb-4">Select Color</h3>
            <div className="flex gap-3 mb-8">
              {(product.colors || ["#D9D9D9", "#3A3A3A", "#8C7A6B"]).map(
                (color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      activeColor === color
                        ? "border-black scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                )
              )}
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
      </div>

      <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            <PenTool size={14} />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
              The Design Story
            </span>
          </div>
          <h2 className="text-4xl font-light leading-tight">
            Crafted with intention. <br /> Built for longevity.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            The {product.name} isn't just a piece of furniture; it's a statement
            of minimalist philosophy. Designed in our Stockholm studio, every
            curve serves a purpose. We sourced the finest materials to ensure
            that it doesn't just look good on day one, but develops a rich
            patina over years of use.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="font-bold text-2xl mb-1">100%</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Sustainable Wood
              </p>
            </div>
            <div>
              <h4 className="font-bold text-2xl mb-1">300+</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Hours of Craft
              </p>
            </div>
          </div>
        </div>
        <div className="h-[500px] rounded-[2rem] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1200"
            alt="Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-light mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
