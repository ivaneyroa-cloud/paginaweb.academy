import React from "react";

// Icons
import { ArrowUpIcon } from "@/shared/components/icons";

// Formatters
import { formatCurrency } from "@/shared/lib/formatters";

/**
 * Componente para mostrar el punto de equilibrio de precio
 * @param {Object} props
 * @param {number} props.breakEvenPrice - Precio de punto de equilibrio
 */
const BreakEvenPriceCard = ({ breakEvenPrice }) => (
  <div className="bg-gradient-to-br from-sky-100 to-fuchsia-200 p-8 rounded-2xl shadow-md border border-fuchsia-200 text-center my-6">
    {/* Header con título e info */}
    <div className="flex items-center justify-center gap-2">
      <h3 className="text-xl font-bold text-slate-700">
        Punto de Equilibrio de Precio
      </h3>
    </div>

    {/* Descripción */}
    <p className="text-sm text-slate-700 mt-1 max-w-md mx-auto">
      Precio de venta mínimo necesario para cubrir todos los costos y no perder
      dinero.
    </p>

    {/* Valor destacado */}
    <div className="mt-6 flex items-center justify-center gap-4">
      <ArrowUpIcon className="h-14 w-14 text-fuchsia-500" />
      <span className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-fuchsia-700">
        {formatCurrency(breakEvenPrice)}
      </span>
    </div>
  </div>
);

export default BreakEvenPriceCard;
