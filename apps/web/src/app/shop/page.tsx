"use client"
import React from 'react';
import Link  from 'next/link';
import { ShoppingBag, Star, Filter } from 'lucide-react';
import BentoCard from '@/components/bento-card';
import Button from '@/components/button';
import { PRODUCTS, CATEGORIES } from '@/constants';
import { useSearchParams } from 'next/navigation';

const Shop: React.FC = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const isSale = searchParams.get('sale') === 'true';

  const filteredProducts = PRODUCTS.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (isSale && !p.isOnSale) return false;
    return true;
  });

  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto animate-slide-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl font-light mb-2">{category} Collection</h1>
          <p className="text-gray-500">Curated specifically for modern living.</p>
        </div>
        <Button variant="outline" className="rounded-full !px-4">
           <Filter size={16} className="mr-2" /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <BentoCard key={product.id} className="p-4 group min-h-[400px] flex flex-col" hoverEffect>
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 bg-gray-100">
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               />
               <Link href={`/product/${product.id}`} className="absolute inset-0 z-0" />
               
               {/* Floating Action Buttons */}
               <div className="absolute top-4 right-4 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                 <Button size="icon" className="!w-10 !h-10 shadow-md">
                    <ShoppingBag size={18} />
                 </Button>
               </div>
               
               {product.isOnSale && (
                 <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                   -{product.discount}%
                 </div>
               )}
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold">${product.price}</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                    <Star size={12} fill="currentColor" /> {product.rating}
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>
        ))}
        
        {/* Promotional Bento Card inserted in Grid */}
        <BentoCard className="bg-black text-white p-8 flex flex-col justify-center items-center text-center col-span-1 lg:col-span-1 row-span-1 border border-gray-800">
           <h3 className="text-3xl font-light mb-4">Summer <br/>Clearance</h3>
           <p className="text-gray-400 text-sm mb-6">Up to 60% off on selected items.</p>
           <Button className="bg-white text-black hover:bg-gray-200">View Sale</Button>
        </BentoCard>
      </div>
    </div>
  );
};

export default Shop;