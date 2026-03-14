import React, { useState } from "react";

/**
 * Card — Base card for the Calculadora.
 * Matches the Cotizador Card exactly: solid bg, solid border, tooltip support.
 * No tiers, no dashed borders — Shippar doesn't use them.
 */
export const Card = ({ title, icon, tooltip, children, className = "", noPadding = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: "var(--ctz-bg-elevated)",
        borderRadius: "var(--ctz-radius-md)",
        border: "1px solid var(--ctz-border)",
        boxShadow: "var(--ctz-shadow-sm)",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 250ms ease-out, box-shadow 250ms ease-out",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ctz-border-hover)";
        e.currentTarget.style.boxShadow = "var(--ctz-shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--ctz-border)";
        e.currentTarget.style.boxShadow = "var(--ctz-shadow-sm)";
      }}
    >
      {/* Header — matches cotizador Card exactly */}
      {(title || icon) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 20px 12px",
            borderBottom: "1px solid var(--ctz-border)",
          }}
        >
          {icon && (
            <span style={{ color: "var(--ctz-accent)", display: "flex", alignItems: "center", flexShrink: 0 }}>
              {icon}
            </span>
          )}
          {title && (
            <h2
              style={{
                margin: 0,
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "var(--ctz-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h2>
          )}

          {/* Tooltip (same as cotizador) */}
          {tooltip && (
            <div style={{ position: "relative", marginLeft: "auto" }}>
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip((p) => !p)}
                aria-label="Más información"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "var(--ctz-accent-light)",
                  color: "var(--ctz-accent)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontFamily: "Georgia, serif",
                  transition: "all 200ms ease-out",
                  flexShrink: 0,
                }}
              >
                i
              </button>
              {showTooltip && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "260px",
                  padding: "12px 14px",
                  background: "var(--ctz-bg-elevated)",
                  border: "1px solid var(--ctz-border)",
                  borderRadius: "var(--ctz-radius-sm)",
                  boxShadow: "var(--ctz-shadow-lg)",
                  backdropFilter: "blur(12px)",
                  zIndex: 30,
                  animation: "ctz-fade-in 150ms ease-out",
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: "0.8125rem",
                    lineHeight: 1.55,
                    color: "var(--ctz-text-secondary)",
                  }}>
                    {tooltip}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div style={{ flexGrow: 1, padding: noPadding ? 0 : "16px 20px" }}>
        {children}
      </div>
    </div>
  );
};