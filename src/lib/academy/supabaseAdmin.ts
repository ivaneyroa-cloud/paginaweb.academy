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

// DEPRECATED: Do not use this at module level. Use getSupabaseAdmin() inside handlers.
// This exists only for backward compatibility — it will throw at build time if accessed.
export const supabaseAdmin = {} as SupabaseClient;
