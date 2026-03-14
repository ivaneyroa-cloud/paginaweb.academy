import React from "react";
import { Card } from "./Card";

// Icons
import { FaScaleUnbalanced as CategoryIcon } from "react-icons/fa6";

/**
 * Tarjeta para visualizar el desglose de impuestos basado en la categoría seleccionada.
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.selectedCategory - Categoría seleccionada
 * @param {Object} props.taxes - Objeto con impuestos calculados
 * @param {number} props.totalTaxes - Total de impuestos
 * @param {number} props.customsDocumentalFee - Tasa documental de aduana
 */
export const CategoryCard = ({
  selectedCategory,
  taxes,
  totalTaxes,
  customsDocumentalFee,
}) => {
  // Función para formatear un número como moneda USD.
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Lógica para mostrar solo un tipo de IVA si es aplicable.
  const taxesToDisplay = [taxes.importDuty, taxes.statisticalFee];
  if (taxes.iva.percentage > 0) {
    taxesToDisplay.push(taxes.iva);
  } else if (taxes.iva10_5.percentage > 0) {
    taxesToDisplay.push(taxes.iva10_5);
  } else {
    // Si ninguna tasa de IVA aplica, se muestran ambas con valor cero.
    taxesToDisplay.push(taxes.iva, taxes.iva10_5);
  }

  return (
    <Card
      title="Impuestos y Tasas"
      icon={<CategoryIcon size={22} />}
      className=" transition-all duration-300 hover:shadow-xl"
    >
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-blue-800">
            Tipo de producto seleccionado:{" "}
            <strong>{selectedCategory.name}</strong>
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <h3 className="font-semibold mb-2 text-slate-700">
          Desglose de Impuestos y Tasas:
        </h3>
        {taxesToDisplay.map((tax) => (
          <div key={tax.name} className="flex justify-between items-center">
            <span className="text-slate-600">
              {tax.name} ({(tax.percentage * 100).toFixed(1)}%)
            </span>
            <span className="font-medium text-slate-800">
              {formatCurrency(tax.amount)}
            </span>
          </div>
        ))}
        <div key="customs-fee" className="flex justify-between items-center">
          <span className="text-slate-600">Gasto Documental Aduana</span>
          <span className="font-medium text-slate-800">
            {formatCurrency(customsDocumentalFee)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
        <span className="font-bold text-slate-800">
          Costo Total Impuestos y Tasas
        </span>
        <span className="font-bold text-lg text-sky-700">
          {formatCurrency(totalTaxes + customsDocumentalFee)}
        </span>
      </div>
    </Card>
  );
};
