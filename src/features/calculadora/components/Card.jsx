import React from "react";

/**
 * Card — Base card for the Calculadora.
 * Supports two visual tiers via the `tier` prop:
 *   "input"   → transparent bg, dashed border, recedes visually  (Tier 1)
 *   "default" → elevated bg, solid border, standard weight       (Tier 2)
 */
export const Card = ({ title, icon, children, className = "", noPadding = false, tier = "default" }) => {
  const isInput = tier === "input";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: isInput ? "transparent" : "var(--ctz-bg-elevated)",
        borderRadius: "var(--ctz-radius-md)",
        border: isInput
          ? "1px dashed var(--ctz-border)"
          : "1px solid var(--ctz-border)",
        boxShadow: isInput ? "none" : "var(--ctz-shadow-sm)",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 250ms ease-out, box-shadow 250ms ease-out",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!isInput) {
          e.currentTarget.style.borderColor = "var(--ctz-border-hover)";
          e.currentTarget.style.boxShadow = "var(--ctz-shadow-md)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isInput) {
          e.currentTarget.style.borderColor = "var(--ctz-border)";
          e.currentTarget.style.boxShadow = "var(--ctz-shadow-sm)";
        }
      }}
    >
      {/* Header */}
      {(title || icon) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 20px 12px",
            borderBottom: isInput
              ? "1px dashed var(--ctz-border)"
              : "1px solid var(--ctz-border)",
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
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: isInput ? "var(--ctz-text-secondary)" : "var(--ctz-text-primary)",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Body */}
      <div style={{ flexGrow: 1, padding: noPadding ? 0 : "20px" }}>
        {children}
      </div>
    </div>
  );
};