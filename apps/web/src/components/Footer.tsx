import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import BentoCard from './ui/BentoCard';
import Button from './ui/Button';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 md:px-8 max-w-[1600px] mx-auto mt-12 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        <BentoCard className="md:col-span-6 lg:col-span-5 !bg-black text-white p-8 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 mb-6">
               <div className="w-8 h-8 bg-white rounded-full grid place-items-center">
                   <span className="text-black text-sm font-bold">N</span>
               </div>
               <span className="font-bold text-xl tracking-tight">Nestify</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4">
              Crafting minimal spaces for modern minds.
            </h2>
          </div>
          <div className="flex gap-4 mt-auto">
             <Button variant="icon" className="!bg-white/10 !text-white hover:!bg-white/20">
                <Instagram size={20} />
             </Button>
             <Button variant="icon" className="!bg-white/10 !text-white hover:!bg-white/20">
                <Twitter size={20} />
             </Button>
             <Button variant="icon" className="!bg-white/10 !text-white hover:!bg-white/20">
                <Facebook size={20} />
             </Button>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-3 lg:col-span-2 bg-white p-8">
           <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">Shop</span>
           <div className="flex flex-col gap-4 font-medium text-gray-600">
              <Link href="/products" className="hover:text-black transition-colors">All Products</Link>
              <Link href="/products?category=Sofa" className="hover:text-black transition-colors">Sofas</Link>
              <Link href="/products?category=Chair" className="hover:text-black transition-colors">Chairs</Link>
              <Link href="/products?category=Table" className="hover:text-black transition-colors">Tables</Link>
              <Link href="/products?category=Lamps" className="hover:text-black transition-colors">Lighting</Link>
           </div>
        </BentoCard>

        <BentoCard className="md:col-span-3 lg:col-span-2 bg-white p-8">
           <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">Company</span>
           <div className="flex flex-col gap-4 font-medium text-gray-600">
              <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
              <Link href="#" className="hover:text-black transition-colors">Shipping</Link>
              <Link href="#" className="hover:text-black transition-colors">Returns</Link>
              <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
           </div>
        </BentoCard>

        <BentoCard className="md:col-span-12 lg:col-span-3 bg-[#E8E8E6] p-8 flex flex-col justify-center">
           <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Stay Updated</span>
           <h3 className="text-2xl font-bold mb-4">Join our newsletter for 10% off.</h3>
           <div className="flex flex-col gap-3">
             <input
               type="email"
               placeholder="Enter your email"
               className="w-full bg-white rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
             />
             <Button className="w-full justify-between group">
                Subscribe <ArrowUpRight size={16} className="group-hover:translate-x-1 transition-transform"/>
             </Button>
           </div>
        </BentoCard>

        <div className="md:col-span-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 px-4">
           <span>&copy; 2024 Nestify Inc. All rights reserved.</span>
           <div className="flex gap-4 mt-2 md:mt-0">
             <span>Designed with Bento Grids</span>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;