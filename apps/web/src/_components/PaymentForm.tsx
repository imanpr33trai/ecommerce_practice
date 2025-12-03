
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/_components/client/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@comp/card";
import { Input } from "@comp/input";
import { IconBrandApple, IconBrandPaypal } from "@tabler/icons-react";

export default function PaymentForm({ onNext }: { onNext: () => void }) {
    const methods = [
        { id: 1, label: "Credit Card", icon: CreditCard },
        { id: 1, label: "PayPal", icon: IconBrandPaypal },
        { id: 1, label: "Apple Pay", icon: IconBrandApple },
    ]

    return (

        <Card className="col-span-1 md:col-span-3 lg:col-span-3  not-last:rounded-3xl p-6 relative flex flex-col jusbtify-between ">
            <CardHeader>
                <CardTitle className="text-2xl">Payment Method</CardTitle>
                <CardDescription >
                    Select any of Payment Method
                </CardDescription>

            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-10">
                <div className="flex flex-row py-5 justify-between gap-4 w-full ">
                    {methods.map((method, idx) => {
                        const Icon = method.icon

                        return (
                            <div key={idx} className="flex flex-col items-center hover:ring rounded-3xl duration-400 transition-all hover:ring-white/80 w-1/3 h-24 justify-center border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                                <Icon className="size-5" />
                                {method.label}
                            </div>
                        )
                    })}
                </div>
                <div className="relative flex items-center" >
                    <Input
                        placeholder="Card Number"
                    />
                    <span
                        className="absolute inline-flex items-center justify-center right-0 h-9 w-9 "
                    >
                        <CreditCard className="h-4 w-4" />
                    </span>
                </div>
                <div className="flex gap-4">
                    <Input placeholder="Expiration Date" />
                    <div className="w-full relative flex items-center">
                        <Input placeholder="CVV" />
                        <span className="absolute inline-flex items-center justify-center right-2 size-5"><Lock /></span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end flex-row">
                <Button onClick={onNext} variant={"default"}>Continue to Review</Button>

            </CardFooter>
        </Card>
    )
}
