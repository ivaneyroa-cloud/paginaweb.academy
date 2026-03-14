import React from "react";
import { Card } from "./Card";

// Icons
import { FaShip } from "react-icons/fa";
import { IoCalculatorOutline } from "react-icons/io5";

/**
 * ValorCifCard - Tarjeta que muestra el desglose del Valor CIF
 * CIF = Cost, Insurance and Freight
 *
 * @param {Object} props - Props del componente
 * @param {number} props.valorFob - Valor FOB
 * @param {number} props.envioInternacional - Costo del envío/flete
 * @param {number} props.seguro - Costo del seguro (1% de FOB + Envío)
 * @param {number} props.valorCif - Valor CIF total
 */
export const ValorCifCard = ({
  valorFob,
  envioInternacional,
  seguro,
  valorCif,
}) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <Card
      title="Valor CIF (Base Imponible)"
      icon={<IoCalculatorOutline size={22} />}
      className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-amber-50"
    >
      {/* Banner informativo */}
      <div className="mb-4 p-3 bg-amber-100 border-2 border-amber-300 rounded-lg">
        <div className="flex items-center gap-2">
          <FaShip className="text-amber-700 flex-shrink-0" size={20} />
          <div>
            <p className="text-xs font-bold text-amber-900">
              CIF = Cost + Insurance + Freight
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              Base para calcular impuestos y tasas
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        {/* FOB */}
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <span className="text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
            Valor FOB
          </span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(valorFob)}
          </span>
        </div>

        {/* Flete / Envío */}
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <span className="text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
            Flete / Envío Internacional
          </span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(envioInternacional)}
          </span>
        </div>

        {/* Seguro */}
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <span className="text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Seguro (1%)
          </span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(seguro)}
          </span>
        </div>

        {/* Separador y Valor CIF destacado */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-amber-400 bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <IoCalculatorOutline className="text-amber-700" size={20} />
            <span className="font-bold text-slate-900 text-base">Valor CIF</span>
          </div>
          <span className="font-bold text-2xl text-amber-700">
            {formatCurrency(valorCif)}
          </span>
        </div>
      </div>

      {/* Nota adicional */}
      <div className="mt-4 p-3 bg-white rounded-lg border-2 border-amber-200 text-xs text-slate-700">
        <strong>💡 Importante:</strong> Este es el valor sobre el cual se calculan los impuestos y tasas de importación.
      </div>
    </Card>
  );
};
