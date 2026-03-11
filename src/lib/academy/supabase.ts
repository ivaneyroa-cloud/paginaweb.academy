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

// Backward-compatible lazy export via Proxy
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
    get(_target, prop, receiver) {
        const instance = getSupabase();
        const value = Reflect.get(instance, prop, receiver);
        if (typeof value === "function") {
            return value.bind(instance);
        }
        return value;
    },
});
