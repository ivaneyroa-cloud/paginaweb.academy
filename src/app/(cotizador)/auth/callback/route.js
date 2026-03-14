// ============================================================
// RUTA DE CALLBACK PARA OAUTH (Google Login)
// ============================================================
// Cuando el usuario inicia sesión con Google, Supabase redirige
// a esta ruta con un parámetro "code" en la URL.
//
// Lo que hace este handler:
//   1. Lee el "code" de la URL
//   2. Lo intercambia por una sesión válida de Supabase
//   3. Redirige al usuario a la página principal (o a donde quería ir)
//
// URL de esta ruta: /auth/callback
// ============================================================

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Obtenemos los parámetros que vienen en la URL
  // Ejemplo de URL: http://localhost:3000/auth/callback?code=ABC123&next=/
  const { searchParams, origin } = new URL(request.url);

  // "code" es el código temporal que Google/Supabase envía para verificar al usuario
  const code = searchParams.get('code');

  // "next" es la URL a la que redirigir después del login (opcional)
  // Si no se especifica, vamos a "/" (página principal)
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // Creamos el cliente de Supabase para el servidor
    const supabase = await createClient();

    // Intercambiamos el "code" por una sesión real
    // Supabase verifica el code con Google y crea la sesión del usuario
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Login exitoso → redirigimos al usuario a la página principal
      // Usamos el "origin" (ej: http://localhost:3000) + la ruta destino
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Si hubo error al intercambiar el code, redirigimos a la página de error
    console.error('[Auth Callback] Error al intercambiar code por sesión:', error.message);
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  // Si no llegó ningún "code" en la URL, algo salió mal
  // Redirigimos a la página de error con un mensaje descriptivo
  console.error('[Auth Callback] No se recibió code de OAuth');
  return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent('No se recibió código de autenticación de Google')}`);
}
