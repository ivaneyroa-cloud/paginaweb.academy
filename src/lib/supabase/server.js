// Cliente de Supabase para el lado del servidor
// Este cliente se utiliza en Server Components, Server Actions y Route Handlers

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Crea y retorna un cliente de Supabase para uso en el servidor
 * IMPORTANTE: No guardar este cliente en una variable global.
 * Siempre crear un nuevo cliente dentro de cada función cuando se necesite.
 * 
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} Cliente de Supabase
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Obtener todas las cookies
        getAll() {
          return cookieStore.getAll();
        },
        // Establecer cookies (para guardar la sesión del usuario)
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // El método `setAll` fue llamado desde un Server Component.
            // Esto puede ignorarse si tienes configurado el proxy para
            // refrescar las sesiones de usuario.
          }
        },
      },
    },
  );
}
