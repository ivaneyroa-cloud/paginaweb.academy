import React from "react";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";

/**
 * MetricDisplay — Compact projection metric.
 */
const MetricDisplay = ({ label, totalValue, unitValue, valueColor = "var(--ctz-text-primary)" }) => (
  <div style={{
    textAlign: "center",
    background: "var(--ctz-bg-secondary)",
    padding: "14px 12px",
    borderRadius: "var(--ctz-radius-sm)",
    border: "1px solid var(--ctz-border)",
  }}>
    <span style={{
      display: "block",
      fontSize: "0.6875rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: "var(--ctz-text-muted)",
      marginBottom: "4px",
    }}>
      {label}
    </span>
    <span style={{
      display: "block",
      fontSize: "1.375rem",
      fontWeight: 800,
      color: valueColor,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    }}>
      {totalValue}
    </span>
    <span style={{
      display: "block",
      fontSize: "0.6875rem",
      color: "var(--ctz-text-muted)",
      marginTop: "4px",
    }}>
      {unitValue}
    </span>
  </div>
);

/**
 * VolumeAnalysisCard — Projection section.
 * Uses --ctz-* tokens. Clean, integrated, no pastel gradients.
 */
const VolumeAnalysisCard = (props) => (
  <div
    style={{
      background: "var(--ctz-bg-elevated)",
      borderRadius: "var(--ctz-radius-md)",
      border: "1px solid var(--ctz-border)",
      boxShadow: "var(--ctz-shadow-sm)",
      padding: "20px",
    }}
  >
    {/* Header */}
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "16px", flexWrap: "wrap", gap: "12px",
    }}>
      <div>
        <span style={{
          fontSize: "0.9375rem",
          fontWeight: 700,
          color: "var(--ctz-text-primary)",
          letterSpacing: "-0.01em",
        }}>
          Proyección
        </span>
        <span style={{
          display: "block",
          fontSize: "0.75rem",
          color: "var(--ctz-text-muted)",
          marginTop: "2px",
        }}>
          Ingresos, inversión y ganancia para el volumen proyectado.
        </span>
      </div>
      <div style={{ width: "160px" }}>
        <Input
          label="Unidades"
          value={props.quantity}
          onChange={props.onQuantityChange}
          prefix="u."
        />
      </div>
    </div>

    {/* Metrics grid */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "10px",
    }}
      className="calc-metrics-grid"
    >
      <MetricDisplay
        label="Facturación"
        totalValue={formatCurrency(props.projectedRevenue)}
        unitValue={`${formatCurrency(props.unitSellingPrice)} /u`}
        valueColor="var(--ctz-text-primary)"
      />
      <MetricDisplay
        label="Ingresos netos"
        totalValue={formatCurrency(props.projectedNetIncome)}
        unitValue={`${formatCurrency(props.unitNetIncome)} /u`}
        valueColor="var(--ctz-accent)"
      />
      <MetricDisplay
        label="Inversión"
        totalValue={formatCurrency(props.totalInvestment)}
        unitValue={`${formatCurrency(props.unitCost)} /u`}
        valueColor="var(--ctz-error)"
      />
      <MetricDisplay
        label="Ganancia neta"
        totalValue={formatCurrency(props.projectedNetProfit)}
        unitValue={`${formatCurrency(props.netProfitPerSale)} /u`}
        valueColor={props.projectedNetProfit >= 0 ? "var(--ctz-success)" : "var(--ctz-error)"}
      />
    </div>
  </div>
);

export default VolumeAnalysisCard;
