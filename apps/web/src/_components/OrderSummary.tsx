import { Button } from "@/_components/client/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@comp/card"
import { Input } from "@comp/input"

const OrderSummary = ({ step }: { step: 'review' | 'address' | 'payment' }) => {
    return (
        <Card className="lg:col-span-3 rounded-3xl p-6 flex flex-col h-full md:col-span-3 col-span-1">
            <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
                <CardDescription>
                    Review Your Order Before Proceeding to Payment
                </CardDescription>
            </CardHeader>

            {/* This grows and pushes footer down */}
            <CardContent className="flex-1 flex flex-col gap-4">
                {/* Example item */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="bg-white size-15" />
                        <div className="flex flex-col">
                            <p className="font-medium">Product Name</p>
                            <p className="text-sm text-muted-foreground">Quantity: 1</p>
                        </div>
                    </div>
                    <p className="font-medium">$99.99</p>
                </div>
                {/* Add more items */}
            </CardContent>

            {/* Footer sticks to bottom */}
            <CardFooter className="mt-auto flex flex-col w-full gap-4">
                <div className="w-full">
                    <div className="border-t w-full pt-4 flex justify-between items-center">
                        <p className="font-medium">Total</p>
                        <p className="font-bold text-lg">$99.99</p>
                    </div>
                    <div className="flex w-full gap-4 mt-4">
                        <Input placeholder="Discount Code" />
                        <Button>Apply Coupon</Button>
                    </div>
                </div>

                {step === "review" && <Button className="w-full">Place Order</Button>}

            </CardFooter>
        </Card>

    )
}

export default OrderSummary