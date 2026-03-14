// ============================================================
// FORMULARIO DE ACTUALIZACIÓN DE CONTRASEÑA
// ============================================================
// ⚠️  DESACTIVADO TEMPORALMENTE
// El restablecimiento de contraseña por email no está disponible
// mientras el login sea exclusivamente con Google OAuth.
//
// Para reactivar:
//   1. Borrá "export function UpdatePasswordForm() { return null; }"
//   2. Descomentá el bloque /* INICIO DESACTIVADO ... FIN DESACTIVADO */
//   3. En app/auth/update-password/page.jsx, quitá el redirect y descomentá el formulario
// ============================================================

'use client';

// ---- VERSIÓN ACTIVA (mínima) ----
export function UpdatePasswordForm() {
  return null;
}

/* ================================================================
   INICIO DESACTIVADO - Formulario de Actualización de Contraseña
   ================================================================

'use client';

import { useState } from 'react';
import { updatePassword } from '@/lib/supabase/actions';

export function UpdatePasswordForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Llamamos a la Server Action updatePassword (en /lib/supabase/actions.js)
      const result = await updatePassword(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Si no hay error, la acción redirigirá automáticamente al login
    } catch (err) {
      setError('Ocurrió un error inesperado');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Nueva Contraseña
        </h1>
        <p className="text-sm text-slate-600">
          Ingresa tu nueva contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Nueva Contraseña</label>
          <input
            id="password" name="password" type="password" required autoComplete="new-password"
            disabled={loading} placeholder="••••••••" minLength={6}
            className="w-full px-4 py-3 bg-white rounded-md border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-slate-500">Debe tener al menos 6 caracteres</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirmar Nueva Contraseña</label>
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
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
}

   ================================================================
   FIN DESACTIVADO - Formulario de Actualización de Contraseña
   ================================================================ */
