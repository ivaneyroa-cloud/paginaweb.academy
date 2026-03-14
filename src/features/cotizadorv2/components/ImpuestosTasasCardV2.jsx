import React, { useState } from "react";
import { FaScaleUnbalanced as CategoryIcon } from "react-icons/fa6";
import { HiChevronDown } from "react-icons/hi";
import { HiOutlineInformationCircle } from "react-icons/hi2";

/**
 * ImpuestosTasasCardV2 — Premium collapsible tax section.
 *
 * Visual hierarchy (3 layers):
 *   1. Header + discreet category pill → context
 *   2. Hero total → the number the user cares about
 *   3. Expandable detail → breakdown + technical note
 *
 * All CSS variables, dark/light parity, zero hardcoded colors.
 */
export const ImpuestosTasasCardV2 = ({
  categoriaSeleccionada,
  valorCif,
  impuestos,
  totalImpuestos,
  gastoDocumental,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalcNote, setShowCalcNote] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const total = totalImpuestos + gastoDocumental;

  const rows = [
    {
      label: impuestos.importDuty.name,
      percentage: impuestos.importDuty.percentage,
      value: impuestos.importDuty.amount,
    },
    {
      label: impuestos.statisticalFee.name,
      percentage: impuestos.statisticalFee.percentage,
      value: impuestos.statisticalFee.amount,
    },
    {
      label: impuestos.iva.name,
      percentage: impuestos.iva.percentage,
      value: impuestos.iva.amount,
    },
    {
      label: "Gasto Documental Aduana",
      percentage: null,
      value: gastoDocumental,
    },
  ];

  return (
    <div>
      {/* ═══ LAYER 1 — Header + Category ═══ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "20px",
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

        {/* Category — discreet contextual line */}
        <span
          style={{
            fontSize: "0.6875rem",
            fontWeight: 500,
            color: "var(--ctz-text-muted)",
            letterSpacing: "0.01em",
          }}
        >
          Categoría: {categoriaSeleccionada.nombre}
        </span>
      </div>

      {/* ═══ LAYER 2 — Hero total ═══ */}
      <div
        style={{
          padding: "20px 0",
          borderTop: "1px solid var(--ctz-border)",
          marginBottom: "4px",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--ctz-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}
        >
          Total Impuestos y Tasas
        </span>
        <span
          style={{
            display: "block",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--ctz-accent)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {formatCurrency(total)}
        </span>
      </div>

      {/* ═══ LAYER 3 — Expandable detail trigger ═══ */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
          background: "transparent",
          border: "none",
          borderTop: "1px solid var(--ctz-border)",
          cursor: "pointer",
          color: "var(--ctz-text-muted)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          letterSpacing: "0.01em",
          transition: "color 200ms ease-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--ctz-text-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--ctz-text-muted)";
        }}
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

      {/* ═══ Collapsible detail panel ═══ */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 300ms ease-out",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              paddingTop: "8px",
              paddingBottom: "4px",
              opacity: isOpen ? 1 : 0,
              transition: "opacity 250ms ease-out 50ms",
            }}
          >
            {/* Breakdown rows */}
            {rows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "var(--ctz-radius-sm)",
                  background: i % 2 === 0 ? "var(--ctz-bg-secondary)" : "transparent",
                  fontSize: "0.8125rem",
                }}
              >
                <span
                  style={{
                    color: "var(--ctz-text-secondary)",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                  }}
                >
                  {row.label}
                  {row.percentage !== null && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--ctz-text-muted)",
                        fontWeight: 400,
                      }}
                    >
                      {row.percentage.toFixed(1)}%
                    </span>
                  )}
                </span>
                <span
                  style={{
                    color: "var(--ctz-text-primary)",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    fontFeatureSettings: "'tnum'",
                    minWidth: "80px",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(row.value)}
                </span>
              </div>
            ))}

            {/* Subtotal row inside detail */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px 4px",
                marginTop: "4px",
                borderTop: "1px dashed var(--ctz-border)",
                fontSize: "0.8125rem",
              }}
            >
              <span
                style={{
                  color: "var(--ctz-text-primary)",
                  fontWeight: 600,
                }}
              >
                Total
              </span>
              <span
                style={{
                  color: "var(--ctz-accent)",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "80px",
                  textAlign: "right",
                }}
              >
                {formatCurrency(total)}
              </span>
            </div>

            {/* Technical note — "Cómo se calculó" disclosure */}
            <div style={{ marginTop: "12px" }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalcNote((p) => !p);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: "var(--ctz-text-muted)",
                  transition: "color 200ms ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--ctz-text-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--ctz-text-muted)";
                }}
              >
                <HiOutlineInformationCircle size={13} />
                <span>Cómo se calculó</span>
              </button>

              <div
                style={{
                  display: "grid",
                  gridTemplateRows: showCalcNote ? "1fr" : "0fr",
                  transition: "grid-template-rows 250ms ease-out",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <p
                    style={{
                      margin: "6px 0 0",
                      padding: "10px 12px",
                      fontSize: "0.6875rem",
                      color: "var(--ctz-text-muted)",
                      lineHeight: 1.7,
                      background: "var(--ctz-bg-secondary)",
                      borderRadius: "var(--ctz-radius-sm)",
                      border: "1px solid var(--ctz-border)",
                      opacity: showCalcNote ? 1 : 0,
                      transition: "opacity 200ms ease-out 50ms",
                    }}
                  >
                    Tasa estadística y Derechos de Importación se calculan sobre el Valor
                    CIF ({formatCurrency(valorCif)}). El IVA se calcula sobre el Valor CIF +
                    Derechos de Importación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
