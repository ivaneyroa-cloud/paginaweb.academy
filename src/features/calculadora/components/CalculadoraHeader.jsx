import React from "react";
import { BsCalculator as CalculatorIcon } from "react-icons/bs";

/**
 * CalculadoraHeader — Compact header matching CotizadorHeaderV2 visual language.
 * Uses --ctz-* tokens. Description hidden on mobile via CSS class.
 */
export default function CalculadoraHeader() {
  return (
    <div
      className="ctz-header-card"
      style={{
        background: "var(--ctz-bg-elevated)",
        borderRadius: "var(--ctz-radius-lg)",
        border: "1px solid var(--ctz-border)",
        boxShadow: "var(--ctz-shadow-sm)",
        padding: "20px 24px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Icon */}
      <div
        className="ctz-header-icon"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "var(--ctz-radius-sm)",
          background: "var(--ctz-accent-light)",
          border: "1px solid var(--ctz-accent-ring)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--ctz-accent)",
        }}
      >
        <CalculatorIcon size={20} />
      </div>

      {/* Title + Desc */}
      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--ctz-text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Calculadora de Rentabilidad
        </h1>
        <p
          className="ctz-header-desc"
          style={{
            margin: "4px 0 0",
            fontSize: "0.8125rem",
            color: "var(--ctz-text-secondary)",
            lineHeight: 1.5,
          }}
        >
          Analizá la rentabilidad por unidad de tu operación.
        </p>
      </div>
    </div>
  );
}