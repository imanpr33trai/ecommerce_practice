"use client"
import { Button } from "@/_components/client/button";
import { Card } from "@comp/card";
import { useProduct } from "@/hooks/useProduct";
import { useWish } from "@/hooks/useWish";
import { Star, Heart, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image"
import type { CartAddItemResult } from '@/utils/typesClient';

const NewDealsCard = () => {

    const { data: newDeals, isLoading } = useProduct.newDeals()
    const { mutate: addWish } = useWish.addWish()

    const handleAddWish = () => {
        addWish({ productId: newDeals?.id || '' })
    }


    return (

        <Card className="col-span-12 md:col-span-5 lg:col-span-4 rounded-3xl p-6 md:p-8 flex flex-col bg-gray-100 dark:bg-gray-800/50">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">New Deals</h2>

            {/* Image container */}
            <div className="relative w-full h-[350px] rounded-3xl overflow-hidden">
                <Image
                    src={newDeals?.images.at(0)?.url || '/images/pavlo.jpg'}
                    alt="Long Chair"
                    fill
                    className="object-cover"
                />

                {/* Price + Name */}
                <div className="absolute top-2 left-2 rounded-3xl bg-white/70 text-black/40 backdrop-blur-sm px-4 py-2">
                    {/* <p className="font-bold text-2xl">  ${newDeals?.price.toFixed(2) ?? '0.00'}</p> */}
                    <p className="font-bold text-2xl">  00</p>
                    <p className="text-sm">{newDeals?.name}</p>
                </div>

                {/* Rating */}
                <div className="absolute top-2 right-2 rounded-full bg-white/70 backdrop-blur-sm p-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">4.9</span>
                </div>

                {/* Action buttons */}
                <div className="absolute bottom-2 right-2  flex items-center gap-3 rounded-full bg-white/70 backdrop-blur-sm p-2">
                    <Button variant="secondary" size="icon" className="rounded-full h-10 w-10" onClick={handleAddWish}>
                        <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
                        <ShoppingBag className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Slider controls */}
            <div className="mt-4 flex items-center justify-between rounded-full bg-white/20 backdrop-blur-sm p-2">
                <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm">Slide left and right</span>
                <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
        </Card>

    );
}
export default NewDealsCard