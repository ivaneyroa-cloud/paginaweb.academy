import React from "react";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { CopyIcon } from "@/shared/components/icons";

/**
 * ExecutiveSummary — Sticky sidebar with grouped cost breakdown.
 *
 * Layout:
 *   ┌─────────────────────────┐
 *   │  RESUMEN EJECUTIVO      │
 *   ├── Producto ─────────────┤
 *   │  Valor FOB     $100.00  │
 *   │  Categoría   Acc. Pers  │
 *   ├── Envío ────────────────┤
 *   │  Standard       $608.00 │
 *   │  ▸ Tarifa pref. aplicada│
 *   ├── Impuestos ────────────┤
 *   │  Imp+Tasas      $140.62 │
 *   ├── Totales ──────────────┤
 *   │  Costos Imp.    $750.42 │
 *   │  ═══════════════════════│
 *   │  COSTO FINAL   $850.42  │
 *   │  [  Copiar Total  ]     │
 *   └─────────────────────────┘
 *
 * All CSS variables, dark/light parity.
 */
export const ExecutiveSummary = ({
  costoEnvio = 0,
  totalImpuestos = 0,
  gastoDocumental = 0,
  costoImportacion = 0,
  costoFinalTotal = 0,
  valorFob = 0,
  tipoEnvio = "standard",
  aplicoDescuento = false,
  codigoDescuento = "",
  categoriaSeleccionada = null,
  pesoComputableTotal = 0,
  cantidadCajas = 0,
}) => {
  const { copy, copied } = useClipboard();

  const fmt = (v) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  /* ─── Shared styles ─── */
  const groupTitle = {
    margin: 0,
    padding: "0 0 6px",
    fontSize: "0.625rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--ctz-text-muted)",
  };

  const row = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "5px 0",
    fontSize: "0.8125rem",
  };

  const label = {
    fontWeight: 500,
    color: "var(--ctz-text-secondary)",
  };

  const value = {
    fontWeight: 600,
    color: "var(--ctz-text-primary)",
    fontVariantNumeric: "tabular-nums",
    textAlign: "right",
  };

  const divider = {
    height: "1px",
    background: "var(--ctz-border)",
    margin: "14px 0",
  };

  return (
    <div
      className="ctz-executive-summary"
      style={{
        background: "var(--ctz-bg-elevated)",
        border: "1px solid var(--ctz-accent)",
        borderRadius: "var(--ctz-radius-md)",
        boxShadow: "var(--ctz-shadow-md)",
      }}
    >
      {/* ═══ HEADER ═══ */}
      <h3
        style={{
          margin: "0 0 14px",
          fontSize: "0.6875rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--ctz-text-muted)",
        }}
      >
        Resumen
      </h3>

      {/* ═══ GROUP 1: Producto ═══ */}
      <p style={groupTitle}>Producto</p>
      <div style={row}>
        <span style={label}>Valor FOB</span>
        <span style={value}>{fmt(valorFob)}</span>
      </div>
      {categoriaSeleccionada && (
        <div style={row}>
          <span style={label}>Categoría</span>
          <span
            style={{
              ...value,
              fontWeight: 500,
              fontSize: "0.75rem",
              maxWidth: "140px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {categoriaSeleccionada.nombre}
          </span>
        </div>
      )}
      {pesoComputableTotal > 0 && (
        <div style={row}>
          <span style={label}>Peso Facturable</span>
          <span style={{ ...value, fontWeight: 500 }}>
            {pesoComputableTotal.toFixed(2)} kg
            {cantidadCajas > 0 && (
              <span style={{ color: "var(--ctz-text-muted)", fontSize: "0.6875rem", marginLeft: "4px" }}>
                ({cantidadCajas} {cantidadCajas === 1 ? "caja" : "cajas"})
              </span>
            )}
          </span>
        </div>
      )}

      <div style={divider} />

      {/* ═══ GROUP 2: Envío ═══ */}
      <p style={groupTitle}>Envío Internacional</p>
      <div style={row}>
        <span style={label}>
          {tipoEnvio === "express" ? "Express" : "Standard"}
        </span>
        <span
          style={{
            ...value,
            color: aplicoDescuento ? "var(--ctz-success)" : "var(--ctz-text-primary)",
          }}
        >
          {fmt(costoEnvio)}
        </span>
      </div>
      {aplicoDescuento && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "2px",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "var(--ctz-success)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Tarifa preferencial
        </div>
      )}

      <div style={divider} />

      {/* ═══ GROUP 3: Impuestos ═══ */}
      <p style={groupTitle}>Impuestos y tasas</p>
      <div style={row}>
        <span style={label}>Total impositivo</span>
        <span style={value}>{fmt(totalImpuestos + gastoDocumental)}</span>
      </div>

      <div style={divider} />

      {/* ═══ GROUP 4: Totales ═══ */}
      <p style={groupTitle}>Totales</p>
      <div style={row}>
        <span style={{ ...label, fontWeight: 600, color: "var(--ctz-text-primary)" }}>
          Costo de importación
        </span>
        <span style={{ ...value, fontWeight: 700 }}>{fmt(costoImportacion)}</span>
      </div>

      {/* Hero total */}
      <div
        style={{
          marginTop: "12px",
          paddingTop: "14px",
          borderTop: "2px solid var(--ctz-accent)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 800,
            color: "var(--ctz-text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          Total estimado
        </span>
        <span
          style={{
            fontSize: "1.375rem",
            fontWeight: 800,
            color: "var(--ctz-accent)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {fmt(costoFinalTotal)}
        </span>
      </div>

      <p
        style={{
          margin: "3px 0 0",
          fontSize: "0.625rem",
          color: "var(--ctz-text-muted)",
          textAlign: "right",
          letterSpacing: "0.02em",
        }}
      >
        FOB + Envío + Impuestos
      </p>

      {/* Copy button */}
      <button
        onClick={() => copy(costoFinalTotal.toFixed(2))}
        style={{
          width: "100%",
          marginTop: "14px",
          padding: "9px",
          fontSize: "0.8125rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          background: "var(--ctz-bg-secondary)",
          color: "var(--ctz-text-primary)",
          border: "1px solid var(--ctz-border)",
          borderRadius: "var(--ctz-radius-sm)",
          cursor: "pointer",
          transition: "all 200ms ease-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--ctz-border-hover)";
          e.currentTarget.style.background = "var(--ctz-bg-tertiary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--ctz-border)";
          e.currentTarget.style.background = "var(--ctz-bg-secondary)";
        }}
      >
        <CopyIcon style={{ width: "15px", height: "15px" }} />
        {copied ? "Copiado ✓" : "Copiar total"}
      </button>
    </div>
  );
};
