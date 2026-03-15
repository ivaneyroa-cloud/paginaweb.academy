// Funciones auxiliares para manejar perfiles de usuarios
// Roles: 'superadmin', 'admin', 'usuario'

'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Obtiene el perfil completo del usuario autenticado.
 * @returns {Promise<{data?: Object, error?: string}>}
 */
export async function obtenerPerfilActual() {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Usuario no autenticado' };
    }

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
 * Verifica si el usuario actual tiene acceso admin (admin o superadmin).
 * @returns {Promise<boolean>}
 */
export async function esUsuarioAdmin() {
  const { data: perfil } = await obtenerPerfilActual();
  if (!perfil) return false;
  const rol = perfil.rol?.toLowerCase();
  return rol === 'admin' || rol === 'superadmin';
}

/**
 * Verifica si el usuario actual es superadmin.
 * @returns {Promise<boolean>}
 */
export async function esUsuarioSuperadmin() {
  const { data: perfil } = await obtenerPerfilActual();
  if (!perfil) return false;
  return perfil.rol?.toLowerCase() === 'superadmin';
}
