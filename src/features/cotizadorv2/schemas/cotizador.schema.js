import { z } from "zod";

/**
 * Schema de validación para el Cotizador de Importaciones V2
 * 
 * Este esquema utiliza Zod para validar todo el formulario del cotizador,
 * asegurando que los datos ingresados por el usuario cumplan con los
 * requisitos mínimos antes de procesar los cálculos de importación.
 * 
 * El formulario está dividido en dos pasos principales:
 * - Paso 1: Información del Producto (categoría y valor FOB)
 * - Paso 2: Dimensiones y Peso (datos de las cajas)
 * 
 * Todas las validaciones tienen mensajes en español, claros y amigables
 * para proporcionar retroalimentación útil al usuario.
 */

/**
 * Schema para validar una caja individual
 * 
 * Cada caja debe tener:
 * - peso: peso real en kilogramos
 * - largo, ancho, alto: dimensiones en centímetros
 * 
 * Todos los valores deben ser números positivos mayores a 0.
 */
const cajaSchema = z.object({
  id: z.number().optional(), // ID interno para manejo de estado, no requiere validación
  
  peso: z
    .number({
      required_error: "El peso es obligatorio",
      invalid_type_error: "El peso debe ser un número",
    })
    .gt(0, "El peso debe ser mayor a 0 kg"),

  length: z
    .number({
      required_error: "El largo es obligatorio",
      invalid_type_error: "El largo debe ser un número",
    })
    .gt(0, "El largo debe ser mayor a 0 cm"),

  width: z
    .number({
      required_error: "El ancho es obligatorio",
      invalid_type_error: "El ancho debe ser un número",
    })
    .gt(0, "El ancho debe ser mayor a 0 cm"),

  height: z
    .number({
      required_error: "El alto es obligatorio",
      invalid_type_error: "El alto debe ser un número",
    })
    .gt(0, "El alto debe ser mayor a 0 cm"),
});

/**
 * Schema principal del Cotizador de Importaciones
 * 
 * Valida todo el formulario completo incluyendo:
 * - Categoría del producto
 * - Valor FOB (Free On Board)
 * - Array de cajas con sus dimensiones y peso
 */
export const cotizadorSchema = z.object({
  /**
   * Categoría del producto
   * Define los impuestos y tasas que se aplicarán
   */
  categoria: z
    .string({
      required_error: "Selecciona una categoría",
      invalid_type_error: "La categoría debe ser un texto",
    })
    .min(1, "Selecciona una categoría"),

  /**
   * Valor FOB (Free On Board)
   * Valor de la mercancía sin incluir flete ni seguros
   */
  fob: z
    .number({
      required_error: "El valor FOB es obligatorio",
      invalid_type_error: "El valor FOB debe ser un número",
    })
    .gt(0, "El valor FOB debe ser mayor a $0"),

  /**
   * Array de cajas para el envío
   * Debe contener al menos una caja con sus dimensiones y peso
   */
  cajas: z
    .array(cajaSchema, {
      required_error: "Debes agregar al menos una caja",
      invalid_type_error: "Las cajas deben ser un array válido",
    })
    .min(1, "Debes agregar al menos una caja")
    .max(50, "No puedes agregar más de 50 cajas"), // Límite razonable para evitar problemas
});

/**
 * Tipo TypeScript inferido del schema para usar en componentes
 * Útil para autocompletado y type checking si se migra a TypeScript
 * 
 * Si migras a TypeScript, descomenta la siguiente línea:
 * export type CotizadorFormData = z.infer<typeof cotizadorSchema>;
 */

/**
 * Schema parcial para validación por pasos
 * Útil si se quiere validar cada paso del formulario individualmente
 */
export const paso1Schema = cotizadorSchema.pick({
  categoria: true,
  fob: true,
});

export const paso2Schema = cotizadorSchema.pick({
  cajas: true,
});

/**
 * Función helper para validar el formulario completo
 * 
 * @param {Object} data - Datos del formulario a validar
 * @returns {Object} { success: boolean, data?: Object, errors?: Object }
 */
export const validarCotizador = (data) => {
  try {
    const validatedData = cotizadorSchema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.format(),
      };
    }
    return {
      success: false,
      errors: { _errors: ["Error desconocido al validar el formulario"] },
    };
  }
};

/**
 * Función helper para validar solo un paso específico
 * 
 * @param {1|2} paso - Número del paso a validar
 * @param {Object} data - Datos del paso a validar
 * @returns {Object} { success: boolean, data?: Object, errors?: Object }
 */
export const validarPaso = (paso, data) => {
  const schema = paso === 1 ? paso1Schema : paso2Schema;
  
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.format(),
      };
    }
    return {
      success: false,
      errors: { _errors: ["Error desconocido al validar el paso"] },
    };
  }
};
