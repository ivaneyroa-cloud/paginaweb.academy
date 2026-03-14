// ============================================================
// COMPONENTE: Botón de inicio de sesión con Google
// ============================================================
// Responsabilidad única: mostrar el botón de Google y lanzar el flujo OAuth.
// Todo el contenido de la página (logo, título, tarjetas informativas)
// vive en app/auth/login/page.jsx.
//
// Flujo completo:
//   1. Usuario hace clic en el botón
//   2. Supabase redirige a Google (pantalla de selección de cuenta)
//   3. El usuario elige su cuenta de Google
//   4. Google redirige de vuelta a /auth/callback con un "code"
//   5. El callback intercambia el code por una sesión y lleva al usuario a "/"
// ============================================================

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function GoogleLoginButton() {
  // Estado para mostrar el spinner mientras se inicia el flujo
  const [loading, setLoading] = useState(false);

  // Estado para mostrar errores si algo falla
  const [error, setError] = useState(null);

  // Función que se ejecuta cuando el usuario hace clic en el botón
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    // Creamos el cliente de Supabase para el navegador
    const supabase = createClient();

    // Iniciamos el flujo OAuth con Google
    // "redirectTo" es la URL a la que Supabase le dirá a Google que redirija
    // después de la autenticación. Debe coincidir con el Redirect URI
    // configurado en Google Cloud Console y en el Dashboard de Supabase.
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Esta URL es la de nuestro callback handler (route.js)
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      // Si hubo error iniciando el flujo (antes de ir a Google), lo mostramos
      console.error('[GoogleLoginButton] Error al iniciar OAuth:', oauthError.message);
      setError('No se pudo iniciar el login con Google. Intentá de nuevo.');
      setLoading(false);
    }

    // Si no hay error, el navegador se redirige automáticamente a Google.
    // No necesitamos hacer nada más acá; el callback route.js se encarga del resto.
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Mensaje de error (solo visible si falla el inicio del flujo) */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      {/* Botón principal de Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="cursor-pointer w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Redirigiendo a Google...</span>
          </>
        ) : (
          // Estado normal: logo de Google + texto
          <>
            {/* Logo oficial de Google (SVG inline, sin dependencias externas) */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.59-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <span>Continuar con Google</span>
          </>
        )}
      </button>
    </div>
  );
}
