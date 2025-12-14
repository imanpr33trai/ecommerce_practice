"use client";
import React, { useState } from "react";
import Link from "next/link";
import BentoCard from "@/components/ui/BentoCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@comp/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigate = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, "Sarah"); // Simulate login name
    navigate.push("/account");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-4 animate-fade-in">
      <BentoCard className="w-full max-w-md p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Sign in to access your orders and wishlist.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Email
            </label>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-50 rounded-2xl px-5 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="pt-4">
            <Button className="w-full" type="submit">
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
