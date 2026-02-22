import { ArrowRight, Hammer, Leaf, PenTool } from "lucide-react";
import Image from "next/image";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { TEAM } from "@/constants";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1600px] animate-fade-in space-y-8 p-4 pb-12 md:px-8">
      {/* Hero Section */}
      <BentoCard className="group relative flex min-h-[500px] flex-col justify-end overflow-hidden bg-black p-8 text-white md:p-16">
        <Image
          width={500}
          height={600}
          alt="background image"
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2000"
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="relative z-10 max-w-2xl">
          <h1 className="mb-6 font-light text-5xl leading-tight md:text-7xl">
            We craft <br /> spaces that <br /> <span className="font-serif italic">breathe.</span>
          </h1>
          <p className="max-w-md text-gray-300 text-lg">
            Nestify was born from a simple idea: that furniture should be more than just functional.
            It should be a quiet companion in your daily life.
          </p>
        </div>
      </BentoCard>

      {/* Values Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <BentoCard className="flex flex-col items-start gap-4 bg-white p-8 transition-colors hover:bg-[#F2F2F0]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Leaf size={24} />
          </div>
          <h3 className="font-bold text-2xl">Sustainable Core</h3>
          <p className="text-gray-500 leading-relaxed">
            We source our wood from certified forests and use 100% recyclable packaging. We believe
            in leaving the planet better than we found it.
          </p>
        </BentoCard>

        <BentoCard className="flex flex-col items-start gap-4 bg-white p-8 transition-colors hover:bg-[#F2F2F0]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <Hammer size={24} />
          </div>
          <h3 className="font-bold text-2xl">Master Craftsmanship</h3>
          <p className="text-gray-500 leading-relaxed">
            Each piece is hand-finished by artisans with decades of experience. We reject mass
            production in favor of lasting quality.
          </p>
        </BentoCard>

        <BentoCard className="flex flex-col items-start gap-4 bg-white p-8 transition-colors hover:bg-[#F2F2F0]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <PenTool size={24} />
          </div>
          <h3 className="font-bold text-2xl">Timeless Design</h3>
          <p className="text-gray-500 leading-relaxed">
            Trends fade. Good design lasts forever. Our aesthetic is rooted in the principles of
            mid-century modernism and Japanese minimalism.
          </p>
        </BentoCard>
      </div>

      {/* Team Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="py-12 lg:col-span-4">
          <h2 className="mb-4 font-light text-4xl">
            Meet the <br /> Visionaries
          </h2>
          <p className="mb-8 text-gray-500">
            A diverse team of designers, engineers, and dreamers working together in our Stockholm
            studio.
          </p>
          <Button variant="outline">
            Join our Team <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
          {TEAM.map((member) => (
            <BentoCard key={member.id} className="group overflow-hidden bg-white">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                  alt={member.name}
                  width={500}
                  height={600}
                  src={member.image}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg">{member.name}</h4>
                <p className="font-bold text-gray-400 text-xs uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>

      {/* Stats Strip */}
      <BentoCard className="flex flex-wrap justify-around gap-8 bg-nest-btn p-12 text-center text-white">
        <div>
          <span className="mb-2 block font-bold text-4xl md:text-5xl">12k+</span>
          <span className="text-gray-400 text-sm uppercase tracking-wider">Happy Homes</span>
        </div>
        <div>
          <span className="mb-2 block font-bold text-4xl md:text-5xl">100%</span>
          <span className="text-gray-400 text-sm uppercase tracking-wider">Carbon Neutral</span>
        </div>
        <div>
          <span className="mb-2 block font-bold text-4xl md:text-5xl">15</span>
          <span className="text-gray-400 text-sm uppercase tracking-wider">Design Awards</span>
        </div>
      </BentoCard>
    </div>
  );
}
