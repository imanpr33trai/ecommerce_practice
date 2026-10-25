"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@ecommerceNextjs/types";
import { AuthLayout, AuthForm, FormField, FormItem, FormLabel, FormControl, FormMessage, Input } from "@/components/auth";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const handleSubmit = async (data: ForgotPasswordInput) => {
    const { error } = await authClient.forgetPassword({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset link sent! Check your email.");
  };

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email to receive a password reset link."
      footer={
        <>
          Remember your password?{" "}
          <Link href="/log-in" className="font-bold text-black hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm
        schema={ForgotPasswordSchema}
        onSubmit={handleSubmit}
        submitText="Send Reset Link"
        defaultValues={{ email: "" }}
      >
        {({ register, watch }) => (
          <FormField name="email" {...register("email")}>
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        )}
      </AuthForm>
    </AuthLayout>
  );
}