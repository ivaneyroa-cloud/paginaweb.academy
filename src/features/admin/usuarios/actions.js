// Acciones del servidor para la gestión de usuarios
// Estas funciones se ejecutan en el servidor y manejan la lógica de administración de perfiles

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Obtiene todos los perfiles de usuarios de la base de datos
 * @returns {Promise<{data?: Array, error?: string}>} Lista de usuarios o error
 */
export async function obtenerUsuarios() {
  const supabase = await createClient();

  try {
    // Consultamos la tabla perfiles para obtener todos los usuarios
    // IMPORTANTE: Primero obtenemos todos los usuarios sin ordenamiento en Supabase
    const { data, error } = await supabase
      .from('perfiles')
      .select('*');

    if (error) {
      console.error('Error al obtener usuarios:', error);
      return { error: error.message };
    }

    // Ordenamos en el servidor: primero los admins, luego por fecha de actualización
    const dataOrdenada = data?.sort((a, b) => {
      // Primero, ordenamos por rol (admin primero)
      const esAdminA = a.rol?.toLowerCase() === 'admin';
      const esAdminB = b.rol?.toLowerCase() === 'admin';
      
      if (esAdminA && !esAdminB) return -1; // A es admin, va primero
      if (!esAdminA && esAdminB) return 1;  // B es admin, va primero
      
      // Si ambos tienen el mismo tipo de rol, ordenamos por fecha más reciente
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    return { data: dataOrdenada };
  } catch (err) {
    console.error('Error inesperado:', err);
    return { error: 'Error al cargar los usuarios' };
  }
}

/**
 * Alterna el estado VIP de un usuario
 * @param {string} userId - ID del usuario a actualizar
 * @param {boolean} nuevoEstado - Nuevo estado VIP (true/false)
 * @returns {Promise<{success?: boolean, error?: string}>} Resultado de la operación
 */
export async function alternarVIP(userId, nuevoEstado) {
  const supabase = await createClient();

  try {
    // Actualizamos el campo es_vip del perfil
    const { error } = await supabase
      .from('perfiles')
      .update({ 
        es_vip: nuevoEstado,
        updated_at: new Date().toISOString() // Actualizamos la fecha de modificación
      })
      .eq('id', userId);

    if (error) {
      console.error('Error al actualizar estado VIP:', error);
      return { error: error.message };
    }

    // Revalidamos la página para que se actualicen los datos
    revalidatePath('/admin/usuarios');
    
    return { success: true };
  } catch (err) {
    console.error('Error inesperado:', err);
    return { error: 'Error al actualizar el estado VIP' };
  }
}

/**
 * Alterna el estado de bloqueo de un usuario
 * @param {string} userId - ID del usuario a actualizar
 * @param {boolean} nuevoEstado - Nuevo estado de bloqueo (true/false)
 * @returns {Promise<{success?: boolean, error?: string}>} Resultado de la operación
 */
export async function alternarBloqueo(userId, nuevoEstado) {
  const supabase = await createClient();

  try {
    // Actualizamos el campo esta_bloqueado del perfil
    const { error } = await supabase
      .from('perfiles')
      .update({ 
        esta_bloqueado: nuevoEstado,
        updated_at: new Date().toISOString() // Actualizamos la fecha de modificación
      })
      .eq('id', userId);

    if (error) {
      console.error('Error al actualizar estado de bloqueo:', error);
      return { error: error.message };
    }

    // Revalidamos la página para que se actualicen los datos
    revalidatePath('/admin/usuarios');
    
    return { success: true };
  } catch (err) {
    console.error('Error inesperado:', err);
    return { error: 'Error al actualizar el estado de bloqueo' };
  }
}

/**
 * Alterna el rol de un usuario entre 'usuario' y 'admin'
 * @param {string} userId - ID del usuario a actualizar
 * @param {string} nuevoRol - Nuevo rol ('admin' o 'usuario')
 * @returns {Promise<{success?: boolean, error?: string}>} Resultado de la operación
 */
export async function alternarRol(userId, nuevoRol) {
  const supabase = await createClient();

  try {
    // Actualizamos el campo rol del perfil
    const { error } = await supabase
      .from('perfiles')
      .update({ 
        rol: nuevoRol,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error al actualizar rol:', error);
      return { error: error.message };
    }

    // Revalidamos la página para que se actualicen los datos
    revalidatePath('/admin/usuarios');
    
    return { success: true };
  } catch (err) {
    console.error('Error inesperado:', err);
    return { error: 'Error al actualizar el rol del usuario' };
  }
}
