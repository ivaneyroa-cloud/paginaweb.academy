// Ruta para confirmar el email del usuario
// Esta ruta maneja la verificación del email cuando el usuario hace clic en el enlace de confirmación

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Maneja la confirmación de email del usuario
 * @param {Request} request - Solicitud HTTP con los parámetros de confirmación
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') || '/';

  // Verificar que se hayan proporcionado el token y el tipo
  if (token_hash && type) {
    const supabase = await createClient();

    // Intentar verificar el token OTP
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirigir al usuario a la URL especificada o a la raíz de la aplicación
      redirect(next);
    } else {
      // Redirigir al usuario a una página de error con el mensaje
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  // Si no hay token_hash o type, redirigir a la página de error
  redirect(`/auth/error?error=${encodeURIComponent('No se proporcionó token de confirmación')}`);
}
