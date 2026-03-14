import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/shared/lib/formatters";

// Colores para cada segmento del gráfico
const COLORS = {
  freight: "#0ea5e9", // sky-500
  importDuty: "#f59e0b", // amber-500
  statisticalFee: "#06b6d4", // cyan-500
  iva: "#ef4444", // red-500
  iva10_5: "#8b5cf6", // violet-500
  customs: "#10b981", // emerald-500
};

export const CostChart = ({
  fob,
  quantity,
  totalComputableWeight,
  internationalFreight,
  taxes,
  customsDocumentalFee,
}) => {
  // Calcular total de costos de envío (sin FOB)
  const shippingCosts =
    internationalFreight +
    Object.values(taxes).reduce((sum, tax) => sum + tax.amount, 0) +
    customsDocumentalFee;

  // Preparar datos para el gráfico - solo costos de envío
  const chartData = [
    {
      name: "Flete Internacional",
      value: internationalFreight,
      color: COLORS.freight,
      percentage: ((internationalFreight / shippingCosts) * 100).toFixed(1),
    },
    {
      name: taxes.importDuty.name,
      value: taxes.importDuty.amount,
      color: COLORS.importDuty,
      percentage: ((taxes.importDuty.amount / shippingCosts) * 100).toFixed(1),
    },
    {
      name: taxes.statisticalFee.name,
      value: taxes.statisticalFee.amount,
      color: COLORS.statisticalFee,
      percentage: ((taxes.statisticalFee.amount / shippingCosts) * 100).toFixed(
        1
      ),
    },
    {
      name: taxes.iva.name,
      value: taxes.iva.amount,
      color: COLORS.iva,
      percentage: ((taxes.iva.amount / shippingCosts) * 100).toFixed(1),
    },
    {
      name: taxes.iva10_5.name,
      value: taxes.iva10_5.amount,
      color: COLORS.iva10_5,
      percentage: ((taxes.iva10_5.amount / shippingCosts) * 100).toFixed(1),
    },
    {
      name: "Tasa Documental",
      value: customsDocumentalFee,
      color: COLORS.customs,
      percentage: ((customsDocumentalFee / shippingCosts) * 100).toFixed(1),
    },
  ].filter((item) => item.value > 0); // Filtrar valores cero

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-sky-200">
          <div className="font-medium text-slate-700">{data.name}</div>
          <div className="text-sky-600 font-semibold">
            {formatCurrency(data.value)} ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  // Componente personalizado para la leyenda
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-slate-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl shadow-lg border border-sky-400/90 bg-white/80 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* Columna izquierda: Datos compactos */}
        <div className="flex flex-col justify-between">
          {/* Costos de envío destacados */}
          <div className="mb-3">
            <div className="text-sm text-slate-600 mb-1">Costos de Envío</div>
            <div className="text-xl sm:text-2xl font-bold text-sky-700 mb-3">
              {formatCurrency(shippingCosts)}
            </div>

            {/* Datos del producto - en una sola línea */}
            <div className="text-xs text-slate-600">
              <span className="font-medium">FOB:</span> {formatCurrency(fob)} -{" "}
              <span className="font-medium">Qty:</span>{" "}
              {quantity.toLocaleString()} -{" "}
              <span className="font-medium">Peso computable:</span>{" "}
              {totalComputableWeight.toFixed(1)}kg
            </div>
          </div>

          {/* Leyendas compactas */}
          <div>
            <div className="text-xs font-medium text-slate-700 mb-1">
              Distribución:
            </div>
            <div className="grid grid-cols-1 gap-1">
              {chartData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600 truncate flex-1 min-w-0">
                    {entry.name}
                  </span>
                  <span className="font-medium text-slate-800 text-right">
                    {formatCurrency(entry.value)}
                  </span>
                  <span className="text-slate-500 text-xs w-8 text-right">
                    {entry.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha: Gráfico */}
        <div className="flex items-center justify-center">
          <div className="w-full h-[160px] sm:h-[180px] lg:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius="65%"
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
