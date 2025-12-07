// src/_components/max-width-wrapper.tsx

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) => {
	return (
		<div
			className={cn(
				"mx-auto h-full w-full max-w-screen-xl rounded-3xl bg-background p-4 px-2.5 md:p-6 md:px-20",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default MaxWidthWrapper;
