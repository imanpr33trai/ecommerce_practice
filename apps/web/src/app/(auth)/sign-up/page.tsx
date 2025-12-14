"use client";
import React, { useState } from "react";
import Link from "next/link";
import BentoCard from "@/components/ui/BentoCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigate = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, firstName);
    navigate.push("/account");
  };

  return (
    <div className="h-[90svh] flex flex-col items-center justify-center p-4 bg-nest-bg">
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
          <h1 className="text-3xl font-light mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">
            Join Nestify for exclusive deals.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-5 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 rounded-2xl px-5 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Email
            </label>
            <input
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
            <input
              type="password"
              placeholder="Create a password"
              className="w-full bg-gray-50 rounded-2xl px-5 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="pt-4">
            <Button className="w-full" type="submit">
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/log-in" className="text-black font-bold hover:underline">
            Log in
          </Link>
        </div>
      </BentoCard>
    </div>
  );
}
