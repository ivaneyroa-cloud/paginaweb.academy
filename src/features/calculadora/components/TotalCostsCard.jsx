import React, { useState } from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";
import { CoinsIcon, TrashIcon, PlusIcon } from "@/shared/components/icons";
import { HiChevronDown } from "react-icons/hi";

/* ── Mode Toggle (matches cotizador ShippingMethodSelector) ── */
const ModeButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: "7px 12px",
      fontSize: "0.8125rem",
      fontWeight: 600,
      borderRadius: "var(--ctz-radius-sm)",
      border: "none",
      cursor: "pointer",
      transition: "all 200ms ease-out",
      ...(isActive
        ? {
            background: "var(--ctz-accent)",
            color: "#fff",
            boxShadow: "0 1px 4px rgba(29, 161, 255, 0.25)",
          }
        : {
            background: "transparent",
            color: "var(--ctz-text-secondary)",
          }),
    }}
  >
    {label}
  </button>
);

/* ── Dynamic Cost Row ── */
const DynamicCostRow = ({ cost, onRemove, onUpdate }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: "8px", alignItems: "center" }}>
    <input
      type="text" value={cost.name}
      onChange={(e) => onUpdate(cost.id, "name", e.target.value)}
      placeholder="Concepto"
      style={{
        padding: "7px 10px", fontSize: "0.8125rem",
        background: "var(--ctz-bg-input)", color: "var(--ctz-text-primary)",
        border: "1px solid var(--ctz-border)", borderRadius: "var(--ctz-radius-sm)",
        outline: "none", transition: "border-color 200ms",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border-focus)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border)"; }}
    />
    <div style={{ position: "relative" }}>
      <span style={{
        position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
        fontSize: "0.8125rem", color: "var(--ctz-text-muted)", pointerEvents: "none",
      }}>$</span>
      <input
        type="number" value={cost.amount === 0 ? "" : cost.amount}
        onChange={(e) => onUpdate(cost.id, "amount", parseFloat(e.target.value) || 0)}
        placeholder="0"
        style={{
          width: "100%", padding: "7px 10px 7px 22px", fontSize: "0.8125rem",
          background: "var(--ctz-bg-input)", color: "var(--ctz-text-primary)",
          border: "1px solid var(--ctz-border)", borderRadius: "var(--ctz-radius-sm)",
          outline: "none", transition: "border-color 200ms",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border-focus)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border)"; }}
      />
    </div>
    <button onClick={() => onRemove(cost.id)} aria-label={`Eliminar ${cost.name}`}
      style={{
        width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--ctz-error-light)", color: "var(--ctz-error)",
        border: "none", borderRadius: "6px", cursor: "pointer", transition: "opacity 200ms",
      }}
    >
      <TrashIcon style={{ width: "14px", height: "14px" }} />
    </button>
  </div>
);

/* ══════════════════════════════════════ */
export const TotalCostsCard = (props) => {
  const { mode, onModeChange } = props;
  const [showAdvanced, setShowAdvanced] = useState(
    props.globalMultiplier !== 1 || props.unitAdditionalCosts.length > 0 || props.batchAdditionalCosts.length > 0
  );

  const costs = mode === "unit" ? props.unitAdditionalCosts : props.batchAdditionalCosts;

  return (
    <Card
      title="Costos"
      icon={<CoinsIcon size={20} />}
      tooltip="Ingresá el costo total por unidad: precio del producto + importación + extras opcionales."
    >
      {/* Mode toggle */}
      <div style={{
        display: "flex",
        padding: "3px",
        background: "var(--ctz-bg-secondary)",
        borderRadius: "var(--ctz-radius-sm)",
        marginBottom: "16px",
      }}>
        <ModeButton label="Lote" isActive={mode === "batch"} onClick={() => onModeChange("batch")} />
        <ModeButton label="Unidad" isActive={mode === "unit"} onClick={() => onModeChange("unit")} />
      </div>

      {/* ── PRIMARY INPUTS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mode === "unit" ? (
          <>
            <Input label="Costo del producto" value={props.unitProductCost}
              onChange={props.onUnitProductCostChange} prefix="$"
              tip="Precio por unidad del producto." />
            <Input label="Costo de importación" value={props.unitShippingCost}
              onChange={props.onUnitShippingCostChange} prefix="$"
              tip="Costo de importación por unidad." />
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input label="Costo total del lote" value={props.batchTotalCost}
                onChange={props.onBatchTotalCostChange} prefix="$" />
              <Input label="Cantidad de unidades" value={props.batchQuantity}
                onChange={props.onBatchQuantityChange} />
            </div>
            <Input label="Costo de importación (lote)" value={props.batchShippingCost}
              onChange={props.onBatchShippingCostChange} prefix="$" />
          </>
        )}
      </div>

      {/* ── ADVANCED TOGGLE ── */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          marginTop: "14px", padding: "0", background: "none", border: "none",
          cursor: "pointer", fontSize: "0.8125rem", fontWeight: 500,
          color: "var(--ctz-text-muted)", transition: "color 200ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ctz-text-secondary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ctz-text-muted)"; }}
      >
        <HiChevronDown size={14} style={{
          transition: "transform 200ms",
          transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
        }} />
        {showAdvanced ? "Ocultar ajustes" : "Costos adicionales y multiplicador"}
      </button>

      {/* ── ADVANCED SECTION ── */}
      {showAdvanced && (
        <div style={{
          marginTop: "12px", paddingTop: "12px",
          borderTop: "1px solid var(--ctz-border)",
        }}>
          {/* Dynamic costs */}
          <label style={{
            display: "block", fontSize: "0.8125rem", fontWeight: 500,
            color: "var(--ctz-text-secondary)", marginBottom: "8px",
          }}>
            {mode === "unit" ? "Otros costos unitarios" : "Otros costos del lote"}
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {costs.map((cost) => (
              <DynamicCostRow key={cost.id} cost={cost}
                onRemove={mode === "unit" ? props.onRemoveUnitAdditionalCost : props.onRemoveBatchAdditionalCost}
                onUpdate={mode === "unit" ? props.onUpdateUnitAdditionalCost : props.onUpdateBatchAdditionalCost}
              />
            ))}
            <button
              onClick={mode === "unit" ? props.onAddUnitAdditionalCost : props.onAddBatchAdditionalCost}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                padding: "7px", fontSize: "0.8125rem", fontWeight: 500,
                color: "var(--ctz-accent)", background: "transparent",
                border: "1px solid var(--ctz-border)", borderRadius: "var(--ctz-radius-sm)",
                cursor: "pointer", transition: "all 200ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ctz-accent)"; e.currentTarget.style.background = "var(--ctz-accent-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border)"; e.currentTarget.style.background = "transparent"; }}
            >
              <PlusIcon style={{ width: "14px", height: "14px" }} />
              Agregar costo
            </button>
          </div>

          {/* Multiplier */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "end" }}>
            <Input label="Multiplicador" value={props.globalMultiplier}
              onChange={props.onGlobalMultiplierChange} placeholder="1" prefix="x" />
            <div style={{
              padding: "10px 14px", background: "var(--ctz-accent-light)", borderRadius: "var(--ctz-radius-sm)",
              border: "1px solid var(--ctz-accent-ring)", textAlign: "center",
            }}>
              <span style={{
                display: "block", fontSize: "0.6875rem", fontWeight: 500, color: "var(--ctz-text-muted)",
                textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px",
              }}>Ajustado</span>
              <span style={{
                fontSize: "1.125rem", fontWeight: 700, color: "var(--ctz-accent)", fontVariantNumeric: "tabular-nums",
              }}>{formatCurrency(props.adjustedUnitCost)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTOTAL (always visible) ── */}
      <div style={{
        marginTop: "14px", paddingTop: "12px",
        borderTop: "1px solid var(--ctz-border)",
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
      }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--ctz-text-secondary)" }}>
          Costo unitario
        </span>
        <span style={{
          fontSize: "1.25rem", fontWeight: 700, color: "var(--ctz-accent)",
          fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em",
        }}>
          {formatCurrency(props.adjustedUnitCost)}
        </span>
      </div>
    </Card>
  );
};
