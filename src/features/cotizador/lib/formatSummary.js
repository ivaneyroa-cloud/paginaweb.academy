import * as Calcs from "./calculations";

// Helper para formatear moneda
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

/**
 * Genera un string de texto plano con el resumen de la cotización.
 * @param {Object} data - Datos del resumen de la cotización
 * @returns {string} Resumen formateado
 */
export const formatSummary = (data) => {
  const {
    selectedCategoryName,
    quantity,
    fob,
    boxes,
    totalComputableWeight,
    freightRatePerKg,
    taxes,
    totalTaxes,
    customsDocumentalFee,
    internationalFreight,
    finalCost,
    finalUnitCost,
  } = data;

  const taxesToDisplay = [taxes.importDuty, taxes.statisticalFee];
  if (taxes.iva.percentage > 0) {
    taxesToDisplay.push(taxes.iva);
  } else if (taxes.iva10_5.percentage > 0) {
    taxesToDisplay.push(taxes.iva10_5);
  }

  // Header
  const lines = [
    `📋 *COTIZACIÓN DE IMPORTACIÓN - SHIPPAR*`,
    ``,
    `📦 *PRODUCTO:*`,
    `• Categoría: ${selectedCategoryName}`,
    `• Cantidad: ${quantity} unidades`,
    `• Valor FOB: *${formatCurrency(fob)}*`,
    `• Costo final por unidad: *${formatCurrency(finalUnitCost)}*`,
    ``,
  ];

  // Logística
  lines.push(`🚚 *LOGÍSTICA*`);
  lines.push(`• Cajas: ${boxes.length}`);

  boxes.forEach((box, index) => {
    const computable = Calcs.calculateComputableWeight(
      box.weight,
      Calcs.calculateVolumetricWeight(box.length, box.width, box.height)
    );
    lines.push(
      `  - Caja ${index + 1}: ${box.length}×${box.width}×${
        box.height
      }cm | ${computable.toFixed(1)}kg`
    );
  });

  lines.push(`• Peso total: ${totalComputableWeight.toFixed(1)} kg`);
  // Mostrar tarifa por kg
  if (typeof freightRatePerKg !== "undefined" && freightRatePerKg !== null) {
    lines.push(`• Tarifa por kg: ${formatCurrency(freightRatePerKg)} / kg`);
  }
  lines.push(`• Flete internacional: ${formatCurrency(internationalFreight)}`);
  lines.push(``);

  // Impuestos
  lines.push(`🧾 *IMPUESTOS Y TASAS*`);

  taxesToDisplay.forEach((tax) => {
    lines.push(
      `• ${tax.name} (${(tax.percentage * 100).toFixed(1)}%): ${formatCurrency(
        tax.amount
      )}`
    );
  });

  lines.push(`• Gasto documental: ${formatCurrency(customsDocumentalFee)}`);
  lines.push(
    `*Total impuestos: ${formatCurrency(totalTaxes + customsDocumentalFee)}*`
  );
  lines.push(``);

  // Desglose de costos
  lines.push(`💰 *DESGLOSE FINAL*`);
  lines.push(`• Valor FOB: ${formatCurrency(fob)}`);
  lines.push(`• Flete internacional: ${formatCurrency(internationalFreight)}`);
  lines.push(
    `• Impuestos y tasas: ${formatCurrency(totalTaxes + customsDocumentalFee)}`
  );
  lines.push(``);

  // Totales finales con nomenclatura actualizada
  const finalCostWithFob = finalCost + fob;
  const finalCostWithOutFob = finalCost; // logistic cost without FOB
  const finalUnitCostWithOutFob = finalUnitCost; // logistic unit cost without FOB

  lines.push(`📊 *COSTOS FINALES*`);
  lines.push(
    `*Costo Final total (incluyendo FOB): ${formatCurrency(finalCostWithFob)}*`
  );
  lines.push(
    `*Costo Final Total Logístico (sin FOB): ${formatCurrency(
      finalCostWithOutFob
    )}*`
  );
  lines.push(
    `*Costo Unitario Logístico Final (sin FOB): ${formatCurrency(
      finalUnitCostWithOutFob
    )}*`
  );
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
