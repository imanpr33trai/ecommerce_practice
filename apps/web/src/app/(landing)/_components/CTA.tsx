import MaxWidthWrapper from "@/_components/max-width-wrapper";
import { Button } from "@/_components/client/button";
import { Card } from "@comp/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
const FinalCTASection = () => {
    return (
        <section className="bg-background dark:bg-zinc-900 pb-16">
            <MaxWidthWrapper>
                <Card className="group relative flex min-h-[400px] w-full items-center justify-center overflow-hidden rounded-3xl text-center">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/cta-background.jpg" // A beautiful, wide shot of a fully furnished room
                            alt="Beautifully designed living room"
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                        />
                        {/* Darkening Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-black/50" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center p-8 text-white">
                        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Design Your Perfect Space
                        </h2>
                        <p className="mt-6 max-w-xl text-lg text-white/90">
                            You've seen our commitment to quality and design. Now it's time to bring it home.
                            Explore our full collection and find the pieces that tell your story.
                        </p>
                        <Button href="/products" asChild size="lg" className="mt-8 rounded-full">

                            Explore the Full Collection
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

                        </Button>
                    </div>
                </Card>
            </MaxWidthWrapper>
        </section>
    );
};

export default FinalCTASection;