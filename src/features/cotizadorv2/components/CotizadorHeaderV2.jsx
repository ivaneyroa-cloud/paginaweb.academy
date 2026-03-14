import React from "react";
import { FaTruckPlane } from "react-icons/fa6";

/**
 * CotizadorHeaderV2 — Compact, premium header with minimal stepper.
 * Uses CSS variables for dark/light parity. Zero hardcoded colors.
 */
export default function CotizadorHeaderV2() {
  const steps = [
    { num: 1, label: "Producto" },
    { num: 2, label: "Envío" },
    { num: 3, label: "Resultado" },
  ];

  return (
    <div
      style={{
        marginBottom: "24px",
        background: "var(--ctz-bg-elevated)",
        border: "1px solid var(--ctz-border)",
        borderRadius: "var(--ctz-radius-md)",
        padding: "20px 24px",
        transition: "border-color 250ms ease-out",
      }}
    >
      {/* Title row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--ctz-accent-light)",
            color: "var(--ctz-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaTruckPlane size={18} />
        </div>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--ctz-text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Cotizador de Importaciones
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "0.8125rem",
              color: "var(--ctz-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Calculá en segundos el costo estimado de tu operación con el valor FOB, peso y dimensiones del envío.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "var(--ctz-border)",
          marginBottom: "14px",
        }}
      />

      {/* Minimal stepper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
        }}
      >
        {steps.map((step, i) => (
          <React.Fragment key={step.num}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: step.num === 3 ? "var(--ctz-success)" : "var(--ctz-accent)",
                  color: "#ffffff",
                  fontSize: "0.6875rem",
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
                style={{
                  fontSize: "0.75rem",
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

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--ctz-border-hover)",
                  margin: "0 12px",
                  minWidth: "16px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}