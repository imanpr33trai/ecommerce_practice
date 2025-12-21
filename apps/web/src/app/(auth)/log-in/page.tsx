"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type React from "react";

import { Input } from "@comp/input";
import { Label } from "@comp/label";
import { toast } from "sonner";

import BentoCard from "@/components/ui/BentoCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { signIn, signUp } from "@/lib/auth-client";

export default function LoginPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		await signIn.email(
			{
				email,
				password,
				callbackURL: "/",
			},
			{
				onSuccess: () => {
					toast.success("Welcome back!");
					router.push("/");
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
					setIsLoading(false);
				},
			},
		);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 bg-nest-bg">
			<div className="mb-8">
				<Link
					href="/"
					className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm"
				>
					<div className="w-6 h-6 bg-black rounded-full grid place-items-center">
						<span className="text-white text-xs font-bold">N</span>
					</div>
					<span className="font-bold text-lg tracking-tight">Nestify</span>
				</Link>
			</div>

			<BentoCard className="w-full max-w-md p-8 bg-white">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-light mb-2">Welcome Back</h1>
					<p className="text-gray-500 text-sm">Sign in to access your orders and wishlist.</p>
				</div>

				<form
					className="space-y-4"
					onSubmit={handleSubmit}
				>
					<div>
						<Label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Name</Label>
						<Input
							type="email"
							required
							value={email}
							onChange={(e) => setName(e.target.value)}
							placeholder="hello@example.com"
							className="w-full bg-gray-50 rounded-2xl px-5 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-black/5"
						/>
					</div>
					<div>
						<Label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email</Label>
						<Input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="hello@example.com"
							className="w-full bg-gray-50 rounded-2xl px-5 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-black/5"
						/>
					</div>
					<div>
						<Label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</Label>
						<Input
							type="password"
							placeholder="••••••••"
							onChange={(e) => setPassword(e.target.value)}
							className="w-full bg-gray-50 rounded-2xl px-5 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-black/5"
						/>
					</div>

					<div className="pt-4">
						<Button
							className="w-full"
							type="submit"
						>
							Sign In
						</Button>
					</div>
				</form>

				<div className="mt-6 text-center text-sm text-gray-500">
					Don't have an account?{" "}
					<Link
						href="/sign-up"
						className="text-black font-bold hover:underline"
					>
						Sign up
					</Link>
				</div>
			</BentoCard>
		</div>
	);
}
