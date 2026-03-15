// Acciones del servidor para la gestión de usuarios
// Solo superadmin puede modificar roles.

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { obtenerPerfilActual } from '@/lib/supabase/profile';

// ──────────────────────────────────────────────
// Helper: verify the calling user is superadmin
// ──────────────────────────────────────────────
async function verificarSuperadmin() {
  const { data: perfil } = await obtenerPerfilActual();
  if (!perfil || perfil.rol?.toLowerCase() !== 'superadmin') {
    return { allowed: false, perfil: null };
  }
  return { allowed: true, perfil };
}

/**
 * Obtiene todos los perfiles de usuarios de la base de datos.
 * Any admin or superadmin can list users.
 */
export async function obtenerUsuarios() {
  const { data: perfil } = await obtenerPerfilActual();
  const rol = perfil?.rol?.toLowerCase();

  if (!perfil || (rol !== 'admin' && rol !== 'superadmin')) {
    return { error: 'No tenés permisos para ver esta sección.' };
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*');

    if (error) {
      console.error('Error al obtener usuarios:', error);
      return { error: error.message };
    }

    // Sort: superadmins first, then admins, then by created_at
    const dataOrdenada = data?.sort((a, b) => {
      const rolOrder = { superadmin: 0, admin: 1, usuario: 2 };
      const orderA = rolOrder[a.rol?.toLowerCase()] ?? 2;
      const orderB = rolOrder[b.rol?.toLowerCase()] ?? 2;

      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return { data: dataOrdenada };
  } catch (err) {
    console.error('Error inesperado:', err);
    return { error: 'Error al cargar los usuarios' };
  }
}

/**
 * Alterna el rol de un usuario entre 'usuario' y 'admin'.
 * 
 * RULES:
 *   1. Only superadmin can change roles.
 *   2. Nobody can assign 'superadmin' from the UI.
 *   3. Nobody can modify their own role.
 *   4. Nobody can modify another superadmin's role.
 */
export async function alternarRol(userId, nuevoRol) {
  const { allowed, perfil: miPerfil } = await verificarSuperadmin();
  if (!allowed) {
    return { error: 'Solo el Super Admin puede cambiar roles.' };
  }

  // Rule 2: can't assign superadmin from UI
  if (nuevoRol === 'superadmin') {
    return { error: 'El rol superadmin no se puede asignar desde la interfaz.' };
  }

  // Rule 3: can't modify own role
  if (miPerfil.id === userId) {
    return { error: 'No podés modificar tu propio rol.' };
  }

  // Rule 4: verify target is not superadmin
  const supabase = await createClient();
  const { data: targetUser } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', userId)
    .single();

  if (targetUser?.rol?.toLowerCase() === 'superadmin') {
    return { error: 'No podés modificar el rol de otro Super Admin.' };
  }

  // Valid roles: 'admin' or 'usuario'
  const rolValido = ['admin', 'usuario'].includes(nuevoRol) ? nuevoRol : 'usuario';

  try {
    const { error } = await supabase
      .from('perfiles')
      .update({ rol: rolValido })
      .eq('id', userId);

    if (error) return { error: error.message };

    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch (err) {
    return { error: 'Error al actualizar el rol del usuario' };
  }
}

/**
 * Bloquea o desbloquea a un usuario.
 * 
 * RULES:
 *   1. Only superadmin can block/unblock.
 *   2. Can't block yourself.
 *   3. Can't block another superadmin.
 */
export async function toggleBloqueo(userId, bloquear) {
  const { allowed, perfil: miPerfil } = await verificarSuperadmin();
  if (!allowed) {
    return { error: 'Solo el Super Admin puede bloquear usuarios.' };
  }

  if (miPerfil.id === userId) {
    return { error: 'No podés bloquearte a vos mismo.' };
  }

  const supabase = await createClient();

  // Verify target is not superadmin
  const { data: targetUser } = await supabase
    .from('perfiles')
    .select('rol, nombre_completo')
    .eq('id', userId)
    .single();

  if (targetUser?.rol?.toLowerCase() === 'superadmin') {
    return { error: 'No podés bloquear a otro Super Admin.' };
  }

  try {
    const { error } = await supabase
      .from('perfiles')
      .update({ bloqueado: bloquear })
      .eq('id', userId);

    if (error) return { error: error.message };

    revalidatePath('/admin/usuarios');
    return { success: true, nombre: targetUser?.nombre_completo };
  } catch (err) {
    return { error: 'Error al actualizar el estado del usuario' };
  }
}
