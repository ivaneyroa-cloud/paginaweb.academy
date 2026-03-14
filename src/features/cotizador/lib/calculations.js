import { FREIGHT_RATES } from "../constants";

// --- Funciones de Cálculo de Producto ---

/**
 * Calcula el valor FOB total.
 * @param {number} unitPrice - Precio por unidad del producto.
 * @param {number} quantity - Cantidad de unidades.
 * @returns {number} El valor FOB total.
 */
export const calculateFob = (unitPrice, quantity) => {
  return unitPrice * quantity;
};

/**
 * Calcula el precio unitario basado en el FOB total y la cantidad.
 * Utilizado para la funcionalidad de "campos inteligentes".
 * @param {number} fob - Valor FOB total.
 * @param {number} quantity - Cantidad de unidades.
 * @returns {number} El precio por unidad.
 */
export const calculateUnitPrice = (fob, quantity) => {
  if (quantity === 0) return 0;
  return fob / quantity;
};

// --- Funciones de Cálculo de Embalaje y Peso ---

/**
 * Calcula el peso volumétrico de una caja.
 * Fórmula: (Largo × Ancho × Alto) / 5000.
 * @param {number} length - Largo en cm.
 * @param {number} width - Ancho en cm.
 * @param {number} height - Alto en cm.
 * @returns {number} El peso volumétrico en kg.
 */
export const calculateVolumetricWeight = (length, width, height) => {
  return (length * width * height) / 5000;
};

/**
 * Determina el peso computable de una caja.
 * Es el mayor valor entre el peso real y el peso volumétrico.
 * @param {number} realWeight - Peso real en kg.
 * @param {number} volumetricWeight - Peso volumétrico en kg.
 * @returns {number} El peso computable en kg.
 */
export const calculateComputableWeight = (realWeight, volumetricWeight) => {
  return Math.max(realWeight, volumetricWeight);
};

/**
 * Calcula el peso computable total sumando el de todas las cajas.
 * @param {Array} boxes - Array de objetos de caja.
 * @returns {number} El peso computable total en kg.
 */
export const calculateTotalComputableWeight = (boxes) => {
  return boxes.reduce((total, box) => {
    const volumetric = calculateVolumetricWeight(
      box.length,
      box.width,
      box.height
    );
    const computable = calculateComputableWeight(box.weight, volumetric);
    return total + computable;
  }, 0);
};

// --- Funciones de Cálculo de Logística y Aduana ---

/**
 * Obtiene la tarifa de flete por kg según el peso computable total.
 * Busca en la tabla de tarifas la que corresponde al rango de peso.
 * Siempre aplica el mejor precio para el cliente: si el peso supera ligeramente
 * un límite (ej: 40.01kg), usa la tarifa del rango superior (más favorable).
 * @param {number} totalComputableWeight - El peso computable total de la carga.
 * @returns {number} La tarifa en USD por kg.
 */
export const getFreightRate = (totalComputableWeight) => {
  // Redondear hacia arriba al siguiente kg entero para determinar el rango
  // Esto asegura que 40.01kg use la tarifa del rango 41-50
  const roundedWeight = Math.ceil(totalComputableWeight);

  // Recorrer de atrás hacia adelante para encontrar el mejor precio
  // (las tarifas bajan a medida que aumenta el peso)
  for (let i = FREIGHT_RATES.length - 1; i >= 0; i--) {
    const range = FREIGHT_RATES[i];

    // Si el peso redondeado es mayor o igual al mínimo de este rango,
    // usar esta tarifa (que es la más baja posible para este peso)
    if (roundedWeight >= range.minWeight) {
      return range.rate;
    }
  }

  // Si el peso es menor que todos los rangos, usar la primera tarifa
  return FREIGHT_RATES[0]?.rate || 0;
};
/**
 * Calcula el costo total del flete internacional.
 * @param {number} totalComputableWeight - Peso computable total en kg.
 * @param {number} rate - Tarifa en USD por kg.
 * @returns {number} El costo del flete internacional en USD.
 */
export const calculateInternationalFreight = (totalComputableWeight, rate) => {
  return totalComputableWeight * rate;
};

/**
 * Calcula el gasto documental de aduana.
 * Fórmula: SI(FOB>=500, MIN(FOB*9.35%, 120), MIN(FOB*20%, 60))
 * @param {number} fob - Valor FOB total.
 * @returns {number} El costo del gasto documental en USD.
 */
export const calculateCustomsFee = (fob) => {
  if (fob >= 500) {
    return Math.min(fob * 0.0935, 120);
  } else {
    return Math.min(fob * 0.2, 60);
  }
};

// --- Funciones de Cálculo de Impuestos ---

/**
 * Calcula todos los impuestos aplicables basados en el valor FOB y la categoría del producto.
 * @param {number} fob - Valor FOB total.
 * @param {Object} category - Objeto de la categoría seleccionada.
 * @returns {Object} Un objeto con el desglose de cada impuesto (nombre, %, monto).
 */
export const calculateTaxes = (fob, category) => {
  // Según la nueva regla, todos los impuestos se calculan directamente sobre el valor FOB.
  const importDutyAmount = fob * category.importDuty;
  const statisticalFeeAmount = fob * category.statisticalFee;
  const ivaAmount = fob * category.iva;
  const iva10_5Amount = fob * category.iva10_5;

  return {
    importDuty: {
      name: "Derechos de Importación",
      percentage: category.importDuty,
      amount: importDutyAmount,
    },
    statisticalFee: {
      name: "Tasa Estadística",
      percentage: category.statisticalFee,
      amount: statisticalFeeAmount,
    },
    iva: { name: "IVA 21%", percentage: category.iva, amount: ivaAmount },
    iva10_5: {
      name: "IVA 10.5%",
      percentage: category.iva10_5,
      amount: iva10_5Amount,
    },
  };
};

// --- Funciones de Cálculo de Costo Final ---

/**
 * Calcula el costo final total de la importación.
 * @param {number} fob - Valor FOB.
 * @param {number} freight - Costo del flete internacional.
 * @param {number} customsFee - Gasto documental de aduana.
 * @param {number} totalTaxes - Suma total de todos los impuestos.
 * @returns {number} El costo final total en USD.
 */
export const calculateFinalCost = (fob, freight, customsFee, totalTaxes) => {
  return freight + customsFee + totalTaxes;
};

/**
 * Calcula el costo final por unidad de producto.
 * @param {number} finalCost - Costo final total.
 * @param {number} quantity - Cantidad de unidades.
 * @returns {number} El costo final por unidad en USD.
 */
export const calculateFinalUnitCost = (finalCost, quantity) => {
  if (quantity === 0) return 0;
  return finalCost / quantity;
};
