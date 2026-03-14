import React, { useState } from "react";

/**
 * Card — Premium layout card with optional info tooltip on the header.
 * Uses CSS variables for dark/light parity.
 */
export const Card = ({ title, icon, tooltip, children, className = "", noPadding = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col antialiased overflow-hidden group ${className}`}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-sky-300/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Header */}
      {(title || icon) && (
        <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-slate-100/60">
          {icon && (
            <div className="flex-shrink-0 bg-sky-50 text-sky-600 rounded-xl p-2.5 border border-sky-100/50">
              {icon}
            </div>
          )}
          {title && (
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {title}
            </h2>
          )}

          {/* Info tooltip trigger */}
          {tooltip && (
            <div style={{ position: "relative", marginLeft: "auto" }}>
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                onClick={() => setShowTooltip((p) => !p)}
                aria-label="Más información"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--ctz-accent-light)",
                  color: "var(--ctz-accent)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontFamily: "Georgia, serif",
                  transition: "all 200ms ease-out",
                  flexShrink: 0,
                }}
              >
                i
              </button>

              {/* Tooltip popup */}
              {showTooltip && (
                <div
                  style={{
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
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8125rem",
                      lineHeight: 1.55,
                      color: "var(--ctz-text-secondary)",
                    }}
                  >
                    {tooltip}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`flex-grow ${noPadding ? "" : "p-5"}`}>
        {children}
      </div>
    </div>
  );
};