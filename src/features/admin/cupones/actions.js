'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ──────────────────────────────────────────────────────────────
// GET ALL
// ──────────────────────────────────────────────────────────────
export async function getCupones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cupones')
    .select('*')
    .order('codigo', { ascending: true });

  if (error) {
    console.error('Error fetching cupones:', error);
    return [];
  }
  return data;
}

// ──────────────────────────────────────────────────────────────
// GET BY ID
// ──────────────────────────────────────────────────────────────
export async function getCuponById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cupones')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching cupon:', error);
    return null;
  }
  return data;
}

// ──────────────────────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────────────────────
export async function createCupon(cupon) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cupones')
    .insert({
      codigo: cupon.codigo.toUpperCase().trim(),
      porcentaje_descuento: parseFloat(cupon.porcentaje_descuento),
      activo: Boolean(cupon.activo),
    })
    .select();

  if (error) {
    console.error('Error creating cupon:', error);
    if (error.code === '23505') {
      return { success: false, message: 'El código del cupón ya existe.' };
    }
    return { success: false, message: 'Error al crear el cupón.' };
  }

  revalidatePath('/admin/cupones');
  return { success: true, cupon: data[0] };
}

// ──────────────────────────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────────────────────────
export async function updateCupon(id, cupon) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cupones')
    .update({
      codigo: cupon.codigo.toUpperCase().trim(),
      porcentaje_descuento: parseFloat(cupon.porcentaje_descuento),
      activo: Boolean(cupon.activo),
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating cupon:', error);
    if (error.code === '23505') {
      return { success: false, message: 'El código del cupón ya existe.' };
    }
    return { success: false, message: 'Error al actualizar el cupón.' };
  }

  revalidatePath('/admin/cupones');
  return { success: true, cupon: data[0] };
}

// ──────────────────────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────────────────────
export async function deleteCupon(codigo) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cupones')
    .delete()
    .eq('codigo', codigo)
    .select();

  if (error || !data || data.length === 0) {
    return { success: false, message: 'Error al eliminar el cupón.' };
  }

  revalidatePath('/admin/cupones');
  return { success: true };
}

// ──────────────────────────────────────────────────────────────
// TOGGLE ACTIVO
// ──────────────────────────────────────────────────────────────
export async function updateCuponActivo(codigo, activo) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cupones')
    .update({ activo: Boolean(activo) })
    .eq('codigo', codigo);

  if (error) {
    return { success: false, message: 'Error al actualizar el estado del cupón.' };
  }

  revalidatePath('/admin/cupones');
  return { success: true };
}
