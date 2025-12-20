'use client'

import { Button } from "@/components/ui/button";
import { useOverlay } from "@/hooks/use-overlay";
import { useUserStore } from "@/hooks/use-user-store";
import { AUTH_REDIRECT_URL } from "@/route";
import { logout } from "@/services/auth.service";
import { AuthError } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function WaitingVerificationPage() {
    const userStore = useUserStore()
    const { showOverlay, hideOverlay } = useOverlay()
    const router = useRouter()

    async function handleLogout() {
        try {
            showOverlay()
            const res = await logout()
            if (!res.success) throw Error(res.error)
            userStore.logout()
            router.push(AUTH_REDIRECT_URL)
        } catch (error) {
            toast.error("Error", {
                description: (error as AuthError).message ?? 'Failed to logout. Please try again.'
            })
            hideOverlay()
        }
    }
    return (
        <>
            <h1>Your account is pending admin verification. Please wait for approval.</h1>
            <Button
                variant='destructive'
                onClick={handleLogout}
            >
                <LogOut />
                Log out
            </Button>
        </>
    )
}
