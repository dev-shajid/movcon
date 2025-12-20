import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        "https://pwsonkqmpfbgzzgckyqd.supabase.co",
        "sb_publishable_JQZ8ic3IrFbBNl2B37_2qQ_xk9r5_EV", {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}