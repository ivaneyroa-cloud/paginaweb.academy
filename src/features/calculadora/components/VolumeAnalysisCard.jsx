import React from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";
import { IoTrendingUpOutline as TrendIcon } from "react-icons/io5";

/**
 * MetricDisplay — Compact projection metric.
 * Same card pattern as the rest of the system.
 */
const MetricDisplay = ({ label, totalValue, unitValue, valueColor = "var(--ctz-text-primary)" }) => (
  <div style={{
    textAlign: "center",
    padding: "14px 12px",
    borderRadius: "var(--ctz-radius-sm)",
    border: "1px solid var(--ctz-border)",
    background: "var(--ctz-bg-secondary)",
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
      fontSize: "1.25rem",
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
      fontSize: "0.6875rem",
      color: "var(--ctz-text-muted)",
      marginTop: "4px",
    }}>
      {unitValue}
    </span>
  </div>
);

/**
 * VolumeAnalysisCard — Uses the same Card component as everything else.
 * Visually consistent with cotizador cards.
 */
const VolumeAnalysisCard = (props) => (
  <Card
    title="Proyección"
    icon={<TrendIcon size={20} />}
    tooltip="Estimación de ingresos y ganancias para el volumen proyectado."
  >
    {/* Quantity input */}
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "14px", flexWrap: "wrap", gap: "10px",
    }}>
      <span style={{
        fontSize: "0.8125rem",
        color: "var(--ctz-text-muted)",
      }}>
        Ingresos, inversión y ganancia para el volumen proyectado.
      </span>
      <div style={{ width: "140px" }}>
        <Input label="Unidades" value={props.quantity} onChange={props.onQuantityChange} prefix="u." />
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
  </Card>
);

export default VolumeAnalysisCard;
