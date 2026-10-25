"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginSchema, type LoginInput } from "@ecommerceNextjs/types";
import { AuthLayout, AuthForm, FormField, FormItem, FormLabel, FormControl, FormMessage, Input } from "@/components/auth";
import { SocialLoginButtons } from "@/components/auth";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (data: LoginInput) => {
    const { error } = await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );

    if (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to access your orders and wishlist."
      footer={
        <>
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-bold text-black hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <AuthForm
        schema={LoginSchema}
        onSubmit={handleSubmit}
        submitText="Sign In"
        defaultValues={{ email: "", password: "", rememberMe: false }}
      >
        {({ register, watch }) => (
          <>
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

            <FormField name="password" {...register("password")}>
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="rememberMe" {...register("rememberMe")}>
              <FormItem className="flex items-center justify-between">
                <FormControl>
                  <Input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal text-sm text-gray-600">
                  Remember me
                </FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </>
        )}
      </AuthForm>

      <div className="mt-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <SocialLoginButtons
          onGoogleClick={() => {
            authClient.signIn.social({ provider: "google", callbackURL: "/" });
          }}
          onGithubClick={() => {
            authClient.signIn.social({ provider: "github", callbackURL: "/" });
          }}
        />
      </div>
    </AuthLayout>
  );
}