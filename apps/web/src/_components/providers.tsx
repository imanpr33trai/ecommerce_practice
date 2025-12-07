"use client";

import { Toaster } from "@comp/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient, TRPCProvider, trpcClient } from "@/utils/trpc";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>
				<TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
					{children}
					<ReactQueryDevtools />
					<Toaster richColors />
				</TRPCProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
