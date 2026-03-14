// Cliente de Supabase para el lado del cliente (navegador)
// Este cliente se utiliza en componentes del cliente (Client Components)

import { createBrowserClient } from "@supabase/ssr";

/**
 * Crea y retorna un cliente de Supabase para uso en el navegador
 * @returns {import('@supabase/supabase-js').SupabaseClient} Cliente de Supabase
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
