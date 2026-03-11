import { createBrowserClient } from '@supabase/ssr';

let _supabase: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
    if (!_supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase env vars not configured");
        }
        _supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
    return _supabase;
}

// Keep backward-compatible export (lazy)
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
    get(_, prop) {
        return (getSupabase() as any)[prop];
    },
});
