import { createClient } from '@supabase/supabase-js';

let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
    if (!_supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase env vars not configured");
        }
        _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return _supabase;
}

// Backward-compatible lazy export via Proxy
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
    get(_target, prop, receiver) {
        const instance = getSupabase();
        const value = Reflect.get(instance, prop, receiver);
        if (typeof value === "function") {
            return value.bind(instance);
        }
        return value;
    },
});
