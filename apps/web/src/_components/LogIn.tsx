"use client";

import { Input } from "@comp/input";
import { Label } from "@comp/label";
import { useForm } from "@tanstack/react-form";
import { Chrome, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/_components/client/button";
import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import MaxWidthWrapper from "./max-width-wrapper";

// In a real app, you would use the Next.js <Image /> component
// For this example, we use a div with a background image for simplicity

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{ email: value.email, password: value.password },
				{
					onSuccess: () => {
						router.push("/");
						toast.success("Sign in successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});
	if (isPending) <Loader />;
	const isLoading = false; // Placeholder for tRPC `isLoading` state

	return (
		<section className="min-h-screen w-full bg-background dark:bg-zinc-900">
			<MaxWidthWrapper className="flex h-full items-center justify-center">
				<div className="relative z-10 w-full max-w-md">
					<div className="rounded-2xl border border-gray-200/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
						<div className="text-center">
							<h1 className="font-bold text-3xl text-white">Welcome Back</h1>
							<p className="mt-2 text-gray-300 text-sm">
								Sign in to continue to your account.
							</p>
						</div>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
							className="mt-8 space-y-6"
						>
							<div>
								<form.Field name="email">
									{(field) => (
										<div className="space-y-2">
											<Label
												htmlFor={field.name}
												className="font-medium text-gray-200 text-sm"
											>
												Email
											</Label>
											<div className="relative">
												<Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
												<Input
													id={field.name}
													name={field.name}
													type="email"
													autoComplete="email"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="you@example.com"
													className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 pr-3 pl-10 text-white placeholder-gray-400 transition focus:outline-none focus:ring-2 lg:h-12"
												/>
											</div>
											{field.state.meta.errors.map((error) => (
												<p key={error?.message} className="text-red-500">
													{error?.message}
												</p>
											))}
										</div>
									)}
								</form.Field>
							</div>
							<div>
								<form.Field name="password">
									{/* Password Input */}
									{(field) => (
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<Label
													htmlFor={field.name}
													className="font-medium text-gray-200 text-sm"
												>
													Password
												</Label>
												<Link
													href="/forgot-password" // TODO: Create this page
													className="text-sm hover:underline"
												>
													Forgot password?
												</Link>
											</div>
											<div className="relative">
												<Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
												<Input
													id={field.name}
													name={field.name}
													type="password"
													autoComplete="current-password"
													required
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="••••••••"
													className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 pr-3 pl-10 text-white placeholder-gray-400 transition focus:outline-none focus:ring-2 lg:h-12"
												/>
												{field.state.meta.errors.map((error) => (
													<p key={error?.message} className="text-red-500">
														{error?.message}
													</p>
												))}
											</div>
										</div>
									)}
								</form.Field>
							</div>
							{/* Submit Button */}
							<form.Subscribe>
								{(state) => (
									<Button
										type="submit"
										disabled={!state.canSubmit || state.isSubmitting}
										className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 font-semibold text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
									>
										{state.isSubmitting ? (
											"Signing In..."
										) : (
											<>
												<LogIn className="mr-2 h-5 w-5" />
												Sign In
											</>
										)}
									</Button>
								)}
							</form.Subscribe>
						</form>

						{/* Divider and Social Login */}
						<div className="my-6 flex items-center">
							<div className="flex-grow border-gray-600 border-t" />
							<span className="mx-4 flex-shrink text-gray-400 text-sm">
								OR CONTINUE WITH
							</span>
							<div className="flex-grow border-gray-600 border-t" />
						</div>

						<div>
							<button
								type="button"
								// TODO: Add onClick handler for Google Sign-In
								className="flex w-full items-center justify-center rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 font-medium text-sm text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
							>
								<Chrome className="mr-2 h-5 w-5" />
								Sign in with Google
							</button>
						</div>

						{/* Sign Up Link */}
						<div className="mt-8 text-center text-gray-300 text-sm">
							Don&apos;t have an account?{" "}
							<Link href="/sign-up" className="font-medium hover:underline">
								Sign up now
							</Link>
						</div>
					</div>
				</div>
			</MaxWidthWrapper>
		</section>
	);
}
