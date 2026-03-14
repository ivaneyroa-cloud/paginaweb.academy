// ============================================================
// FORMULARIO DE RECUPERACIÓN DE CONTRASEÑA
// ============================================================
// ⚠️  DESACTIVADO TEMPORALMENTE
// La recuperación de contraseña por email no está disponible
// porque el login ahora es exclusivamente con Google OAuth.
// Google gestiona la seguridad de la cuenta directamente.
//
// Para reactivar:
//   1. Borrá "export function ForgotPasswordForm() { return null; }"
//   2. Descomentá el bloque /* INICIO DESACTIVADO ... FIN DESACTIVADO */
//   3. En app/auth/forgot-password/page.jsx, quitá el redirect y descomentá el formulario
// ============================================================

'use client';

// ---- VERSIÓN ACTIVA (mínima) ----
export function ForgotPasswordForm() {
  return null;
}

/* ================================================================
   INICIO DESACTIVADO - Recuperación de Contraseña por Email
   ================================================================

'use client';

import { useState } from 'react';
import { forgotPassword } from '@/lib/supabase/actions';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Llamamos a la Server Action forgotPassword (en /lib/supabase/actions.js)
      const result = await forgotPassword(formData);
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Recuperar Contraseña
        </h1>
        <p className="text-sm text-slate-600">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            ¡Enlace enviado! Revisa tu correo electrónico para restablecer tu contraseña.
          </div>
        )}

        {!success && (
          <>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                disabled={loading} placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-white rounded-md border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full px-4 py-3 bg-sky-600 text-white font-medium rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>
          </>
        )}
      </form>

      <div className="text-center text-sm text-slate-600">
        <Link href="/auth/login" className="text-sky-600 hover:text-sky-700 font-medium hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}

   ================================================================
   FIN DESACTIVADO - Recuperación de Contraseña por Email
   ================================================================ */
