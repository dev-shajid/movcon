'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, Loader2, Mail } from "lucide-react"

const formSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z
        .string()
        .min(5, "Password must be at least 5 characters.")
})

export function LoginForm({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: process.env.NEXT_PUBLIC_AUTH_EMAIL, password: process.env.NEXT_PUBLIC_AUTH_PASSWORD },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            // const result = await signIn("credentials", {
            //     email: values.email,
            //     password: values.password,
            //     redirect: false,
            // });

            // if (result?.error) {
            //     if (result.error === "CredentialsSignin") {
            //         throw new Error("Invalid email or password. Please try again.");
            //     } else if (result.error === "AccessDenied") {
            //         throw new Error(
            //             "Account verification required. Check your email for the link.",
            //         );
            //     } else {
            //         throw new Error("Authentication failed. Please try again.");
            //     }
            // } else if (result?.ok) {
            //     toast.success("Sign In Successful!", {
            //         description: "Redirecting to your profile...",
            //     });
            //     const callbackUrl = searchParams.get("callbackUrl") || "/";
            //     router.push(callbackUrl);
            // } else {
            //     throw new Error("Unexpected error. Please try again.");
            // }
        } catch (error) {
            toast.error("Authentication Error", {
                description:
                    error instanceof Error ? error.message : "Unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Apple or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm font-medium text-foreground'>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                                <Input
                                                    type='email'
                                                    placeholder='name@example.com'
                                                    className='pl-10 h-11 border-border focus:border-primary'
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className='relative'>
                                                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder='Enter your password'
                                                    className='pl-10 pr-10 h-11 border-border focus:border-primary'
                                                    disabled={loading}
                                                    {...field}
                                                />
                                                <button
                                                    type='button'
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className='absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted transition-colors'
                                                    disabled={loading}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                                                    ) : (
                                                        <Eye className='h-4 w-4 text-muted-foreground' />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type='submit'
                                className='w-full bg-linear-to-r text-white font-medium'
                                disabled={loading}
                            >
                                {(loading) && (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                )}
                                {loading
                                    ? "Signing in..."
                                    : "Sign in"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}