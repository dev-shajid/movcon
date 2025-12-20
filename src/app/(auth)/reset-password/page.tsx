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
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HOME_URL } from "@/route"
import { AuthError } from "@supabase/supabase-js"
import { createClient } from "@/supabase/client"
import { useOverlay } from "@/hooks/use-overlay"

const formSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { showOverlay, hideOverlay } = useOverlay()

    useEffect(() => {
        const code = searchParams.get('code')
        const error_description = searchParams.get('error_description')

        if (error_description) {
            setError(decodeURIComponent(error_description.split("+").join(" ")))
            return
        }
        if (!code) {
            setError('Invalid reset link. Missing required parameters.')
            return
        }

    }, [searchParams])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setError(null)

        try {
            showOverlay()
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password: data.password });
            if (error) throw error;

            router.push(HOME_URL)
        } catch (error) {
            hideOverlay()
            setError((error as AuthError).message || 'Failed to reset password. The link may be expired or invalid.')
        } finally {
            setIsLoading(false)
        }
    }

    if (error) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">Invalid Link</CardTitle>
                            <CardDescription>
                                This password reset link is invalid
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm text-muted-foreground">{error}</p>
                            <Button asChild className="w-full">
                                <Link href="/forgot-password">Request New Link</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Reset your password</CardTitle>
                        <CardDescription>
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="password"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter new password"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="password"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Confirm new password"
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {error && (
                                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <Field>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Resetting...' : 'Reset Password'}
                                    </Button>
                                    <FieldDescription className="text-center">
                                        Remember your password? <Link href="/signin">Sign in</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="h-7 bg-muted rounded animate-pulse mx-auto w-48 mb-2" />
                            <div className="h-5 bg-muted rounded animate-pulse mx-auto w-40" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded animate-pulse w-32" />
                                    <div className="h-10 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded animate-pulse w-36" />
                                    <div className="h-10 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="h-10 bg-muted rounded animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
