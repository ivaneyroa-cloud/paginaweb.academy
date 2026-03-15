"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Categoría por defecto (GENERICO 59%) como fallback
 * Se usa en caso de error al obtener categorías desde la base de datos
 */
const CATEGORIA_FALLBACK = {
  nombre: "GENERICO (59%)",
  derechos_importacion: 35,
  tasa_estadistica: 3,
  iva: 21,
  activa: true,
};

/**
 * Obtiene todas las categorías activas desde Supabase
 * 
 * En caso de error, retorna un array con solo la categoría GENERICO (59%)
 * 
 * @returns {Promise<Array>} Array de categorías activas
 */
export async function getCategorias() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("activa", true)
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al obtener categorías desde Supabase:", error);
      console.warn("Usando categoría GENERICO (59%) como fallback");
      return [CATEGORIA_FALLBACK];
    }

    // Si no hay categorías, retornar el fallback
    if (!data || data.length === 0) {
      console.warn("No se encontraron categorías activas. Usando fallback.");
      return [CATEGORIA_FALLBACK];
    }

    console.log(`✅ ${data.length} categorías cargadas desde Supabase`);
    // Retornar las categorías obtenidas
    return data;
  } catch (error) {
    console.error("Error inesperado al obtener categorías:", error);
    console.warn("Usando categoría GENERICO (59%) como fallback");
    return [CATEGORIA_FALLBACK];
  }
}

/**
 * Obtiene una categoría específica por su nombre
 * 
 * @param {string} nombre - Nombre de la categoría a buscar
 * @returns {Promise<Object|null>} Categoría encontrada o null
 */
export async function getCategoriaByNombre(nombre) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("nombre", nombre)
      .eq("activa", true)
      .single();

    if (error) {
      console.error(`Error al obtener categoría "${nombre}":`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error inesperado al obtener categoría "${nombre}":`, error);
    return null;
  }
}

/**
 * Revalida las categorías en cache
 * Útil cuando se actualizan categorías en la base de datos
 */
export async function revalidateCategorias() {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/cotizador-importacion");
}

/**
 * Obtiene todos los datos estáticos necesarios para el motor de cotización V2:
 * 1. Categorías activas
 * 2. Configuraciones globales (fuel, recargos, límites)
 * 3. Tarifas internacionales (proveedor)
 * 4. Tarifas públicas (Shippar)
 * 
 * Todo se ejecuta en paralelo para menor latencia.
 */
export async function getDatosCotizacion() {
  try {
    const supabase = await createClient();

    // 1. Promesas de consultas a Supabase
    const categoriasReq = supabase
      .from("categorias")
      .select("*")
      .eq("activa", true)
      .order("nombre", { ascending: true });

    const configuracionesReq = supabase
      .from("configuraciones")
      .select("*")
      .eq("id", 1)
      .single();

    const tarifasIntReq = supabase
      .from("tarifas_internacionales")
      .select("peso, precio_total_usd")
      .order("peso", { ascending: true });

    const tarifasPubReq = supabase
      .from("tarifas_publicas")
      .select("peso, precio_por_kg_usd")
      .order("peso", { ascending: true });

    // 2. Ejecutar todas las consultas en paralelo
    const [
      { data: categorias, error: errCat },
      { data: configuraciones, error: errConf },
      { data: tarifasInternacionales, error: errInt },
      { data: tarifasPublicas, error: errPub }
    ] = await Promise.all([
      categoriasReq,
      configuracionesReq,
      tarifasIntReq,
      tarifasPubReq
    ]);

    // 3. Manejo de Errores Críticos vs Tolerables
    if (errConf || errInt || errPub) {
      console.error("Error crítico al cargar datos de cotización (Config/Tarifas):", {
        errConf, errInt, errPub
      });
      throw new Error("No se pudieron cargar las tarifas de envío.");
    }

    if (errCat) {
      console.warn("No se pudieron cargar las categorías, usando fallback:", errCat);
    }

    return {
      success: true,
      data: {
        categorias: categorias && categorias.length > 0 ? categorias : [CATEGORIA_FALLBACK],
        configuraciones: configuraciones,
        tarifasInternacionales: tarifasInternacionales,
        tarifasPublicas: tarifasPublicas
      }
    };
  } catch (error) {
    console.error("Error en getDatosCotizacion:", error);
    return {
      success: false,
      error: error.message || "Error inesperado al cargar datos de cotización."
    };
  }
}

/**
 * Valida un código de cupón de forma segura en el servidor.
 * Solo retorna el porcentaje de descuento si es válido y está activo.
 * 
 * @param {string} codigo - Código ingresado por el usuario
 * @returns {Promise<Object>} Resultado de la validación
 */
export async function validarCuponAction(codigo) {
  if (!codigo || typeof codigo !== "string") {
    return { success: false, message: "Código de cupón inválido." };
  }

  try {
    const supabase = await createClient();
    const codigoUpper = codigo.trim().toUpperCase();

    const { data: cupon, error } = await supabase
      .from("cupones")
      .select("porcentaje_descuento, activo")
      .eq("codigo", codigoUpper)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No se encontró la fila
        return { success: false, message: "El cupón no existe o expiró." };
      }
      console.error("Error al validar cupón:", error);
      return { success: false, message: "Error al validar el cupón." };
    }

    if (!cupon.activo) {
      return { success: false, message: "Este cupón ya no está activo." };
    }

    return {
      success: true,
      porcentaje: Number(cupon.porcentaje_descuento),
      codigo: codigoUpper
    };

  } catch (error) {
    console.error("Error inesperado en validarCuponAction:", error);
    return { success: false, message: "Error inesperado del servidor." };
  }
}
