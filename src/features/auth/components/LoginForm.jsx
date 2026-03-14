// ============================================================
// FORMULARIO DE LOGIN CON EMAIL Y CONTRASEÑA
// ============================================================
// ⚠️  DESACTIVADO TEMPORALMENTE
// El login ahora se hace con Google OAuth (ver GoogleLoginButton.jsx)
//
// Para reactivar este formulario:
//   1. Borrá "export function LoginForm() { return null; }" de abajo
//   2. Descomentá el bloque /* INICIO DESACTIVADO ... FIN DESACTIVADO */
//   3. En app/auth/login/page.jsx, importá LoginForm en lugar de GoogleLoginButton
// ============================================================

'use client';

// ---- VERSIÓN ACTIVA (mínima) ----
// El componente existe pero no renderiza nada porque está desactivado.
// Esto evita errores de importación en los archivos que lo usen.
export function LoginForm() {
  return null;
}

/* ================================================================
   INICIO DESACTIVADO - Login con Email y Contraseña
   ================================================================

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      // Iniciar sesión directamente desde el cliente
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Redirigir al usuario a la página principal con recarga completa
      // Usamos window.location.href para asegurar sincronización completa de la sesión
      window.location.href = '/';
    } catch (err) {
      setError('Error al iniciar sesión. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Iniciar Sesión
        </h1>
        <p className="text-sm text-slate-600">
          Ingresa tu email y contraseña para acceder a tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={loading}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 bg-white rounded-md border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-sky-600 hover:text-sky-700 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            disabled={loading}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white rounded-md border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-sky-600 text-white font-medium rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="text-center text-sm text-slate-600">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/sign-up" className="text-sky-600 hover:text-sky-700 font-medium hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}

   ================================================================
   FIN DESACTIVADO - Login con Email y Contraseña
   ================================================================ */
