import React from "react";

/**
 * Card — Base card component for the Calculadora.
 * Uses cotizador design tokens (--ctz-*) for brand consistency.
 */
export const Card = ({ title, icon, children, className = "", noPadding = false }) => {
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
      {/* Header */}
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
        </div>
      )}

      {/* Body */}
      <div style={{ flexGrow: 1, padding: noPadding ? 0 : "20px" }}>
        {children}
      </div>
    </div>
  );
};