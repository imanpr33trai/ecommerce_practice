"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignupSchema, type SignupInput } from "@ecommerceNextjs/types";
import { AuthLayout, AuthForm, FormField, FormItem, FormLabel, FormControl, FormMessage, Input } from "@/components/auth";
import { SocialLoginButtons } from "@/components/auth";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const handleSubmit = async (data: SignupInput) => {
    const { error } = await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
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
      title="Create Account"
      description="Join Nestify for exclusive deals."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/log-in" className="font-bold text-black hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <AuthForm
        schema={SignupSchema}
        onSubmit={handleSubmit}
        submitText="Create Account"
        defaultValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }}
      >
        {({ register, watch }) => (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="firstName" {...register("firstName")}>
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John"
                      className="w-full"
                      autoComplete="given-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="lastName" {...register("lastName")}>
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Doe"
                      className="w-full"
                      autoComplete="family-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

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
                    placeholder="Create a password"
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
                    placeholder="Confirm password"
                    className="w-full"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
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
            authClient.signUp.social({ provider: "google", callbackURL: "/" });
          }}
          onGithubClick={() => {
            authClient.signUp.social({ provider: "github", callbackURL: "/" });
          }}
        />
      </div>
    </AuthLayout>
  );
}