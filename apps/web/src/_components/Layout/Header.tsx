"use client";

import {
	AppWindow,
	Heart,
	Search,
	ShoppingBag,
	UserCircle,
} from "lucide-react";
import { Button } from "@/_components/client/button";
import { SearchInput } from "@/_components/searchInput";

export default function Header() {
	return (
		<header className="relative flex items-center justify-between gap-4">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<div className="grid grid-cols-2 gap-0.5">
						<span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
						<span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
						<span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
						<span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
					</div>
					<span className="font-bold text-lg">Nestify</span>
				</div>
				<div className="hidden items-center gap-2 rounded-full bg-gray-100 px-4 py-2 md:flex dark:bg-gray-800">
					<span className="text-muted-foreground text-sm">Sofa Collection</span>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<Button
					asChild
					variant="secondary"
					size="icon"
					className="rounded-full bg-black text-white dark:bg-white dark:text-black"
				>
					<span>
						<Search className="h-5 w-5" />
						<SearchInput />
					</span>
				</Button>
				<div className="hidden items-center gap-3 md:flex">
					<Button variant="ghost" href="#" size="icon" className="rounded-full">
						<AppWindow className="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						href="/wishlist"
						size="icon"
						className="rounded-full"
					>
						<Heart className="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						href="/cart"
						className="rounded-full"
					>
						<ShoppingBag className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="icon" className="rounded-full">
						<UserCircle className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</header>
	);
}

{
	/* <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none "></div>
         <div className="flex items-center gap-2">
            <ModeToggle />
           
          </div> 
        </div> */
}
