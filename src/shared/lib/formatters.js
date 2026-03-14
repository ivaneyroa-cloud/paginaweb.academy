/**
 * Este archivo centraliza todas las funciones de formato de datos para garantizar
 * la consistencia visual en toda la aplicación.
 */

/**
 * Formatea un número como una cadena de moneda en USD (por ejemplo, $1,234.57).
 * Utiliza la API de internacionalización del navegador para un formato correcto.
 * @param {number} value - El número a formatear.
 * @returns {string} La cadena de texto formateada como moneda.
 */
export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

/**
 * Formatea un número como una cadena de porcentaje con dos decimales (por ejemplo, 85.13%).
 * Maneja valores infinitos o no numéricos devolviendo 'N/A'.
 * @param {number} value - El número a formatear.
 * @returns {string} La cadena de texto formateada como porcentaje.
 */
export const formatPercent = (value) =>
  `${isFinite(value) ? value.toFixed(2) : "N/A"}%`;

/**
 * Formatea un número como una cantidad de unidades, redondeando hacia arriba y
 * agregando separadores de miles (por ejemplo, 1,533).
 * Devuelve 'Invendible' para valores no finitos.
 * @param {number} value - El número a formatear.
 * @returns {string} La cadena de texto formateada como unidades.
 */
export const formatUnits = (value) =>
  `${
    isFinite(value) ? Math.ceil(value).toLocaleString("en-US") : "Invendible"
  }`;

/**
 * Formatea un número de meses, manejando casos no recuperables.
 * Devuelve una cadena como "1.5 meses".
 * @param {number} value - El número de meses a formatear.
 * @returns {string} La cadena de texto formateada.
 */
export const formatMonths = (value) => {
  if (!isFinite(value) || value < 0) return "No recuperable";
  return `${value.toFixed(1)} meses`;
};
