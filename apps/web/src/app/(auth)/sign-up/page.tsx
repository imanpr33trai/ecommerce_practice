"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type React from "react";

import { Input } from "@comp/input";
import { Label } from "@comp/label";
import { toast } from "sonner";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const name = firstName + lastName;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data: signData, error } = await signUp.email(
      {
        email,
        name,
        password,
        callbackURL: "/product",
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          console.log(ctx.error.message);
          setIsLoading(false);
        },
      },
    );
    console.log(signData);
    console.log(error);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-nest-bg p-4">
      <div className="mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-sm"
        >
          <div className="grid h-6 w-6 place-items-center rounded-full bg-black">
            <span className="font-bold text-white text-xs">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Nestify</span>
        </Link>
      </div>

      <BentoCard className="w-full max-w-md bg-white p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-light text-3xl">Create Account</h1>
          <p className="text-gray-500 text-sm">Join Nestify for exclusive deals.</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
                First Name
              </Label>
              <Input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-2xl border-none bg-gray-50 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div>
              <Label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
                Last Name
              </Label>
              <Input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-2xl border-none bg-gray-50 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>
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
              placeholder="Create a password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border-none bg-gray-50 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="pt-4">
            <Button
              className="w-full"
              type="submit"
            >
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            href="/log-in"
            className="font-bold text-black hover:underline"
          >
            Log in
          </Link>
        </div>
      </BentoCard>
    </div>
  );
}
