"use client"
import { Button } from "@/_components/client/button";
import { Card } from "@comp/card";
import { useProduct } from "@/hooks/useProduct";
import { Expand, Heart } from "lucide-react";
import Image from "next/image"

const GreatValueCard = () => {
    const { data: greatValue, isLoading, isError } = useProduct.greatValueDeals()
    if (greatValue === undefined) return <div>Error loading great value deals</div>
    return (
        <Card className="col-span-12 md:col-span-7 lg:col-span-5 rounded-3xl p-6 relative flex flex-col justify-between">
            <div className='w-1/2'>
                <h2 className="text-3xl md:text-4xl font-bold">Great Value Deals</h2>
                <h3 className="text-xl font-bold mt-2">{greatValue?.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{greatValue?.description}</p>
            </div>
            <div className="absolute right-0 bottom-0 w-1/2 h-full ">
                <Image src={greatValue?.images.at(0)?.url || '/images/krisjanis.jpg'} alt="Exclusive Product" layout="fill" objectFit="contain" className="object-right-bottom rounded-3xl" />
            </div>
            <div className="flex items-center justify-between mt-4">
                <Button className="rounded-full">
                    Open <Expand className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full"><Heart className="h-5 w-5 text-red-500" /></Button>
            </div>
        </Card>
        // <Card className="col-span-12 md:col-span-7 lg:col-span-5 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        //   <div>
        //     <h2 className="text-3xl md:text-4xl font-bold">Great Value Deals</h2>
        //     <p className="text-muted-foreground mt-2">Find Items On Sale With 50 - 75%</p>
        //   </div>
        //   <div className="absolute inset-0  ">
        //     <Image src={'/images/pavlo.jpg'} alt="Great Value Deal Armchair" layout="fill" objectFit="contain" />
        //   </div>
        //   <div className="absolute bottom-8 left-8 rounded-full bg-white/20 backdrop-blur-sm p-3 flex items-center gap-2">
        //     <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        //     <span className="font-bold">4.9</span>
        //   </div>
        // </Card>
    );

}

export default GreatValueCard