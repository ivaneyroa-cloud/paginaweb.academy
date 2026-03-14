import React from "react";
import { FaScaleUnbalanced as CategoryIcon } from "react-icons/fa6";

/**
 * ImpuestosTasasCardV2 — Open section (no card wrapper) for tax breakdown.
 * Uses CSS variables for dark/light parity.
 */
export const ImpuestosTasasCardV2 = ({
  categoriaSeleccionada,
  valorCif,
  impuestos,
  totalImpuestos,
  gastoDocumental,
}) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
  };

  const labelStyle = {
    fontSize: "0.8125rem",
    color: "var(--ctz-text-secondary)",
    fontWeight: 500,
  };

  const valueStyle = {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "var(--ctz-text-primary)",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <div>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <CategoryIcon size={18} style={{ color: "var(--ctz-accent)" }} />
        <h2
          style={{
            margin: 0,
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: "var(--ctz-text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          Impuestos y Tasas
        </h2>
      </div>

      {/* Category badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 12px",
          background: "var(--ctz-accent-light)",
          borderRadius: "var(--ctz-radius-pill)",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--ctz-accent)",
          marginBottom: "16px",
        }}
      >
        Categoría: {categoriaSeleccionada.nombre}
      </div>

      {/* Tax rows */}
      <div
        style={{
          borderLeft: "2px solid var(--ctz-border-hover)",
          paddingLeft: "14px",
        }}
      >
        <div style={rowStyle}>
          <span style={labelStyle}>
            {impuestos.importDuty.name} ({impuestos.importDuty.percentage.toFixed(1)}%)
          </span>
          <span style={valueStyle}>{formatCurrency(impuestos.importDuty.amount)}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>
            {impuestos.statisticalFee.name} ({impuestos.statisticalFee.percentage.toFixed(1)}%)
          </span>
          <span style={valueStyle}>{formatCurrency(impuestos.statisticalFee.amount)}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>
            {impuestos.iva.name} ({impuestos.iva.percentage.toFixed(1)}%)
          </span>
          <span style={valueStyle}>{formatCurrency(impuestos.iva.amount)}</span>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Gasto Documental Aduana</span>
          <span style={valueStyle}>{formatCurrency(gastoDocumental)}</span>
        </div>
      </div>

      {/* Total */}
      <div
        style={{
          marginTop: "14px",
          paddingTop: "14px",
          borderTop: "1px solid var(--ctz-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "var(--ctz-text-primary)",
          }}
        >
          Total Impuestos y Tasas
        </span>
        <span
          style={{
            fontSize: "1.0625rem",
            fontWeight: 700,
            color: "var(--ctz-accent)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatCurrency(totalImpuestos + gastoDocumental)}
        </span>
      </div>
    </div>
  );
};
