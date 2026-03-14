// ============================================================
// FORMULARIO DE REGISTRO CON EMAIL Y CONTRASEÑA
// ============================================================
// ⚠️  DESACTIVADO TEMPORALMENTE
// El registro con email está desactivado. Los usuarios acceden
// únicamente a través de Google OAuth.
//
// Para reactivar:
//   1. Borrá "export function SignUpForm() { return null; }"
//   2. Descomentá el bloque /* INICIO DESACTIVADO ... FIN DESACTIVADO */
//   3. En app/auth/sign-up/page.jsx, quitá el redirect y descomentá el <SignUpForm />
// ============================================================

'use client';

// ---- VERSIÓN ACTIVA (mínima) ----
// El componente existe pero no renderiza nada.
// Esto evita errores de importación.
export function SignUpForm() {
  return null;
}

/* ================================================================
   INICIO DESACTIVADO - Registro con Email y Contraseña
   ================================================================

'use client';

import { useState } from 'react';
import { signUp } from '@/lib/supabase/actions';
import Link from 'next/link';

export function SignUpForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validar que las contraseñas coincidan (validación en el cliente)
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    try {
      // Llamamos a la Server Action signUp (en /lib/supabase/actions.js)
      const result = await signUp(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Si no hay error, la acción redirigirá automáticamente a /auth/sign-up-success
    } catch (err) {
      setError('Ocurrió un error inesperado');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Crear Cuenta
        </h1>
        <p className="text-sm text-slate-600">
          Ingresa tus datos para crear una nueva cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            disabled={loading} placeholder="tu@email.com"
            className="w-full px-4 py-3 bg-white rounded-md border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="nombre_completo" className="text-sm font-medium text-slate-700">Nombre Completo</label>
          <input
            id="nombre_completo" name="nombre_completo" type="text" required autoComplete="name"
            disabled={loading} placeholder="Tu nombre completo"
            className="w-full px-4 py-3 bg-white rounded-md border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
          <input
            id="password" name="password" type="password" required autoComplete="new-password"
            disabled={loading} placeholder="••••••••" minLength={6}
            className="w-full px-4 py-3 bg-white rounded-md border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-slate-500">Debe tener al menos 6 caracteres</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirmar Contraseña</label>
          <input
            id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password"
            disabled={loading} placeholder="••••••••" minLength={6}
            className="w-full px-4 py-3 bg-white rounded-md border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full px-4 py-3 bg-sky-600 text-white font-medium rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      <div className="text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/login" className="text-sky-600 hover:text-sky-700 font-medium hover:underline">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}

   ================================================================
   FIN DESACTIVADO - Registro con Email y Contraseña
   ================================================================ */
