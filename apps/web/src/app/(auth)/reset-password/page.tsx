"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ResetPasswordSchema, type ResetPasswordInput } from "@ecommerceNextjs/types";
import { AuthLayout, AuthForm, FormField, FormItem, FormLabel, FormControl, FormMessage, Input } from "@/components/auth";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    const { error } = await authClient.resetPassword({
      password: data.password,
      token,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset successfully!");
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your new password below."
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
        schema={ResetPasswordSchema}
        onSubmit={handleSubmit}
        submitText="Reset Password"
        defaultValues={{ password: "", confirmPassword: "", token: token || "" }}
      >
        {({ register, watch, setValue }) => (
          <>
            <FormField name="password" {...register("password")}>
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="confirmPassword" {...register("confirmPassword")}>
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <input type="hidden" {...register("token")} value={token || ""} />
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
}