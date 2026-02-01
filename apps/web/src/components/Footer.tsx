import Link from "next/link";
import type React from "react";

import { ArrowUpRight, Facebook, Instagram, Twitter } from "lucide-react";

import BentoCard from "./BentoCard";
import Button from "./Button";

const Footer: React.FC = () => {
  return (
    <footer className="z-0 mx-auto mt-12 max-w-[1600px] p-4 pb-8 md:px-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <BentoCard className="!bg-black flex min-h-[300px] flex-col justify-between p-8 text-white md:col-span-6 lg:col-span-5">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white">
                <span className="font-bold text-black text-sm">N</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Nestify</span>
            </div>
            <h2 className="mb-4 font-light text-4xl leading-tight tracking-tight md:text-5xl">
              Crafting minimal spaces for modern minds.
            </h2>
          </div>
          <div className="mt-auto flex gap-4">
            <Button
              variant="icon"
              className="!bg-white/10 !text-white hover:!bg-white/20"
            >
              <Instagram size={20} />
            </Button>
            <Button
              variant="icon"
              className="!bg-white/10 !text-white hover:!bg-white/20"
            >
              <Twitter size={20} />
            </Button>
            <Button
              variant="icon"
              className="!bg-white/10 !text-white hover:!bg-white/20"
            >
              <Facebook size={20} />
            </Button>
          </div>
        </BentoCard>

        <BentoCard className="bg-white p-8 md:col-span-3 lg:col-span-2">
          <span className="mb-6 block font-bold text-gray-400 text-xs uppercase tracking-wider">
            Shop
          </span>
          <div className="flex flex-col gap-4 font-medium text-gray-600">
            <Link
              href="/product"
              className="transition-colors hover:text-black"
            >
              All Products
            </Link>
            <Link
              href="/product?category=Sofa"
              className="transition-colors hover:text-black"
            >
              Sofas
            </Link>
            <Link
              href="/product?category=Chair"
              className="transition-colors hover:text-black"
            >
              Chairs
            </Link>
            <Link
              href="/product?category=Table"
              className="transition-colors hover:text-black"
            >
              Tables
            </Link>
            <Link
              href="/product?category=Lamps"
              className="transition-colors hover:text-black"
            >
              Lighting
            </Link>
          </div>
        </BentoCard>

        <BentoCard className="bg-white p-8 md:col-span-3 lg:col-span-2">
          <span className="mb-6 block font-bold text-gray-400 text-xs uppercase tracking-wider">
            Company
          </span>
          <div className="flex flex-col gap-4 font-medium text-gray-600">
            <Link
              href={{ pathname: "/about" }}
              className="transition-colors hover:text-black"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-black"
            >
              Shipping
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-black"
            >
              Returns
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-black"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-black"
            >
              Terms of Service
            </Link>
          </div>
        </BentoCard>

        <BentoCard className="flex flex-col justify-center bg-[#E8E8E6] p-8 md:col-span-12 lg:col-span-3">
          <span className="mb-4 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            Stay Updated
          </span>
          <h3 className="mb-4 font-bold text-2xl">Join our newsletter for 10% off.</h3>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-full bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
            <Button className="group w-full justify-between">
              Subscribe{" "}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </div>
        </BentoCard>

        <div className="flex flex-col items-center justify-between px-4 text-gray-400 text-xs md:col-span-12 md:flex-row">
          <span>&copy; 2024 Nestify Inc. All rights reserved.</span>
          <div className="mt-2 flex gap-4 md:mt-0">
            <span>Designed with Bento Grids</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
