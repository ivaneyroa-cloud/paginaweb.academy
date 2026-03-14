import React from "react";
import { Card } from "./Card";

// Icons
import { LuPlaneTakeoff as ShipIcon } from "react-icons/lu";

/**
 * Tarjeta unificada que muestra los costos de Envío.
 *
 * @param {Object} props - Props del componente
 * @param {number} props.totalComputableWeight - Peso computable total
 * @param {number} props.freightRate - Tarifa de flete por kg
 * @param {number} props.internationalFreight - Costo total del flete internacional
 */
export const ShippingCostsCard = ({
  totalComputableWeight,
  freightRate,
  internationalFreight,
}) => {
  // Función para formatear un número como moneda USD.
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <Card
      title="Envío Internacional"
      icon={<ShipIcon size={20} />}
      className=" transition-all duration-300 hover:shadow-xl"
    >
      {/* Contenedor para las filas de información, logrando un layout compacto. */}
      <div className="space-y-2 text-sm h-full flex flex-col justify-center">
        {/* Fila de Peso Computable */}
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Peso Computable (Kg)</span>
          <span className="font-medium text-slate-800">
            {totalComputableWeight.toFixed(2)}
          </span>
        </div>

        {/* Fila de Tarifa por Kg */}
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Tarifa por Kg</span>
          <span className="font-medium text-slate-800">
            {formatCurrency(freightRate)}
          </span>
        </div>

        {/* Fila de Envío Internacional con separador superior y estilo resaltado */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-200">
          <span className="font-bold text-slate-800">Envío Internacional</span>
          <span className="font-bold text-lg text-sky-700">
            {formatCurrency(internationalFreight)}
          </span>
        </div>
      </div>
    </Card>
  );
};
