import { Edit } from "lucide-react";
import { Button } from "@/_components/client/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@comp/card";

export default function ReviewForm({ onBackToAdress, onBackToPayment }: { onBackToAdress: () => void, onBackToPayment: () => void }) {
    return (<>

        <Card className="col-span-1 md:col-span-3 lg:col-span-3  not-last:rounded-3xl p-6 relative flex flex-col jusbtify-between ">

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Shipping Address</CardTitle>
                    <CardAction><Button onClick={onBackToAdress} variant={"outline"}>
                        <Edit />
                    </Button></CardAction>
                    <CardContent className="p-0">
                        <CardDescription>
                            <div>
                                <span>
                                    Liam Harper
                                </span>
                                <span>125 ELM Street, Apt 4B, Anytown, CA 91234</span>
                            </div>
                        </CardDescription>
                    </CardContent>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Payment Method</CardTitle>
                    <CardAction><Button onClick={onBackToPayment} variant={"outline"}>
                        <Edit />
                    </Button></CardAction>
                    <CardContent className="p-0">
                        <CardDescription>
                            <div>
                                <span>
                                    Credit Card
                                </span>
                                <span>Visa Endig in *****1234</span>
                            </div>
                        </CardDescription>
                    </CardContent>
                </CardHeader>
            </Card>




        </Card>

    </>)
}