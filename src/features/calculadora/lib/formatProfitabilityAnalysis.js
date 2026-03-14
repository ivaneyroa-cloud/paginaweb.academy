import {
  formatCurrency,
  formatPercent,
  formatUnits,
  formatMonths,
} from "@/shared/lib/formatters";

/**
 * Genera un string de texto plano con el resumen del análisis de rentabilidad.
 * @param {Object} data - Datos del análisis de rentabilidad
 * @returns {string} Análisis formateado
 */
export const formatProfitabilityAnalysis = (data) => {
  const {
    calculationMode,
    unitProductCost,
    unitShippingCost,
    unitAdditionalCosts,
    batchTotalCost,
    batchShippingCost,
    batchQuantity,
    batchAdditionalCosts,
    globalMultiplier,
    grossSellingPrice,
    promotionalDiscount,
    platformFeePercent,
    paymentFeePercent,
    installmentFeePercent,
    taxesAndRetentions,
    sellerShippingCost,
    finalSellingPrice,
    platformFeeAmount,
    paymentFeeAmount,
    installmentFeeAmount,
    taxesAmount,
    totalDeductions,
    totalInvestment,
    finalUnitCost,
    adjustedUnitCost,
    netIncomePerSale,
    netProfitPerSale,
    marginOnRevenue,
    roi,
    breakEvenPrice,
    breakEvenUnits,
    projectedQuantity,
    projectedRevenue,
    projectedNetIncome,
    projectedNetProfit,
  } = data;

  // Determinar si es rentable
  const isProfitable = netProfitPerSale > 0;
  const profitStatus = isProfitable ? "✅ RENTABLE" : "⚠️ NO RENTABLE";

  // Header
  const lines = [
    `📊 *ANÁLISIS DE RENTABILIDAD - SHIPPAR*`,
    ``,
    `🎯 *RESULTADO: ${profitStatus}*`,
    `💰 Ganancia por venta: *${formatCurrency(netProfitPerSale)}*`,
    `📊 ROI: *${formatPercent(roi)}*`,
    `📈 Margen: *${formatPercent(marginOnRevenue)}*`,
    ``,
  ];

  // Costos
  lines.push(`💰 *COSTOS*`);
  if (calculationMode === "unit") {
    lines.push(`• Producto: ${formatCurrency(unitProductCost)}`);
    lines.push(`• Envío: ${formatCurrency(unitShippingCost)}`);
    if (unitAdditionalCosts.length > 0) {
      unitAdditionalCosts.forEach((cost) => {
        lines.push(
          `• ${cost.name || "Adicional"}: ${formatCurrency(cost.amount)}`
        );
      });
    }
  } else {
    lines.push(`• Lote total: ${formatCurrency(batchTotalCost)}`);
    lines.push(`• Envío lote: ${formatCurrency(batchShippingCost)}`);
    lines.push(`• Cantidad: ${formatUnits(batchQuantity)}`);
    if (batchAdditionalCosts.length > 0) {
      batchAdditionalCosts.forEach((cost) => {
        lines.push(
          `• ${cost.name || "Adicional"}: ${formatCurrency(cost.amount)}`
        );
      });
    }
  }

  if (globalMultiplier !== 1) {
    lines.push(`• Multiplicador: ×${globalMultiplier}`);
  }

  lines.push(`*Costo final por unidad: ${formatCurrency(adjustedUnitCost)}*`);
  lines.push(``);

  // Ventas
  lines.push(`💸 *VENTAS*`);
  lines.push(`• Precio bruto: ${formatCurrency(grossSellingPrice)}`);

  if (promotionalDiscount > 0) {
    lines.push(
      `• Descuento (${promotionalDiscount}%): -${formatCurrency(
        grossSellingPrice * (promotionalDiscount / 100)
      )}`
    );
  }

  lines.push(`• Precio final: *${formatCurrency(finalSellingPrice)}*`);
  lines.push(``);
  lines.push(`🏪 *DEDUCCIONES*`);
  lines.push(
    `• Comisión plataforma (${platformFeePercent}%): -${formatCurrency(
      platformFeeAmount
    )}`
  );
  lines.push(
    `• Comisión pago (${paymentFeePercent}%): -${formatCurrency(
      paymentFeeAmount
    )}`
  );

  if (installmentFeePercent > 0 && installmentFeeAmount > 0) {
    lines.push(
      `• Cuotas ML (${installmentFeePercent}%): -${formatCurrency(
        installmentFeeAmount
      )}`
    );
  }

  if (taxesAndRetentions > 0) {
    lines.push(
      `• Impuestos (${taxesAndRetentions}%): -${formatCurrency(taxesAmount)}`
    );
  }

  if (sellerShippingCost > 0) {
    lines.push(`• Envío asumido: -${formatCurrency(sellerShippingCost)}`);
  }

  lines.push(`*Total deducciones: -${formatCurrency(totalDeductions)}*`);
  lines.push(`*Ingreso neto: ${formatCurrency(netIncomePerSale)}*`);
  lines.push(``);

  // Proyección
  lines.push(`🚀 *PROYECCIÓN ${formatUnits(projectedQuantity)} UNIDADES*`);
  lines.push(`• Inversión total: ${formatCurrency(totalInvestment)}`);
  lines.push(`• Facturación: ${formatCurrency(projectedRevenue)}`);
  lines.push(`• Ingreso neto: ${formatCurrency(projectedNetIncome)}`);

  if (projectedNetProfit >= 0) {
    lines.push(`• *Ganancia total: ${formatCurrency(projectedNetProfit)}*`);
  } else {
    lines.push(`• *Pérdida total: ${formatCurrency(projectedNetProfit)}*`);
  }

  // Punto de equilibrio
  if (breakEvenUnits > 0 && isFinite(breakEvenUnits) && isProfitable) {
    lines.push(
      `• Unidades equilibrio: ${formatUnits(Math.ceil(breakEvenUnits))}`
    );
  }

  lines.push(`• Precio equilibrio: ${formatCurrency(breakEvenPrice)}`);
  lines.push(``);

  // Footer
  lines.push(`📊 Generado por SHIPPAR`);
  lines.push(
    `🕒 ${new Date().toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`
  );

  return lines.join("\n");
};
