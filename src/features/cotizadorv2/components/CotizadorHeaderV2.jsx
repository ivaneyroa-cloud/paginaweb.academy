import React from "react";
import { FaTruckPlane } from "react-icons/fa6";

/**
 * CotizadorHeaderV2 — Compact, responsive header with minimal stepper.
 * Mobile-first: description hidden, smaller icon/stepper on small screens.
 * Uses CSS classes from cotizador.css for responsive behavior.
 */
export default function CotizadorHeaderV2() {
  const steps = [
    { num: 1, label: "Producto" },
    { num: 2, label: "Envío" },
    { num: 3, label: "Cotización" },
  ];

  return (
    <div
      className="ctz-header-card"
      style={{
        background: "var(--ctz-bg-elevated)",
        border: "1px solid var(--ctz-border)",
        borderRadius: "var(--ctz-radius-md)",
        transition: "border-color 250ms ease-out",
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div
          className="ctz-header-icon"
          style={{
            flexShrink: 0,
            background: "var(--ctz-accent-light)",
            color: "var(--ctz-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaTruckPlane />
        </div>
        <div>
          <h1
            style={{
              margin: 0,
              fontWeight: 700,
              color: "var(--ctz-text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Cotizador de Importación
          </h1>
          <p
            className="ctz-header-desc"
            style={{
              margin: "3px 0 0",
              fontSize: "0.8125rem",
              color: "var(--ctz-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Estimá el costo total de tu importación ingresando valor FOB, peso y dimensiones.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="ctz-header-divider"
        style={{ height: "1px", background: "var(--ctz-border)" }}
      />

      {/* Minimal stepper */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.num}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                className="ctz-stepper-step-num"
                style={{
                  borderRadius: "50%",
                  background: step.num === 3 ? "var(--ctz-success)" : "var(--ctz-accent)",
                  color: "#ffffff",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {step.num}
              </div>
              <span
                className="ctz-stepper-step-label"
                style={{
                  fontWeight: 600,
                  color: "var(--ctz-text-secondary)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className="ctz-stepper-connector"
                style={{ flex: 1, height: "1px", background: "var(--ctz-border-hover)" }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}