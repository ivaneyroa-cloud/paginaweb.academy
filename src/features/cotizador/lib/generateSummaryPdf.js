import jsPDF from "jspdf";
import * as Calcs from "./calculations";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value ?? 0);

const formatWeight = (value) => `${value.toFixed(2)} kg`;

/**
 * Ensure there is enough available space on the current PDF page; otherwise add a new page.
 * @param {import('jspdf').jsPDF} doc
 * @param {number} y
 * @param {number} margin
 * @param {number} requiredSpace
 * @returns {number} Updated Y position
 */
const ensureSpace = (doc, y, margin, requiredSpace = 0) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + requiredSpace > pageHeight - margin) {
    doc.addPage();
    return margin;
  }
  return y;
};

/**
 * Genera un PDF con el resumen detallado de la cotización.
 * @param {Object} data
 */
export const generateSummaryPdf = (data) => {
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

  const finalCostWithFob = finalCost + fob;
  const finalUnitCostWithFob = quantity > 0 ? finalCostWithFob / quantity : 0;
  const finalCostWithOutFob = finalCost;
  const finalUnitCostWithOutFob = finalUnitCost;

  const taxesToDisplay = [taxes.importDuty, taxes.statisticalFee];
  if (taxes.iva.percentage > 0) {
    taxesToDisplay.push(taxes.iva);
  } else if (taxes.iva10_5.percentage > 0) {
    taxesToDisplay.push(taxes.iva10_5);
  }
  const sanitizedTaxes = taxesToDisplay.filter(Boolean);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 18;
  let y = margin;

  const addKeyValue = (label, value) => {
    y = ensureSpace(doc, y, margin, lineHeight);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(label, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(value, margin + contentWidth / 2, y, { align: "left" });
    y += lineHeight;
  };

  const addBullet = (text) => {
    y = ensureSpace(doc, y, margin, lineHeight);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`• ${text}`, margin + 8, y);
    y += lineHeight - 2;
  };

  const startSection = (title) => {
    y = ensureSpace(doc, y, margin, lineHeight * 2.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text(title, margin, y);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, y + 6, margin + contentWidth, y + 6);
    y += lineHeight + 6;
    doc.setFontSize(11);
  };

  const now = new Date();
  const timestamp = now.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const pad = (value) => value.toString().padStart(2, "0");
  const timestampForFilename = `${pad(now.getDate())}-${pad(
    now.getMonth() + 1
  )}-${now.getFullYear()}-${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // === HEADER CON LOGO IZQUIERDO ===
  const logo = new Image();
  logo.src = "/logo.png"; // desde /public

  logo.onload = () => {
    const logoWidth = 90;
    const logoHeight = 36;
    const logoX = margin;
    const logoY = margin - 10;

    // Dibuja el logo
    doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

    // Título centrado en la parte superior
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("Resumen de Cotización", pageWidth / 2, logoY + 25, {
      align: "center",
    });

    // Subtítulo (debajo del título)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generado por Shippar · ${timestamp}`, pageWidth / 2, logoY + 42, {
      align: "center",
    });

    // Línea divisoria
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.line(margin, logoY + 50, margin + contentWidth, logoY + 50);
    y = logoY + 80;

    // === SECCIONES ===
    startSection("Detalles del Producto");
    addKeyValue("Categoría", selectedCategoryName);
    addKeyValue("Cantidad", `${quantity} unidades`);
    addKeyValue("Valor FOB", formatCurrency(fob));
    addKeyValue("Costo final por unidad", formatCurrency(finalUnitCostWithFob));

    y += lineHeight + 6;
    startSection("Logística");
    addKeyValue("Número de cajas", boxes.length.toString());

    boxes.forEach((box, index) => {
      y += 3;
      const volumetric = Calcs.calculateVolumetricWeight(
        box.length,
        box.width,
        box.height
      );
      const computable = Calcs.calculateComputableWeight(
        box.weight,
        volumetric
      );
      addBullet(
        `Caja ${index + 1}: ${box.weight.toFixed(2)} kgs -- ${box.length}×${
          box.width
        }×${box.height}cm - ${volumetric.toFixed(
          2
        )} kg volumétrico -- ${computable.toFixed(2)} kgs computable`
      );
    });
    y += 4;
    addKeyValue("Peso total computable", formatWeight(totalComputableWeight));
    // Mostrar tarifa por kg si está disponible
    if (typeof freightRatePerKg !== "undefined" && freightRatePerKg !== null) {
      addKeyValue("Tarifa por kg", formatCurrency(freightRatePerKg) + " / kg");
    }
    addKeyValue("Envío internacional", formatCurrency(internationalFreight));

    y += lineHeight + 6;
    startSection("Impuestos y tasas");
    sanitizedTaxes.forEach((tax) => {
      addKeyValue(
        `${tax.name} (${(tax.percentage * 100).toFixed(1)}%)`,
        formatCurrency(tax.amount)
      );
    });
    addKeyValue(
      "Gasto documental de aduana",
      formatCurrency(customsDocumentalFee)
    );
    addKeyValue(
      "Total impuestos y tasas",
      formatCurrency(totalTaxes + customsDocumentalFee)
    );

    y += lineHeight + 6;
    startSection("Costos finales");
    addKeyValue("Inversión FOB", formatCurrency(fob));
    addKeyValue(
      "Costos logísticos (envío + impuestos)",
      formatCurrency(finalCostWithOutFob)
    );
    addKeyValue("Costo final total", formatCurrency(finalCostWithFob));
    addKeyValue("Costo final por unidad", formatCurrency(finalUnitCostWithFob));

    // Guarda el PDF con un nombre que incluya la fecha y hora actuales
    doc.save(`shippar_resumen_cotizacion_[${timestampForFilename}].pdf`);
  };
};
