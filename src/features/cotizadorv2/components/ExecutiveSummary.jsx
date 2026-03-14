import React from "react";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { CopyIcon } from "@/shared/components/icons";

/**
 * ExecutiveSummary — Sticky sidebar panel showing the cost breakdown at a glance.
 * This is the visual "destination" of the cotizador flow.
 * All inline styles with CSS variables for dark/light parity.
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
}) => {
  const { copy, copied } = useClipboard();

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const lineStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "8px 0",
    fontSize: "0.8125rem",
  };

  const labelStyle = {
    fontWeight: 500,
    color: "var(--ctz-text-secondary)",
  };

  const valueStyle = {
    fontWeight: 600,
    color: "var(--ctz-text-primary)",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <div
      style={{
        position: "sticky",
        top: "80px",
        background: "var(--ctz-bg-elevated)",
        border: "1px solid var(--ctz-accent)",
        borderRadius: "var(--ctz-radius-md)",
        padding: "24px",
        boxShadow: "var(--ctz-shadow-md)",
      }}
    >
      {/* Title */}
      <h3
        style={{
          margin: "0 0 16px",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--ctz-text-muted)",
        }}
      >
        Resumen ejecutivo
      </h3>

      {/* Line items */}
      <div style={lineStyle}>
        <span style={labelStyle}>Precio FOB</span>
        <span style={valueStyle}>{formatCurrency(valorFob)}</span>
      </div>

      <div
        style={{
          height: "1px",
          background: "var(--ctz-border)",
          margin: "4px 0",
        }}
      />

      <div style={lineStyle}>
        <span style={labelStyle}>
          Envío {tipoEnvio === "express" ? "Express" : "Standard"}
          {aplicoDescuento && (
            <span
              style={{
                display: "inline-block",
                marginLeft: "6px",
                fontSize: "0.625rem",
                fontWeight: 600,
                color: "var(--ctz-success)",
                background: "var(--ctz-success-light)",
                padding: "1px 6px",
                borderRadius: "var(--ctz-radius-pill)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Dto
            </span>
          )}
        </span>
        <span style={{
          ...valueStyle,
          color: aplicoDescuento ? "var(--ctz-success)" : "var(--ctz-text-primary)",
        }}>
          {formatCurrency(costoEnvio)}
        </span>
      </div>

      <div style={lineStyle}>
        <span style={labelStyle}>Impuestos y Tasas</span>
        <span style={valueStyle}>{formatCurrency(totalImpuestos + gastoDocumental)}</span>
      </div>

      <div
        style={{
          height: "1px",
          background: "var(--ctz-border)",
          margin: "4px 0",
        }}
      />

      <div style={lineStyle}>
        <span style={{ ...labelStyle, fontWeight: 600, color: "var(--ctz-text-primary)" }}>
          Costos de Importación
        </span>
        <span style={{ ...valueStyle, fontWeight: 700 }}>
          {formatCurrency(costoImportacion)}
        </span>
      </div>

      {/* Total — the hero number */}
      <div
        style={{
          marginTop: "12px",
          paddingTop: "16px",
          borderTop: "2px solid var(--ctz-accent)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 800,
              color: "var(--ctz-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Costo Final Total
          </span>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--ctz-accent)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
            }}
          >
            {formatCurrency(costoFinalTotal)}
          </span>
        </div>

        <p
          style={{
            margin: "4px 0 0",
            fontSize: "0.6875rem",
            color: "var(--ctz-text-muted)",
            textAlign: "right",
          }}
        >
          FOB + Envío + Impuestos
        </p>
      </div>

      {/* Copy button */}
      <button
        onClick={() => copy(costoFinalTotal.toFixed(2))}
        style={{
          width: "100%",
          marginTop: "16px",
          padding: "10px",
          fontSize: "0.8125rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
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
        <CopyIcon style={{ width: "16px", height: "16px" }} />
        {copied ? "¡Copiado!" : "Copiar Total"}
      </button>
    </div>
  );
};
