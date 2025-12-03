import { Button } from "@/_components/client/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@comp/card";
import { Input } from "@comp/input";




const ShippingForm = ({ onNext }: { onNext: () => void }) => {
    return (
        <Card className="col-span-1 md:col-span-3 lg:col-span-3  not-last:rounded-3xl p-6 relative flex flex-col jusbtify-between " >
            <CardHeader>
                <CardTitle className="text-2xl">Shipping Information</CardTitle>
                <CardDescription >
                    Enter Your Shipping Details Below
                </CardDescription>

            </CardHeader>
            <CardContent className="flex flex-1 flex-col py-5 gap-4">

                <Input placeholder="Email" />
                <div className="w-full flex flex-row gap-4"><Input placeholder="First Name" />
                    <Input placeholder="Last Name" /></div>
                <Input placeholder="Phone Number" />
                <Input placeholder="Address" />
                <Input placeholder="Apt,Suite,etc(optional)" />
                <Input placeholder="Country" />
                <div className="w-full flex  flex-row gap-4">                <Input placeholder="State" />
                    <Input placeholder="City" />
                    <Input placeholder="Zip Code" /></div>
            </CardContent>
            <CardFooter className="flex justify-end flex-row">
                <Button onClick={onNext}>Continue to Payment</Button>
            </CardFooter>
        </Card>
    )
}
export default ShippingForm