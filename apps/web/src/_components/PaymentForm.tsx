import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/card";
import { Input } from "@comp/input";
import { IconBrandApple, IconBrandPaypal } from "@tabler/icons-react";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/_components/client/button";

export default function PaymentForm({ onNext }: { onNext: () => void }) {
	const methods = [
		{ id: 1, label: "Credit Card", icon: CreditCard },
		{ id: 1, label: "PayPal", icon: IconBrandPaypal },
		{ id: 1, label: "Apple Pay", icon: IconBrandApple },
	];

	return (
		<Card className="jusbtify-between relative col-span-1 flex flex-col not-last:rounded-3xl p-6 md:col-span-3 lg:col-span-3">
			<CardHeader>
				<CardTitle className="text-2xl">Payment Method</CardTitle>
				<CardDescription>Select any of Payment Method</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-10">
				<div className="flex w-full flex-row justify-between gap-4 py-5">
					{methods.map((method, idx) => {
						const Icon = method.icon;

						return (
							<div
								key={idx}
								className="flex h-24 w-1/3 flex-col items-center justify-center rounded-3xl border bg-background shadow-xs transition-all duration-400 hover:bg-accent hover:text-accent-foreground hover:ring hover:ring-white/80 dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
							>
								<Icon className="size-5" />
								{method.label}
							</div>
						);
					})}
				</div>
				<div className="relative flex items-center">
					<Input placeholder="Card Number" />
					<span className="absolute right-0 inline-flex h-9 w-9 items-center justify-center">
						<CreditCard className="h-4 w-4" />
					</span>
				</div>
				<div className="flex gap-4">
					<Input placeholder="Expiration Date" />
					<div className="relative flex w-full items-center">
						<Input placeholder="CVV" />
						<span className="absolute right-2 inline-flex size-5 items-center justify-center">
							<Lock />
						</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex flex-row justify-end">
				<Button onClick={onNext} variant={"default"}>
					Continue to Review
				</Button>
			</CardFooter>
		</Card>
	);
}
