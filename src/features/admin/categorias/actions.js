'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. Obtener datos (Server Side)
export async function getCategorias() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre', { ascending: true });

  console.log('\n=== GET CATEGORIAS ===');
  console.log('Error:', error);
  console.log(`Datos obtenidos: ${data ? data.length + ' registros' : 'Ninguno'}`);

  if (error) {
    console.error("Error fetching categorias:", error);
    return []; // Retornar array vacío para no romper el map en el front
  }
  
  return data;
}

// 2. Actualización Masiva (Solo de lo modificado)
export async function updateCategoriasMasivo(categoriasModificadas) {
  const supabase = await createClient();
  
  if (!Array.isArray(categoriasModificadas) || categoriasModificadas.length === 0) {
    return { success: false, message: 'No hay datos para actualizar.' };
  }

  try {
    const updates = categoriasModificadas.map(async (cat) => {
        const { data, error } = await supabase
            .from('categorias')
            .update({
                nombre: cat.nombre,
                derechos_importacion: parseFloat(cat.derechos_importacion),
                tasa_estadistica: parseFloat(cat.tasa_estadistica),
                iva: parseFloat(cat.iva),
                activa: cat.activa
            })
            .eq('id', cat.id)
            .select(); 

        console.log(`\n=== UPDATE CATEGORIA: ${cat.nombre} ===`);
        console.log('Error:', error);
        console.log('Fila actualizada:', data);
            
        // Validamos error de sintaxis/conexión
        if (error) throw error;
        
        // Validamos el fallo silencioso de RLS (0 filas afectadas)
        if (!data || data.length === 0) {
            throw new Error(`Operación bloqueada o registro inexistente para: ${cat.nombre}`);
        }
    });

    await Promise.all(updates);
    
    revalidatePath('/admin/categorias'); 
    return { success: true, count: categoriasModificadas.length };

  } catch (error) {
    console.error('\n=== ERROR EN UPDATE MASIVO ===\n', error);
    return { 
        success: false, 
        message: 'No se pudieron actualizar las categorías. Por favor, intenta nuevamente.' 
    };
  }
}

// 3. Crear Nueva
export async function createCategoria(nuevaCategoria) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from('categorias')
        .insert({
            ...nuevaCategoria,
            derechos_importacion: parseFloat(nuevaCategoria.derechos_importacion),
            tasa_estadistica: parseFloat(nuevaCategoria.tasa_estadistica),
            iva: parseFloat(nuevaCategoria.iva)
        })
        .select();

    console.log(`\n=== CREATE CATEGORIA: ${nuevaCategoria.nombre} ===`);
    console.log('Error:', error);
    console.log('Fila insertada:', data);

    if (error) {
        return { 
            success: false, 
            error: 'No se pudo crear la categoría. Por favor, verifica los datos e intenta nuevamente.' 
        };
    }
    
    revalidatePath('/admin/categorias');
    
    // RETORNO ACTUALIZADO: Devolvemos el objeto completo insertado
    return { 
        success: true, 
        categoria: data[0] 
    };
}

// 4. Eliminar (Físico)
export async function deleteCategoria(id) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from('categorias') 
        .delete()
        .eq('id', id)
        .select();

    console.log(`\n=== DELETE CATEGORIA (ID: ${id}) ===`);
    console.log('Error:', error);
    console.log('Fila eliminada:', data);

    // Validamos error duro de Supabase
    if (error) {
        return { 
            success: false, 
            error: 'Ocurrió un error al procesar la solicitud. Por favor, intenta nuevamente.' 
        };
    }

    // Validamos el fallo silencioso de RLS
    if (!data || data.length === 0) {
        return { 
            success: false, 
            error: 'No se pudo eliminar el registro. Es posible que ya no exista o la operación no esté permitida.' 
        };
    }
    
    revalidatePath('/admin/categorias');
    
    // RETORNO ACTUALIZADO: Devolvemos solo el nombre de la categoría eliminada
    return { 
        success: true, 
        nombreEliminado: data[0].nombre 
    };
}