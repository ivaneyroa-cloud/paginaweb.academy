import React, { useState } from "react";
import { FaScaleUnbalanced as CategoryIcon } from "react-icons/fa6";
import { HiChevronDown } from "react-icons/hi";

/**
 * ImpuestosTasasCardV2 — Collapsible tax section.
 * Three layers: context → total → expandable detail.
 * All CSS variables, dark/light parity.
 */
export const ImpuestosTasasCardV2 = ({
  categoriaSeleccionada,
  valorCif,
  impuestos,
  totalImpuestos,
  gastoDocumental,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const total = totalImpuestos + gastoDocumental;

  const rows = [
    {
      label: `${impuestos.importDuty.name} (${impuestos.importDuty.percentage.toFixed(1)}%)`,
      value: impuestos.importDuty.amount,
    },
    {
      label: `${impuestos.statisticalFee.name} (${impuestos.statisticalFee.percentage.toFixed(1)}%)`,
      value: impuestos.statisticalFee.amount,
    },
    {
      label: `${impuestos.iva.name} (${impuestos.iva.percentage.toFixed(1)}%)`,
      value: impuestos.iva.amount,
    },
    {
      label: "Gasto Documental Aduana",
      value: gastoDocumental,
    },
  ];

  return (
    <div>
      {/* Section header + category badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

        {/* Category pill — discreet */}
        <span
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "var(--ctz-text-muted)",
            background: "var(--ctz-bg-tertiary)",
            padding: "3px 10px",
            borderRadius: "var(--ctz-radius-pill)",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {categoriaSeleccionada.nombre}
        </span>
      </div>

      {/* ═══ TOTAL — primary focus ═══ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "16px 0",
          borderTop: "1px solid var(--ctz-border)",
          borderBottom: "1px solid var(--ctz-border)",
          marginBottom: "12px",
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
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--ctz-accent)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {formatCurrency(total)}
        </span>
      </div>

      {/* ═══ EXPANDABLE DETAIL ═══ */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--ctz-text-muted)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          transition: "color 200ms ease-out",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ctz-text-secondary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ctz-text-muted)"; }}
      >
        <span>{isOpen ? "Ocultar desglose" : "Ver desglose detallado"}</span>
        <HiChevronDown
          size={16}
          style={{
            transition: "transform 250ms ease-out",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Detail rows — collapsible */}
      <div
        style={{
          maxHeight: isOpen ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 300ms ease-out, opacity 250ms ease-out",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          style={{
            paddingTop: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "var(--ctz-radius-sm)",
                background: i % 2 === 0 ? "var(--ctz-bg-secondary)" : "transparent",
                fontSize: "0.8125rem",
              }}
            >
              <span style={{ color: "var(--ctz-text-secondary)", fontWeight: 500 }}>
                {row.label}
              </span>
              <span
                style={{
                  color: "var(--ctz-text-primary)",
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatCurrency(row.value)}
              </span>
            </div>
          ))}

          {/* Technical note — collapsible within detail */}
          <div
            style={{
              marginTop: "8px",
              padding: "10px 12px",
              background: "var(--ctz-bg-secondary)",
              borderRadius: "var(--ctz-radius-sm)",
              border: "1px solid var(--ctz-border)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.6875rem",
                color: "var(--ctz-text-muted)",
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: "var(--ctz-text-secondary)" }}>Cómo se calculó:</strong>{" "}
              Tasa estadística y Derechos de Importación se calculan sobre el Valor CIF. 
              El IVA se calcula sobre el Valor CIF + Derechos de Importación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
