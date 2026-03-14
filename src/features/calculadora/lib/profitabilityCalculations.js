/**
 * Calcula el costo total base de la inversión (FOB + costos de importación).
 * @param {number} totalFob - El valor FOB total.
 * @param {number} importCosts - Los costos totales de importación (flete, impuestos, tasas).
 * @returns {number} El costo total de la inversión base.
 */
export const calculateTotalCost = (totalFob, importCosts) => {
  return totalFob + importCosts;
};

/**
 * Suma los costos adicionales totales a partir de un array de costos.
 * @param {Array} costs - Un array de objetos de costo, cada uno con una propiedad `amount`.
 * @returns {number} La suma de los montos de los costos adicionales.
 */
export const calculateTotalAdditionalCosts = (costs) => {
  return costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
};

/**
 * Calcula la inversión total, incluyendo costos base y adicionales.
 * @param {number} baseInvestment - Costo base de la importación (FOB + costos de importación).
 * @param {number} totalAdditionalCosts - Costos adicionales totales (marketing, empaque, etc.).
 * @returns {number} La inversión total.
 */
export const calculateTotalInvestment = (
  baseInvestment,
  totalAdditionalCosts
) => {
  return baseInvestment + totalAdditionalCosts;
};

/**
 * Calcula el costo por unidad para un costo total y cantidad dados.
 * @param {number} totalCost - El costo total.
 * @param {number} quantity - La cantidad de unidades.
 * @returns {number} El costo por unidad.
 */
export const calculateUnitCost = (totalCost, quantity) => {
  if (quantity === 0) return 0;
  return totalCost / quantity;
};

/**
 * Calcula el costo final total por unidad, incluyendo la porción de costos adicionales.
 * @param {number} baseUnitCost - Costo unitario base (importación).
 * @param {number} additionalCostPerUnit - Costo adicional por unidad.
 * @returns {number} El costo final total por unidad.
 */
export const calculateFullUnitCost = (baseUnitCost, additionalCostPerUnit) => {
  return baseUnitCost + additionalCostPerUnit;
};

/**
 * Calcula el monto total de comisión por venta.
 * @param {number} sellingPrice - El precio al que se vende una unidad.
 * @param {number} platformFeePercent - El porcentaje de comisión de la plataforma.
 * @param {number} paymentFeePercent - El porcentaje de la tarifa del procesador de pagos.
 * @param {number} installmentFeePercent - El porcentaje del costo por ofrecer cuotas (opcional).
 * @returns {number} El monto total de la comisión.
 */
export const calculateCommissionAmount = (
  sellingPrice,
  platformFeePercent,
  paymentFeePercent,
  installmentFeePercent = 0
) => {
  const platformFee = sellingPrice * (platformFeePercent / 100);
  const paymentFee = sellingPrice * (paymentFeePercent / 100);
  const installmentFee = sellingPrice * (installmentFeePercent / 100);
  return platformFee + paymentFee + installmentFee;
};

/**
 * Calcula el ingreso neto por venta después de comisiones.
 * @param {number} sellingPrice - El precio de venta por unidad.
 * @param {number} commissionAmount - El monto total de la comisión por venta.
 * @returns {number} El ingreso neto por venta.
 */
export const calculateNetIncomePerSale = (sellingPrice, commissionAmount) => {
  return sellingPrice - commissionAmount;
};

/**
 * Calcula la ganancia neta por venta.
 * @param {number} netIncomePerSale - El ingreso por venta después de comisiones.
 * @param {number} finalUnitCost - El costo final por unidad, incluyendo costos adicionales.
 * @returns {number} La ganancia neta por venta.
 */
export const calculateNetProfitPerSale = (netIncomePerSale, finalUnitCost) => {
  return netIncomePerSale - finalUnitCost;
};

/**
 * Calcula el margen de ganancia sobre los ingresos.
 * @param {number} netProfitPerSale - La ganancia neta por venta.
 * @param {number} sellingPrice - El precio de venta por unidad.
 * @returns {number} El margen como porcentaje.
 */
export const calculateMarginOnRevenue = (netProfitPerSale, sellingPrice) => {
  if (sellingPrice <= 0) return 0;
  return (netProfitPerSale / sellingPrice) * 100;
};

/**
 * Calcula el Retorno de la Inversión (ROI) para una sola unidad.
 * @param {number} netProfitPerSale - La ganancia neta por venta.
 * @param {number} finalUnitCost - El costo final por unidad, incluyendo costos adicionales.
 * @returns {number} El ROI como porcentaje.
 */
export const calculateRoi = (netProfitPerSale, finalUnitCost) => {
  if (finalUnitCost <= 0) return netProfitPerSale > 0 ? Infinity : 0;
  return (netProfitPerSale / finalUnitCost) * 100;
};

/**
 * Calcula el precio de venta de equilibrio.
 * @param {number} finalUnitCost - El costo final por unidad, incluyendo costos adicionales.
 * @param {number} platformFeePercent - El porcentaje de comisión de la plataforma.
 * @param {number} paymentFeePercent - El porcentaje de la tarifa del procesador de pagos.
 * @param {number} installmentFeePercent - El porcentaje del costo por ofrecer cuotas (opcional).
 * @returns {number} El precio de venta necesario para tener cero ganancias.
 */
export const calculateBreakEvenPrice = (
  finalUnitCost,
  platformFeePercent,
  paymentFeePercent,
  installmentFeePercent = 0
) => {
  const totalFeePercent =
    platformFeePercent + paymentFeePercent + installmentFeePercent;
  if (totalFeePercent >= 100) return Infinity; // No se puede alcanzar el equilibrio
  const marginToCoverCost = 1 - totalFeePercent / 100;
  if (marginToCoverCost <= 0) return Infinity;
  return finalUnitCost / marginToCoverCost;
};

/**
 * Calcula cuántas unidades se deben vender para recuperar la inversión total.
 * @param {number} totalCost - El costo total de la inversión.
 * @param {number} netProfitPerSale - La ganancia neta por venta.
 * @returns {number} La cantidad de unidades a vender para alcanzar el punto de equilibrio de la inversión total.
 */
export const calculatePaybackTime = (totalCost, netProfitPerSale) => {
  if (netProfitPerSale <= 0) return Infinity;
  return totalCost / netProfitPerSale;
};

/**
 * Calcula la facturación total proyectada para el lote.
 * @param {number} sellingPrice - Precio de venta por unidad.
 * @param {number} quantity - Cantidad total de unidades.
 * @returns {number} La facturación total proyectada.
 */
export const calculateProjectedRevenue = (sellingPrice, quantity) => {
  return sellingPrice * quantity;
};

/**
 * Calcula el ingreso neto total proyectado para el lote.
 * @param {number} netIncomePerSale - Ingreso neto por unidad.
 * @param {number} quantity - Cantidad total de unidades.
 * @returns {number} El ingreso neto total proyectado.
 */
export const calculateProjectedNetIncome = (netIncomePerSale, quantity) => {
  return netIncomePerSale * quantity;
};

/**
 * Calcula la ganancia neta total proyectada para el lote.
 * @param {number} netProfitPerSale - Ganancia neta por unidad.
 * @param {number} quantity - Cantidad total de unidades.
 * @returns {number} La ganancia neta total proyectada.
 */
export const calculateProjectedNetProfit = (netProfitPerSale, quantity) => {
  return netProfitPerSale * quantity;
};

/**
 * Calcula la rentabilidad para el modo unitario
 * @param {Object} costData - Datos de costos unitarios
 * @param {Object} salesData - Datos de ventas
 * @returns {Object} Rentabilidad calculada
 */
export const calculateUnitProfitability = (costData, salesData) => {
  const { unitProductCost, unitShippingCost, unitAdditionalCosts } = costData;
  const {
    grossSellingPrice,
    promotionalDiscount,
    platformFeePercent,
    paymentFeePercent,
    taxesAndRetentions,
    sellerShippingCost,
  } = salesData;

  // Calcular costo final unitario
  const totalAdditionalCosts =
    calculateTotalAdditionalCosts(unitAdditionalCosts);
  const finalUnitCost =
    unitProductCost + unitShippingCost + totalAdditionalCosts;

  // Calcular precio de venta final después de descuentos
  const finalSellingPrice = grossSellingPrice * (1 - promotionalDiscount / 100);

  // Calcular deducciones
  const platformFeeAmount = finalSellingPrice * (platformFeePercent / 100);
  const paymentFeeAmount = finalSellingPrice * (paymentFeePercent / 100);
  const taxesAmount = finalSellingPrice * (taxesAndRetentions / 100);
  const totalDeductions =
    platformFeeAmount + paymentFeeAmount + taxesAmount + sellerShippingCost;

  // Calcular ingreso neto por venta
  const netIncomePerSale = finalSellingPrice - totalDeductions;

  // Calcular margen bruto y neto
  const grossProfitMargin =
    ((finalSellingPrice - finalUnitCost) / finalSellingPrice) * 100;
  const netProfitMargin =
    ((netIncomePerSale - finalUnitCost) / finalSellingPrice) * 100;

  // Calcular ROI
  const roi = calculateRoi(netIncomePerSale - finalUnitCost, finalUnitCost);

  // Calcular precio de equilibrio
  const breakEvenPrice = calculateBreakEvenPrice(
    finalUnitCost,
    platformFeePercent,
    paymentFeePercent
  );

  return {
    finalUnitCost,
    finalSellingPrice,
    netIncomePerSale,
    grossProfitMargin,
    netProfitMargin,
    roi,
    breakEvenPrice,
  };
};

/**
 * Calcula la rentabilidad para el modo por lotes
 * @param {Object} costData - Datos de costos por lotes
 * @param {Object} salesData - Datos de ventas
 * @returns {Object} Rentabilidad calculada
 */
export const calculateBatchProfitability = (costData, salesData) => {
  const { batchTotalCost, batchQuantity, batchAdditionalCosts } = costData;
  const {
    grossSellingPrice,
    promotionalDiscount,
    platformFeePercent,
    paymentFeePercent,
    taxesAndRetentions,
    sellerShippingCost,
  } = salesData;

  // Calcular costo final unitario
  const totalAdditionalCosts =
    calculateTotalAdditionalCosts(batchAdditionalCosts);
  const totalBaseCost = batchTotalCost + totalAdditionalCosts;
  const finalUnitCost = calculateUnitCost(totalBaseCost, batchQuantity);

  // Calcular precio de venta final después de descuentos
  const finalSellingPrice = grossSellingPrice * (1 - promotionalDiscount / 100);

  // Calcular deducciones
  const platformFeeAmount = finalSellingPrice * (platformFeePercent / 100);
  const paymentFeeAmount = finalSellingPrice * (paymentFeePercent / 100);
  const taxesAmount = finalSellingPrice * (taxesAndRetentions / 100);
  const totalDeductions =
    platformFeeAmount + paymentFeeAmount + taxesAmount + sellerShippingCost;

  // Calcular ingreso neto por venta
  const netIncomePerSale = finalSellingPrice - totalDeductions;

  // Calcular margen bruto y neto
  const grossProfitMargin =
    ((finalSellingPrice - finalUnitCost) / finalSellingPrice) * 100;
  const netProfitMargin =
    ((netIncomePerSale - finalUnitCost) / finalSellingPrice) * 100;

  // Calcular ROI
  const roi = calculateRoi(netIncomePerSale - finalUnitCost, finalUnitCost);

  // Calcular precio de equilibrio
  const breakEvenPrice = calculateBreakEvenPrice(
    finalUnitCost,
    platformFeePercent,
    paymentFeePercent
  );

  return {
    finalUnitCost,
    finalSellingPrice,
    netIncomePerSale,
    grossProfitMargin,
    netProfitMargin,
    roi,
    breakEvenPrice,
  };
};
