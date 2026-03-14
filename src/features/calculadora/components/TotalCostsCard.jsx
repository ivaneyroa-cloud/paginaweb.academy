import React from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";

// Icons

import { CoinsIcon, TrashIcon, PlusIcon } from "@/shared/components/icons";

// --- Local Components ---
const ModeButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex-1 ${
      isActive
        ? "bg-sky-600 text-white shadow"
        : "bg-transparent text-slate-600 hover:bg-sky-100"
    }`}
  >
    {label}
  </button>
);

// Props y Componente de los costos dinámicos (agregar/quitar costos adicionales).
const DynamicCostInput = ({ costs, onAdd, onRemove, onUpdate }) => (
  <div>
    <div className="space-y-3">
      {costs.map((cost) => (
        <div key={cost.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-6">
            <input
              type="text"
              value={cost.name}
              onChange={(e) => onUpdate(cost.id, "name", e.target.value)}
              placeholder="Nombre del costo"
              className="w-full bg-white rounded-md border-2 border-slate-300 shadow-md focus:border-sky-500 focus:ring-sky-500 sm:text-sm transition-all duration-200 py-1.5 px-2 hover:border-slate-400"
            />
          </div>
          <div className="col-span-5 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
              <span className="text-slate-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={cost.amount === 0 ? "" : cost.amount}
              onChange={(e) =>
                onUpdate(cost.id, "amount", parseFloat(e.target.value) || 0)
              }
              placeholder="0"
              className="w-full bg-white rounded-md border-2 border-slate-300 shadow-md focus:border-sky-500 focus:ring-sky-500 sm:text-sm transition-all duration-200 py-1.5 pl-6 pr-2 cursor-pointer hover:border-slate-400"
            />
          </div>
          <div className="col-span-1">
            <button
              onClick={() => onRemove(cost.id)}
              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-100 cursor-pointer"
              aria-label={`Eliminar ${cost.name}`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
    <button
      onClick={onAdd}
      className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-sky-600 font-semibold p-2 rounded-md hover:bg-sky-100 transition-colors border-2 border-dashed border-slate-300 hover:border-sky-400 cursor-pointer"
    >
      <PlusIcon className="h-4 w-4" />
      Agregar Otro Costo
    </button>
  </div>
);

export const TotalCostsCard = (props) => {
  const { mode, onModeChange } = props;

  const totalUnitAdditionalCosts = props.unitAdditionalCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );
  const unitSubtotal =
    props.unitProductCost + props.unitShippingCost + totalUnitAdditionalCosts;

  const totalBatchAdditionalCosts = props.batchAdditionalCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );
  const totalBaseCost =
    props.batchTotalCost + props.batchShippingCost + totalBatchAdditionalCosts;

  return (
    <Card title="Costos asociados al producto" icon={<CoinsIcon size={24} />}>
      <div className="mb-4 p-1 bg-slate-200/70 rounded-lg flex">
        <ModeButton
          label="Por Lote"
          isActive={mode === "batch"}
          onClick={() => onModeChange("batch")}
        />
        <ModeButton
          label="Por Unidad"
          isActive={mode === "unit"}
          onClick={() => onModeChange("unit")}
        />
      </div>

      {/* Explicación del modo seleccionado */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-amber-600">💡</span>
          <div className="text-sm text-amber-800">
            {mode === "unit" ? (
              <span>
                <strong>Modo Por Unidad:</strong> Ideal cuando ya conocés el
                costo exacto de cada unidad. Ejemplo: compraste cables USB a $2
                cada uno.
              </span>
            ) : (
              <span>
                <strong>Modo Por Lote:</strong> Ideal cuando compraste un lote
                completo. Ejemplo: pagaste $600 por 300 cables USB y querés
                calcular el costo unitario.
              </span>
            )}
          </div>
        </div>
      </div>

      {mode === "unit" ? (
        <div className="space-y-4">
          <Input
            label="Costo del producto (por unidad)"
            value={props.unitProductCost}
            onChange={props.onUnitProductCostChange}
            prefix="$"
            tip="Precio que pagaste por cada unidad del producto. Ejemplo: Si compraste 300 cables USB por $600 total, acá ponés $2."
          />
          <Input
            label="Costo de importación (por unidad)"
            value={props.unitShippingCost}
            onChange={props.onUnitShippingCostChange}
            prefix="$"
            tip="Costo de importación por unidad. 💡 <strong>Tip:</strong> Podés calcularlo exactamente usando nuestro <strong>Cotizador de Envío</strong>."
          />
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Otros costos unitarios
            </label>
            <div className="text-xs text-slate-500 mb-3">
              💡 Ejemplos: packaging especial ($0.20), etiquetas ($0.05),
              marketing por unidad ($0.15), almacenamiento ($0.03)
            </div>
            <DynamicCostInput
              costs={props.unitAdditionalCosts}
              onAdd={props.onAddUnitAdditionalCost}
              onRemove={props.onRemoveUnitAdditionalCost}
              onUpdate={props.onUpdateUnitAdditionalCost}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Subtotal por unidad</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(unitSubtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">
                Costo total por unidad
              </span>
              <span className="font-bold text-lg text-sky-700">
                {formatCurrency(props.finalUnitCost)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // MODO POR LOTE
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 items-end">
            <Input
              label="Costo total del lote"
              value={props.batchTotalCost}
              onChange={props.onBatchTotalCostChange}
              prefix="$"
              className="mb-0"
              tip="Precio total que pagaste por toda la compra. Ejemplo: $600 por 300 cables USB."
            />
            <Input
              label="Cantidad de unidades"
              value={props.batchQuantity}
              onChange={props.onBatchQuantityChange}
              className="mb-0"
              tip="Cuántas unidades compraste en total. Ejemplo: 300 cables USB."
            />
          </div>
          <Input
            label="Costo de importación (del lote)"
            value={props.batchShippingCost}
            onChange={props.onBatchShippingCostChange}
            prefix="$"
            tip="Costo total de importación para todo el lote. 💡 <strong>Tip:</strong> Obtené este número exacto usando nuestro <strong>Cotizador de Envío</strong> - incluye flete, impuestos, despacho y tasas."
          />
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Otros costos adicionales totales
            </label>
            <div className="text-xs text-slate-500 mb-3">
              💡 Ejemplos: packaging especial ($60), etiquetas ($15), campaña de
              marketing ($50), almacenamiento ($10)
            </div>
            <DynamicCostInput
              costs={props.batchAdditionalCosts}
              onAdd={props.onAddBatchAdditionalCost}
              onRemove={props.onRemoveBatchAdditionalCost}
              onUpdate={props.onUpdateBatchAdditionalCost}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Costo base total</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(totalBaseCost)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">
                Costo unitario final
              </span>
              <span className="font-bold text-lg text-sky-700">
                {formatCurrency(props.finalUnitCost)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global Multiplier Section y Costo Final */}
      <div className="mt-4 pt-3 border-t border-slate-200 space-y-0">
        <h3 className="text-base font-semibold text-slate-700">
          Multiplicador Global
        </h3>
        <p className="text-xs text-slate-500 mb-2">
          Simula márgenes, imprevistos o reglas de negocio.
        </p>

        <div className="grid grid-cols-2 gap-4 items-end">
          <Input
            label="Multiplicador"
            value={props.globalMultiplier}
            onChange={props.onGlobalMultiplierChange}
            placeholder="1"
            className="mb-0 font-bold"
            prefix="x"
          />

          {/* Resultado destacado */}
          <div className="bg-sky-50 rounded-lg p-4 text-center border border-sky-200">
            <p className="text-sm font-medium text-slate-600">
              Costo Unitario Ajustado
            </p>
            <p className="font-extrabold text-2xl text-indigo-600">
              {formatCurrency(props.adjustedUnitCost)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
