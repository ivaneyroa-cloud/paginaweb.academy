// Funciones auxiliares para manejar perfiles de usuarios
// Ayudan a obtener información del perfil actual y verificar roles

'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Obtiene el perfil completo del usuario autenticado
 * Incluye información como el rol, nombre completo, estado VIP, etc.
 * @returns {Promise<{data?: Object, error?: string}>} Perfil del usuario o error
 */
export async function obtenerPerfilActual() {
  const supabase = await createClient();

  try {
    // Primero obtenemos el usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Usuario no autenticado' };
    }

    // Luego obtenemos su perfil desde la tabla perfiles
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error al obtener perfil:', error);
      return { error: error.message };
    }

    return { data };
  } catch (err) {
    console.error('Error inesperado:', err);
    return { error: 'Error al cargar el perfil' };
  }
}

/**
 * Verifica si el usuario actual es administrador
 * @returns {Promise<boolean>} true si es admin, false si no
 */
export async function esUsuarioAdmin() {
  const { data: perfil } = await obtenerPerfilActual();
  
  if (!perfil) return false;
  
  return perfil.rol?.toLowerCase() === 'admin';
}
