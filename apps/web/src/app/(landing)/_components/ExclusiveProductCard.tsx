"use client"
import { Button } from "@/_components/client/button";
import { Card } from "@comp/card";
import { useProduct } from "@/hooks/useProduct";
import { Expand, Heart } from "lucide-react";
import Image from "next/image"

const ExclusiveProductCard = () => {
    const { data: exclusiveDeal } = useProduct.exclusiveDeals()
    return (
        <Card className="col-span-12 md:col-span-7 lg:col-span-5 rounded-3xl p-6 relative flex flex-col justify-between">
            <div className='w-1/2'>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">EXCLUSIVE</span>
                <h3 className="text-xl font-bold mt-2">{exclusiveDeal?.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{exclusiveDeal?.description}</p>
            </div>
            <div className="absolute right-0 bottom-0 w-1/2 h-full ">
                <Image src={exclusiveDeal?.images.at(0)?.url || '/images/krisjanis.jpg'} alt="Exclusive Product" layout="fill" objectFit="contain" className="object-right-bottom rounded-3xl" />
            </div>
            <div className="flex items-center justify-between mt-4">
                <Button className="rounded-full">
                    Open <Expand className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full"><Heart className="h-5 w-5 text-red-500" /></Button>
            </div>
        </Card>
    );

}
export default ExclusiveProductCard