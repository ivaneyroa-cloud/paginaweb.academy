import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Returns a lazily-initialized Supabase admin client.
 * MUST be called inside a function/handler, never at module scope.
 */
export function getSupabaseAdmin(): SupabaseClient {
    if (!_supabaseAdmin) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error(
                "Supabase env vars not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
            );
        }
        _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });
    }
    return _supabaseAdmin;
}

// Proxy-based lazy accessor: any property access on `supabaseAdmin`
// forwards to getSupabaseAdmin() at runtime, avoiding build-time crashes.
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
    get(_target, prop, receiver) {
        return Reflect.get(getSupabaseAdmin(), prop, receiver);
    },
});
