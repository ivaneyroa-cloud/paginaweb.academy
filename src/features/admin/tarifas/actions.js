'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ==========================================
// CONFIGURACIONES GLOBALES
// ==========================================

export async function getConfiguraciones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('configuraciones')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error("Error fetching configuraciones:", error);
    return null;
  }
  return data;
}

export async function updateConfiguraciones(nuevasConfig) {
  const supabase = await createClient();
  
  const payloadToUpdate = {};
  if (nuevasConfig.recargo_fuel !== undefined) payloadToUpdate.recargo_fuel = Number(nuevasConfig.recargo_fuel);
  if (nuevasConfig.peso_limite_tarifa_internacional !== undefined) payloadToUpdate.peso_limite_tarifa_internacional = Number(nuevasConfig.peso_limite_tarifa_internacional);
  if (nuevasConfig.precio_kg_extra_internacional !== undefined) payloadToUpdate.precio_kg_extra_internacional = Number(nuevasConfig.precio_kg_extra_internacional);
  if (nuevasConfig.recargo_express !== undefined) payloadToUpdate.recargo_express = Number(nuevasConfig.recargo_express);
  if (nuevasConfig.peso_limite_tarifa_publica !== undefined) payloadToUpdate.peso_limite_tarifa_publica = Number(nuevasConfig.peso_limite_tarifa_publica);
  if (nuevasConfig.precio_kg_extra_publico !== undefined) payloadToUpdate.precio_kg_extra_publico = Number(nuevasConfig.precio_kg_extra_publico);

  const { error } = await supabase
    .from('configuraciones')
    .update(payloadToUpdate)
    .eq('id', 1);

  if (error) {
    console.error("Error updating configuraciones:", error);
    return { success: false, message: 'Ocurrió un problema al guardar las configuraciones.' };
  }

  revalidatePath('/admin/tarifas/internacionales');
  revalidatePath('/admin/tarifas/publicas');
  return { success: true };
}

// ==========================================
// TARIFAS INTERNACIONALES
// ==========================================

export async function getTarifasInternacionales() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tarifas_internacionales')
    .select('*')
    .order('peso', { ascending: true });

  if (error) {
    console.error("Error fetching tarifas internacionales:", error);
    return [];
  }
  return data;
}

export async function updateTarifasInternacionalesMasivo(tarifasModificadas) {
  const supabase = await createClient();
  if (!Array.isArray(tarifasModificadas) || tarifasModificadas.length === 0) {
    return { success: false, message: 'No hay datos para actualizar.' };
  }

  try {
    const updates = tarifasModificadas.map(async (tarifa) => {
        const { data, error } = await supabase
            .from('tarifas_internacionales')
            .update({ precio_total_usd: parseFloat(tarifa.precio_total_usd) })
            .eq('peso', parseFloat(tarifa.peso))
            .select(); 

        if (error) throw error;
        if (!data || data.length === 0) {
            throw new Error(`Operación bloqueada o registro inexistente para peso: ${tarifa.peso}`);
        }
    });

    await Promise.all(updates);
    revalidatePath('/admin/tarifas/internacionales'); 
    return { success: true, count: tarifasModificadas.length };

  } catch (error) {
    console.error('\n=== ERROR EN UPDATE MASIVO INT ===\n', error);
    return { success: false, message: 'No se pudieron actualizar las tarifas. Intenta nuevamente.' };
  }
}

// ==========================================
// TARIFAS PÚBLICAS
// ==========================================

export async function getTarifasPublicas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tarifas_publicas')
    .select('*')
    .order('peso', { ascending: true });

  if (error) {
    console.error("Error fetching tarifas públicas:", error);
    return [];
  }
  return data;
}

export async function updateTarifasPublicasMasivo(tarifasModificadas) {
  const supabase = await createClient();
  if (!Array.isArray(tarifasModificadas) || tarifasModificadas.length === 0) {
    return { success: false, message: 'No hay datos para actualizar.' };
  }

  try {
    const updates = tarifasModificadas.map(async (tarifa) => {
        const { data, error } = await supabase
            .from('tarifas_publicas')
            .update({ precio_por_kg_usd: parseFloat(tarifa.precio_por_kg_usd) })
            .eq('peso', parseFloat(tarifa.peso))
            .select(); 

        if (error) throw error;
        if (!data || data.length === 0) {
            throw new Error(`Operación bloqueada o registro inexistente para peso: ${tarifa.peso}`);
        }
    });

    await Promise.all(updates);
    revalidatePath('/admin/tarifas/publicas'); 
    return { success: true, count: tarifasModificadas.length };

  } catch (error) {
    console.error('\n=== ERROR EN UPDATE MASIVO PUB ===\n', error);
    return { success: false, message: 'No se pudieron actualizar las tarifas. Intenta nuevamente.' };
  }
}
