import React from "react";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";

/**
 * MetricDisplay — Compact projection metric.
 * Visually quieter than result KPIs (lighter borders, smaller text).
 */
const MetricDisplay = ({ label, totalValue, unitValue, valueColor = "var(--ctz-text-primary)" }) => (
  <div style={{
    textAlign: "center",
    padding: "12px 10px",
    borderRadius: "6px",
    border: "1px solid var(--ctz-border)",
    background: "transparent",
  }}>
    <span style={{
      display: "block",
      fontSize: "0.625rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: "var(--ctz-text-muted)",
      marginBottom: "3px",
    }}>
      {label}
    </span>
    <span style={{
      display: "block",
      fontSize: "1.125rem",
      fontWeight: 700,
      color: valueColor,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    }}>
      {totalValue}
    </span>
    <span style={{
      display: "block",
      fontSize: "0.625rem",
      color: "var(--ctz-text-muted)",
      marginTop: "3px",
      opacity: 0.7,
    }}>
      {unitValue}
    </span>
  </div>
);

/**
 * VolumeAnalysisCard — Projection section (Tier 3: complementary).
 * Visually quieter than the result hero. Uses dashed border + no shadow.
 */
const VolumeAnalysisCard = (props) => (
  <div
    style={{
      borderRadius: "var(--ctz-radius-md)",
      border: "1px dashed var(--ctz-border)",
      padding: "16px 20px",
      background: "transparent",
    }}
  >
    {/* Header */}
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "12px", flexWrap: "wrap", gap: "10px",
    }}>
      <div>
        <span style={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--ctz-text-secondary)",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}>
          Proyección
        </span>
        <span style={{
          display: "block",
          fontSize: "0.6875rem",
          color: "var(--ctz-text-muted)",
          marginTop: "1px",
        }}>
          Estimación para el volumen proyectado.
        </span>
      </div>
      <div style={{ width: "140px" }}>
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
      gap: "8px",
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
