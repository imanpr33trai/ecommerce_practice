"use client"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { User, Mail, UserPlus, Chrome, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Label } from "@comp/label"
import { toast } from "sonner"
import z from "zod"
import { Button } from "@/_components/client/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@comp/card"
import { Input } from "@comp/input"
import MaxWidthWrapper from "./max-width-wrapper"
import Link from "next/link"

export default function SignUpForm() {

    const router = useRouter()
    const { isPending } = authClient.useSession()

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: '',
            name: "",

        },
        onSubmit: async ({ value }) => {
            await authClient.signUp.email(
                {
                    email: value.email,
                    password: value.password,
                    name: value.name,
                },
                {
                    onSuccess: async () => {
                        router.push("/")
                        toast.success("Sign up Successful")
                    },
                    onError: (error) => {
                        toast.error(error.error.message || error.error.statusText)
                    }

                }
            )
        },
        validators: {

            onSubmit: z.object({
                name: z.string().min(2, "Name must be at least 2 characters"),
                email: z.email("Invalid email address"),
                confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
                password: z.string().min(8, "Password must be at least 8 characters"),
            }),

        }
    })

    return (<section className="
        bg-background  dark:bg-zinc-900 min-h-screen w-full">
        <MaxWidthWrapper className="h-full flex items-center justify-center">
            <Card className="relative z-10 w-full max-w-md rounded-2xl border-gray-200/20 bg-white/10 text-white shadow-2xl backdrop-blur-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
                    <CardDescription className="text-sm text-gray-300">
                        Join us to start shopping for the best deals.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit()
                    }} className="space-y-6">
                        {/* Full Name Input */}
                        <div>
                            <form.Field name="name">
                                {(field) => (
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                required
                                                className="pl-10 text-white placeholder:text-gray-400"
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
                        {/* Email Input */}
                        <div>

                            <form.Field name="email">
                                {(field) => (
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="email"
                                                placeholder="you@example.com"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                required
                                                className="pl-10 text-white placeholder:text-gray-400"
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

                        {/* Password Input */}
                        <div>
                            <form.Field name="password" >
                                {(field) => (
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                required
                                                className="pl-10 text-white placeholder:text-gray-400"
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

                        {/* Confirm Password Input */}
                        <div>
                            <form.Field name="confirmPassword" validators={{
                                onChangeListenTo: ['password'],
                                onChange: ({ value, fieldApi }) => {
                                    if (value !== fieldApi.form.getFieldValue('password')) {
                                        return 'Passwords do not match'
                                    }
                                    return undefined
                                },
                            }}>
                                {(field) => (
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="password"
                                                placeholder=""
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                required
                                                className="pl-10 text-white placeholder:text-gray-400"
                                            />
                                        </div>
                                        {field.state.meta.errors?.map((err, index) => (
                                            <div key={index}>{typeof err === 'string'
                                                ? err
                                                : err?.message ?? 'Invalid input'}</div>
                                        ))}
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        <form.Subscribe>
                            {(state) => (
                                <Button type="submit" className="w-full" disabled={!state.canSubmit || state.isSubmitting}>
                                    {state.isSubmitting ? (
                                        'Creating Account...'
                                    ) : (
                                        <>
                                            <UserPlus className="mr-2 h-5 w-5" />
                                            Create Account
                                        </>
                                    )}
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>

                    {/* Divider and Social Login */}
                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="mx-4 flex-shrink text-sm text-gray-400">
                            OR
                        </span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <Button variant="outline" className="w-full">
                        <Chrome className="mr-2 h-5 w-5" />
                        Sign up with Google
                    </Button>
                </CardContent>

                <CardFooter className="flex justify-center text-sm">
                    <p className="text-gray-300">
                        Already have an account?{' '}
                        <Link
                            href="/log-in"
                            className="font-medium text-blue-400 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card></MaxWidthWrapper></section>
    )
}