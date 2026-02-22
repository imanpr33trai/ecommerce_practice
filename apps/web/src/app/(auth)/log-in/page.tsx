"use client";

import type React from "react";

import { Input } from "@comp/input";
import { Label } from "@comp/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await signIn.email(
      {
        email,
        password,
        callbackURL: "/product",
      },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          console.log(ctx.error.message);
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-nest-bg p-4">
      <div className="mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-sm">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-black">
            <span className="font-bold text-white text-xs">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Nestify</span>
        </Link>
      </div>

      <BentoCard className="w-full max-w-md bg-white p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-light text-3xl">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to access your orders and wishlist.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
              Email
            </Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              className="w-full rounded-2xl border-none bg-gray-50 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
          <div>
            <Label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
              Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border-none bg-gray-50 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="pt-4">
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-bold text-black hover:underline">
            Sign up
          </Link>
        </div>
      </BentoCard>
    </div>
  );
}
