import React from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";
import { CoinsIcon, TrashIcon, PlusIcon } from "@/shared/components/icons";

/* ── Mode Toggle ── */
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
            boxShadow: "var(--ctz-shadow-sm)",
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

/* ── Dynamic Cost Inputs ── */
const DynamicCostInput = ({ costs, onAdd, onRemove, onUpdate }) => (
  <div>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {costs.map((cost) => (
        <div key={cost.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            value={cost.name}
            onChange={(e) => onUpdate(cost.id, "name", e.target.value)}
            placeholder="Concepto"
            style={{
              padding: "7px 10px",
              fontSize: "0.8125rem",
              background: "var(--ctz-bg-input)",
              color: "var(--ctz-text-primary)",
              border: "1px solid var(--ctz-border-hover)",
              borderRadius: "var(--ctz-radius-sm)",
              outline: "none",
              transition: "border-color 200ms",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border-focus)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border-hover)"; }}
          />
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
              fontSize: "0.8125rem", color: "var(--ctz-text-muted)", pointerEvents: "none",
            }}>$</span>
            <input
              type="number"
              value={cost.amount === 0 ? "" : cost.amount}
              onChange={(e) => onUpdate(cost.id, "amount", parseFloat(e.target.value) || 0)}
              placeholder="0"
              style={{
                width: "100%",
                padding: "7px 10px 7px 22px",
                fontSize: "0.8125rem",
                background: "var(--ctz-bg-input)",
                color: "var(--ctz-text-primary)",
                border: "1px solid var(--ctz-border-hover)",
                borderRadius: "var(--ctz-radius-sm)",
                outline: "none",
                transition: "border-color 200ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border-focus)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border-hover)"; }}
            />
          </div>
          <button
            onClick={() => onRemove(cost.id)}
            aria-label={`Eliminar ${cost.name}`}
            style={{
              width: "28px", height: "28px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--ctz-error-light)",
              color: "var(--ctz-error)",
              border: "none", borderRadius: "6px",
              cursor: "pointer", transition: "opacity 200ms",
            }}
          >
            <TrashIcon style={{ width: "14px", height: "14px" }} />
          </button>
        </div>
      ))}
    </div>
    <button
      onClick={onAdd}
      style={{
        marginTop: "8px",
        width: "100%",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        padding: "8px",
        fontSize: "0.8125rem",
        fontWeight: 600,
        color: "var(--ctz-accent)",
        background: "transparent",
        border: "1px dashed var(--ctz-border-hover)",
        borderRadius: "var(--ctz-radius-sm)",
        cursor: "pointer",
        transition: "all 200ms",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ctz-accent)"; e.currentTarget.style.background = "var(--ctz-accent-light)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border-hover)"; e.currentTarget.style.background = "transparent"; }}
    >
      <PlusIcon style={{ width: "14px", height: "14px" }} />
      Agregar costo
    </button>
  </div>
);

/* ── Subtotal Row ── */
const SubtotalRow = ({ label, value, isHero = false }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: isHero ? "0" : "0",
  }}>
    <span style={{
      fontSize: isHero ? "0.875rem" : "0.8125rem",
      fontWeight: isHero ? 700 : 400,
      color: isHero ? "var(--ctz-text-primary)" : "var(--ctz-text-secondary)",
    }}>
      {label}
    </span>
    <span style={{
      fontSize: isHero ? "1.0625rem" : "0.875rem",
      fontWeight: isHero ? 700 : 500,
      color: isHero ? "var(--ctz-accent)" : "var(--ctz-text-primary)",
      fontVariantNumeric: "tabular-nums",
    }}>
      {formatCurrency(value)}
    </span>
  </div>
);

/* ══════════════════════════════════════ */
export const TotalCostsCard = (props) => {
  const { mode, onModeChange } = props;

  const totalUnitAdditionalCosts = props.unitAdditionalCosts.reduce(
    (sum, cost) => sum + cost.amount, 0
  );
  const unitSubtotal = props.unitProductCost + props.unitShippingCost + totalUnitAdditionalCosts;

  const totalBatchAdditionalCosts = props.batchAdditionalCosts.reduce(
    (sum, cost) => sum + cost.amount, 0
  );
  const totalBaseCost = props.batchTotalCost + props.batchShippingCost + totalBatchAdditionalCosts;

  return (
    <Card title="Costos" icon={<CoinsIcon size={20} />}>
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

      {/* Mode hint */}
      <p style={{
        margin: "0 0 16px",
        padding: "8px 12px",
        fontSize: "0.75rem",
        color: "var(--ctz-text-muted)",
        background: "var(--ctz-bg-secondary)",
        borderRadius: "var(--ctz-radius-sm)",
        lineHeight: 1.5,
      }}>
        {mode === "unit"
          ? "Ingresá el costo por unidad."
          : "Ingresá el costo total del lote y la cantidad de unidades."}
      </p>

      {/* ── UNIT MODE ── */}
      {mode === "unit" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input
            label="Costo del producto"
            value={props.unitProductCost}
            onChange={props.onUnitProductCostChange}
            prefix="$"
            tip="Precio que pagaste por cada unidad del producto."
          />
          <Input
            label="Costo de importación"
            value={props.unitShippingCost}
            onChange={props.onUnitShippingCostChange}
            prefix="$"
            tip="Costo de importación por unidad. Podés calcularlo con el Cotizador."
          />
          <div>
            <label style={{
              display: "block", fontSize: "0.8125rem", fontWeight: 500,
              color: "var(--ctz-text-secondary)", marginBottom: "6px",
            }}>
              Otros costos unitarios
            </label>
            <DynamicCostInput
              costs={props.unitAdditionalCosts}
              onAdd={props.onAddUnitAdditionalCost}
              onRemove={props.onRemoveUnitAdditionalCost}
              onUpdate={props.onUpdateUnitAdditionalCost}
            />
          </div>

          {/* Subtotal */}
          <div style={{
            paddingTop: "12px",
            borderTop: "1px solid var(--ctz-border)",
            display: "flex", flexDirection: "column", gap: "6px",
          }}>
            <SubtotalRow label="Subtotal por unidad" value={unitSubtotal} />
            <SubtotalRow label="Costo total por unidad" value={props.finalUnitCost} isHero />
          </div>
        </div>
      ) : (
        /* ── BATCH MODE ── */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input
              label="Costo total del lote"
              value={props.batchTotalCost}
              onChange={props.onBatchTotalCostChange}
              prefix="$"
              tip="Precio total que pagaste por toda la compra."
            />
            <Input
              label="Cantidad de unidades"
              value={props.batchQuantity}
              onChange={props.onBatchQuantityChange}
              tip="Cuántas unidades compraste en total."
            />
          </div>
          <Input
            label="Costo de importación (lote)"
            value={props.batchShippingCost}
            onChange={props.onBatchShippingCostChange}
            prefix="$"
            tip="Costo total de importación. Podés obtenerlo con el Cotizador."
          />
          <div>
            <label style={{
              display: "block", fontSize: "0.8125rem", fontWeight: 500,
              color: "var(--ctz-text-secondary)", marginBottom: "6px",
            }}>
              Otros costos del lote
            </label>
            <DynamicCostInput
              costs={props.batchAdditionalCosts}
              onAdd={props.onAddBatchAdditionalCost}
              onRemove={props.onRemoveBatchAdditionalCost}
              onUpdate={props.onUpdateBatchAdditionalCost}
            />
          </div>

          {/* Subtotal */}
          <div style={{
            paddingTop: "12px",
            borderTop: "1px solid var(--ctz-border)",
            display: "flex", flexDirection: "column", gap: "6px",
          }}>
            <SubtotalRow label="Costo base total" value={totalBaseCost} />
            <SubtotalRow label="Costo unitario final" value={props.finalUnitCost} isHero />
          </div>
        </div>
      )}

      {/* ── MULTIPLIER ── */}
      <div style={{
        marginTop: "16px",
        paddingTop: "16px",
        borderTop: "1px solid var(--ctz-border)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "10px",
        }}>
          <div>
            <span style={{
              fontSize: "0.8125rem", fontWeight: 600,
              color: "var(--ctz-text-primary)",
            }}>
              Multiplicador
            </span>
            <span style={{
              display: "block",
              fontSize: "0.6875rem",
              color: "var(--ctz-text-muted)",
              marginTop: "1px",
            }}>
              Ajuste por imprevistos o reglas de negocio
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" }}>
          <Input
            value={props.globalMultiplier}
            onChange={props.onGlobalMultiplierChange}
            placeholder="1"
            prefix="x"
          />
          <div style={{
            background: "var(--ctz-accent-light)",
            borderRadius: "var(--ctz-radius-sm)",
            padding: "10px 14px",
            textAlign: "center",
            border: "1px solid var(--ctz-accent-ring)",
          }}>
            <span style={{
              display: "block",
              fontSize: "0.6875rem",
              fontWeight: 500,
              color: "var(--ctz-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "2px",
            }}>
              Costo ajustado
            </span>
            <span style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--ctz-accent)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {formatCurrency(props.adjustedUnitCost)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
