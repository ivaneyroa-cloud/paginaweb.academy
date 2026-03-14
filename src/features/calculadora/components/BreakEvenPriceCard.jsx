import React from "react";
import { formatCurrency } from "@/shared/lib/formatters";

/**
 * BreakEvenPriceCard — Now a compact KPI card that sits inline with ResultCards.
 * No more fuchsia gradient. Uses --ctz-* tokens.
 */
const BreakEvenPriceCard = ({ breakEvenPrice }) => (
  <div
    style={{
      background: "var(--ctz-bg-elevated)",
      border: "1px solid var(--ctz-border)",
      borderRadius: "var(--ctz-radius-md)",
      padding: "16px 18px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      boxShadow: "var(--ctz-shadow-sm)",
      transition: "border-color 250ms",
    }}
  >
    <span style={{
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: "var(--ctz-text-muted)",
    }}>
      Precio mínimo
    </span>
    <span style={{
      fontSize: "1.75rem",
      fontWeight: 800,
      color: "var(--ctz-warning)",
      marginTop: "6px",
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    }}>
      {formatCurrency(breakEvenPrice)}
    </span>
    <span style={{
      fontSize: "0.6875rem",
      color: "var(--ctz-text-muted)",
      marginTop: "4px",
    }}>
      Para cubrir costos
    </span>
  </div>
);

export default BreakEvenPriceCard;
