import React, { useState, useRef, useEffect } from "react";
import { IoInformationCircleOutline as InfoIcon } from "react-icons/io5";

/**
 * ResultCard — KPI card for the calculadora results row.
 * Uses --ctz-* design tokens. Compact, dark-mode-first.
 */
export const ResultCard = ({
  label,
  value,
  subtitle,
  valueColorClass, // legacy support — we'll use valueColor instead
  valueColor,
  infoText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Derive color from valueColor prop or map legacy class to color var
  const resolvedColor = valueColor || "var(--ctz-text-primary)";

  return (
    <div
      style={{
        background: "var(--ctz-bg-elevated)",
        border: "1px solid var(--ctz-border)",
        borderRadius: "var(--ctz-radius-md)",
        padding: "16px 18px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: "var(--ctz-shadow-sm)",
        transition: "border-color 250ms",
      }}
    >
      {/* Label + info */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        position: "relative",
      }}>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--ctz-text-muted)",
        }}>
          {label}
        </span>

        {infoText && (
          <div style={{ position: "relative", display: "flex", alignItems: "center" }} ref={tooltipRef}>
            <InfoIcon
              size={14}
              style={{ color: "var(--ctz-text-muted)", cursor: "pointer" }}
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: "50%",
                transform: "translateX(-50%)",
                width: "220px",
                padding: "8px 10px",
                borderRadius: "var(--ctz-radius-sm)",
                background: "var(--ctz-bg-elevated)",
                border: "1px solid var(--ctz-border)",
                boxShadow: "var(--ctz-shadow-md)",
                fontSize: "0.75rem",
                color: "var(--ctz-text-secondary)",
                textAlign: "center",
                lineHeight: 1.4,
                zIndex: 20,
                animation: "ctz-fade-in 150ms ease-out",
              }}>
                {infoText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Value */}
      <span style={{
        fontSize: "1.75rem",
        fontWeight: 800,
        color: resolvedColor,
        marginTop: "6px",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
      }}>
        {value}
      </span>

      {subtitle && (
        <span style={{
          fontSize: "0.6875rem",
          color: "var(--ctz-text-muted)",
          marginTop: "4px",
        }}>
          {subtitle}
        </span>
      )}
    </div>
  );
};
