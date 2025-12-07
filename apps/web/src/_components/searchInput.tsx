import { Input } from "@comp/input";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/_components/client/button";
import { cn } from "@/lib/utils";

export interface SearchInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
	({ className, ...props }, ref) => {
		return (
			<div className="relative flex items-center">
				<Input
					type="search"
					className={cn("pr-10 pl-5", className)}
					ref={ref}
					{...props}
				/>
				<Button
					type="submit"
					size="icon"
					className="absolute right-0 h-8 w-8 rounded-full"
				>
					<SearchIcon className="h-4 w-4" />
				</Button>
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
