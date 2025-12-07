import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/card";
import { Input } from "@comp/input";
import { Button } from "@/_components/client/button";

const OrderSummary = ({ step }: { step: "review" | "address" | "payment" }) => {
	return (
		<Card className="col-span-1 flex h-full flex-col rounded-3xl p-6 md:col-span-3 lg:col-span-3">
			<CardHeader>
				<CardTitle className="text-2xl">Order Summary</CardTitle>
				<CardDescription>
					Review Your Order Before Proceeding to Payment
				</CardDescription>
			</CardHeader>

			{/* This grows and pushes footer down */}
			<CardContent className="flex flex-1 flex-col gap-4">
				{/* Example item */}
				<div className="flex items-center justify-between">
					<div className="flex gap-2">
						<div className="size-15 bg-white" />
						<div className="flex flex-col">
							<p className="font-medium">Product Name</p>
							<p className="text-muted-foreground text-sm">Quantity: 1</p>
						</div>
					</div>
					<p className="font-medium">$99.99</p>
				</div>
				{/* Add more items */}
			</CardContent>

			{/* Footer sticks to bottom */}
			<CardFooter className="mt-auto flex w-full flex-col gap-4">
				<div className="w-full">
					<div className="flex w-full items-center justify-between border-t pt-4">
						<p className="font-medium">Total</p>
						<p className="font-bold text-lg">$99.99</p>
					</div>
					<div className="mt-4 flex w-full gap-4">
						<Input placeholder="Discount Code" />
						<Button>Apply Coupon</Button>
					</div>
				</div>

				{step === "review" && <Button className="w-full">Place Order</Button>}
			</CardFooter>
		</Card>
	);
};

export default OrderSummary;
