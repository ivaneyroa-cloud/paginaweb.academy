import React from "react";
import { Card } from "./Card";

// Icons
import { FaScaleUnbalanced as CategoryIcon } from "react-icons/fa6";

/**
 * ImpuestosTasasCardV2 - Tarjeta de impuestos con cálculo en cascada
 * 
 * Orden de cálculo:
 * 1. IVA sobre Valor CIF
 * 2. Tasa Estadística sobre Valor CIF
 * 3. Derechos de Importación sobre (Valor CIF + IVA)
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.categoriaSeleccionada - Categoría seleccionada
 * @param {number} props.valorCif - Valor CIF
 * @param {Object} props.impuestos - Objeto con impuestos calculados
 * @param {number} props.totalImpuestos - Total de impuestos
 * @param {number} props.gastoDocumental - Gasto documental de aduana
 */
export const ImpuestosTasasCardV2 = ({
  categoriaSeleccionada,
  valorCif,
  impuestos,
  totalImpuestos,
  gastoDocumental,
}) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <Card
      title="Impuestos y Tasas"
      icon={<CategoryIcon size={22} />}
      className="transition-all duration-300 hover:shadow-xl bg-slate-50"
    >
      {/* Banner de categoría */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-blue-800">
            Categoría: <strong>{categoriaSeleccionada.nombre}</strong>
          </span>
        </div>
      </div>

      {/* Banner explicativo del cálculo en cascada */}
      <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <p className="text-xs text-slate-700">
          <strong>Cálculos:</strong>
          <br />
          1. Tasa estadística e Derechos de Importación se calculan sobre el Valor CIF.
          <br />
        2. El IVA se calcula sobre el Valor CIF + Derechos de Importación.
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <h3 className="font-semibold mb-2 text-slate-700">
          Desglose de Impuestos:
        </h3>

        {/* Derechos de Importación - calculados sobre el CIF */}
        <div className="pl-2 border-l-2 border-slate-300">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">
              {impuestos.importDuty.name}{" "}
              ({impuestos.importDuty.percentage.toFixed(1)}%)
            </span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(impuestos.importDuty.amount)}
            </span>
          </div>
        </div>

        {/* Tasa Estadística - calculada sobre CIF */}
        <div className="pl-2 border-l-2 border-slate-300">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">
              {impuestos.statisticalFee.name}{" "}
              ({impuestos.statisticalFee.percentage.toFixed(1)}%)
            </span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(impuestos.statisticalFee.amount)}
            </span>
          </div>
        </div>
        
        {/* IVA - calculado sobre (CIF + Derechos de Importación) */}
        <div className="pl-2 border-l-2 border-slate-300">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">
              {impuestos.iva.name} ({impuestos.iva.percentage.toFixed(1)}%)
            </span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(impuestos.iva.amount)}
            </span>
          </div>
        </div>

        {/* Gasto Documental */}
        <div className="flex justify-between items-center">
          <span className="text-slate-700 font-medium">Gasto Documental Aduana</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(gastoDocumental)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
        <span className="font-bold text-slate-800">
          Costo Total Impuestos y Tasas
        </span>
        <span className="font-bold text-lg text-sky-700">
          {formatCurrency(totalImpuestos + gastoDocumental)}
        </span>
      </div>
    </Card>
  );
};
