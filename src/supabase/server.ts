import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        "https://pwsonkqmpfbgzzgckyqd.supabase.co",
        "sb_publishable_JQZ8ic3IrFbBNl2B37_2qQ_xk9r5_EV",
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                        console.log("❌ Error in SUPABASE setup")
                    }
                },
            },
        }
    )
}