"use client"
import MaxWidthWrapper from "@/_components/max-width-wrapper";
import { Button } from "@/_components/client/button";
import { Card } from "@comp/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const FeaturedCategoriesSection = () => {
    // A reusable card component for this section
    const CategoryCard = ({
        title,
        description,
        imageUrl,
        href,
        className,
        isLarge = false,
    }: {
        title: string;
        description: string;
        imageUrl: string;
        href: string;
        className?: string;
        isLarge?: boolean;
    }) => (
        <Card className={`group relative flex h-full  w-full items-end overflow-hidden rounded-3xl ${className}`}>
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageUrl}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="relative z-10 p-6 md:p-8 text-white">
                <h3 className={`${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'} font-bold`}>
                    {title}
                </h3>
                <p className="mt-2 max-w-xs text-white/90">{description}</p>
                <Button asChild href={href} variant="secondary" className="mt-4 rounded-full bg-white/90 text-black hover:bg-white">

                    Explore
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

                </Button>
            </div>
        </Card>
    );

    return (
        <section className="py-16 bg-background dark:bg-zinc-900 min-h-screen">
            <MaxWidthWrapper>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
                    <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                        Find exactly what you need by exploring our curated furniture categories.
                    </p>
                </div>

                {/* Asymmetrical Grid inspired by the hero section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px]">
                    <CategoryCard
                        title="Living Room Comfort"
                        description="Sofas, chairs, and coffee tables designed for relaxation."
                        imageUrl="/living-room.jpg" // Assumes you have this image in /public
                        href="/categories/living-room"
                        className="lg:col-span-2"
                        isLarge={true}
                    />
                    <div className="flex flex-col gap-6">
                        <CategoryCard
                            title="Dining Essentials"
                            description="Elegant tables and chairs for your meals."
                            imageUrl="/dining-room.jpg" // Assumes you have this image in /public
                            href="/categories/dining"
                        />
                        <CategoryCard
                            title="Peaceful Bedrooms"
                            description="Create your perfect sanctuary."
                            imageUrl="/bedroom.jpg" // Assumes you have this image in /public
                            href="/categories/bedroom"
                        />
                    </div>
                </div>
            </MaxWidthWrapper>
        </section>
    );
};

export default FeaturedCategoriesSection