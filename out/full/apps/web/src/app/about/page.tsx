import Image from "next/image";
import React from "react";

import { ArrowRight, Hammer, Leaf, PenTool } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { TEAM } from "@/constants";

export default function AboutPage() {
  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto animate-fade-in pb-12 space-y-8">
      {/* Hero Section */}
      <BentoCard className="min-h-[500px] relative flex flex-col justify-end p-8 md:p-16 overflow-hidden bg-black text-white group">
        <Image
          width={500}
          height={600}
          alt="background image"
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
            We craft <br /> spaces that <br /> <span className="italic font-serif">breathe.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md">
            Nestify was born from a simple idea: that furniture should be more than just functional.
            It should be a quiet companion in your daily life.
          </p>
        </div>
      </BentoCard>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard className="p-8 bg-white flex flex-col items-start gap-4 hover:bg-[#F2F2F0] transition-colors">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Leaf size={24} />
          </div>
          <h3 className="text-2xl font-bold">Sustainable Core</h3>
          <p className="text-gray-500 leading-relaxed">
            We source our wood from certified forests and use 100% recyclable packaging. We believe
            in leaving the planet better than we found it.
          </p>
        </BentoCard>

        <BentoCard className="p-8 bg-white flex flex-col items-start gap-4 hover:bg-[#F2F2F0] transition-colors">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <Hammer size={24} />
          </div>
          <h3 className="text-2xl font-bold">Master Craftsmanship</h3>
          <p className="text-gray-500 leading-relaxed">
            Each piece is hand-finished by artisans with decades of experience. We reject mass
            production in favor of lasting quality.
          </p>
        </BentoCard>

        <BentoCard className="p-8 bg-white flex flex-col items-start gap-4 hover:bg-[#F2F2F0] transition-colors">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <PenTool size={24} />
          </div>
          <h3 className="text-2xl font-bold">Timeless Design</h3>
          <p className="text-gray-500 leading-relaxed">
            Trends fade. Good design lasts forever. Our aesthetic is rooted in the principles of
            mid-century modernism and Japanese minimalism.
          </p>
        </BentoCard>
      </div>

      {/* Team Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 py-12">
          <h2 className="text-4xl font-light mb-4">
            Meet the <br /> Visionaries
          </h2>
          <p className="text-gray-500 mb-8">
            A diverse team of designers, engineers, and dreamers working together in our Stockholm
            studio.
          </p>
          <Button variant="outline">
            Join our Team{" "}
            <ArrowRight
              size={16}
              className="ml-2"
            />
          </Button>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <BentoCard
              key={member.id}
              className="group overflow-hidden bg-white"
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                  alt={member.name}
                  width={500}
                  height={600}
                  src={member.image}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg">{member.name}</h4>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {member.role}
                </p>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>

      {/* Stats Strip */}
      <BentoCard className="p-12 bg-nest-btn text-white flex flex-wrap justify-around gap-8 text-center">
        <div>
          <span className="block text-4xl md:text-5xl font-bold mb-2">12k+</span>
          <span className="text-gray-400 text-sm uppercase tracking-wider">Happy Homes</span>
        </div>
        <div>
          <span className="block text-4xl md:text-5xl font-bold mb-2">100%</span>
          <span className="text-gray-400 text-sm uppercase tracking-wider">Carbon Neutral</span>
        </div>
        <div>
          <span className="block text-4xl md:text-5xl font-bold mb-2">15</span>
          <span className="text-gray-400 text-sm uppercase tracking-wider">Design Awards</span>
        </div>
      </BentoCard>
    </div>
  );
}
