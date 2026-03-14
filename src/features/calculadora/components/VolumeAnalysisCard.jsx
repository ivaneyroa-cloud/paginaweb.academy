import React from "react";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency, formatUnits } from "@/shared/lib/formatters";
import { BarChartIcon } from "@/shared/components/icons";

/**
 * Componente para mostrar métricas individuales
 */
const MetricDisplay = ({
  label,
  totalValue,
  unitValue,
  valueColorClass = "text-slate-800",
  bgClass = "bg-slate-50/80",
}) => (
  <div
    className={`text-center ${bgClass} p-5 rounded-xl border border-slate-200`}
  >
    <p className="text-sm text-slate-600 truncate">{label}</p>
    <p className={`text-4xl font-extrabold ${valueColorClass} truncate`}>
      {totalValue}
    </p>
    <p className="text-xs text-slate-500">{unitValue}</p>
  </div>
);

/**
 * Card de Análisis de Volumen e Inversión
 */
const VolumeAnalysisCard = (props) => (
  <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 p-6 rounded-2xl shadow-lg border border-sky-200/40">
    {/* Header */}
    <h3 className="text-xl font-bold text-slate-800 text-center mb-4">
      Análisis de Volumen e Inversión
    </h3>
    
    {/* Descripción */}
    <p className="text-sm text-slate-600 text-center mb-6 max-w-2xl mx-auto leading-relaxed">
      Ingresá la cantidad de unidades que planeás vender para ver la proyección completa de tu negocio: 
      ingresos totales, inversión necesaria y ganancia esperada para ese volumen.
    </p>

    {/* Paso 1: Input */}
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="flex items-end gap-2">
        <Input
          label="Cantidad de Unidades a Proyectar"
          value={props.quantity}
          onChange={props.onQuantityChange}
          placeholder="Ingrese cantidad"
          prefix="u."
          className="font-bold"
        />
      </div>
    </div>

    {/* Paso 3: Métricas */}
    <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricDisplay
        label="Facturación Proyectada"
        totalValue={formatCurrency(props.projectedRevenue)}
        unitValue={`US$ ${formatCurrency(props.unitSellingPrice)}`}
        valueColorClass="text-slate-800"
      />
      <MetricDisplay
        label="Ingresos Netos Proyectados"
        totalValue={formatCurrency(props.projectedNetIncome)}
        unitValue={`US$ ${formatCurrency(props.unitNetIncome)}`}
        valueColorClass="text-sky-700"
      />
      <MetricDisplay
        label="Costo de Inversión"
        totalValue={formatCurrency(props.totalInvestment)}
        unitValue={`US$ ${formatCurrency(props.unitCost)}`}
        valueColorClass="text-rose-600"
      />
      <MetricDisplay
        label="Ganancia Neta Proyectada"
        totalValue={formatCurrency(props.projectedNetProfit)}
        unitValue={`US$ ${formatCurrency(props.netProfitPerSale)}`}
        valueColorClass={
          props.projectedNetProfit >= 0 ? "text-emerald-600" : "text-red-600"
        }
      />
    </div>
  </div>
);

export default VolumeAnalysisCard;
