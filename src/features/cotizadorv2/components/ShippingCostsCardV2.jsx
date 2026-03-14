import React from "react";
import { LuPlaneTakeoff as ShipIcon } from "react-icons/lu";
import { FiCheckCircle, FiCircle, FiZap, FiTruck } from "react-icons/fi";

/**
 * ShippingCostsCardV2 — Open section (no card wrapper) for shipping method selection.
 * Uses CSS variables for dark/light parity.
 */
export const ShippingCostsCardV2 = ({
  pesoComputableTotal = 0,
  cantidadCajas = 0,
  envioInfo = { standard: 0, express: 0, valorCrudoOriginal: 0, aplicoDescuento: false },
  tipoEnvio = "standard",
  setTipoEnvio
}) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const optionStyle = (isSelected, accentColor) => ({
    width: "100%",
    textAlign: "left",
    padding: "16px",
    borderRadius: "var(--ctz-radius-sm)",
    border: isSelected
      ? `2px solid ${accentColor}`
      : "2px solid var(--ctz-border)",
    background: isSelected ? "var(--ctz-accent-light)" : "var(--ctz-bg-elevated)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    transition: "all 200ms ease-out",
  });

  return (
    <div>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <ShipIcon size={18} style={{ color: "var(--ctz-accent)" }} />
        <h2
          style={{
            margin: 0,
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: "var(--ctz-text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          Envío Internacional Shippar
        </h2>
      </div>

      {/* Info bar */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "10px 14px",
          background: "var(--ctz-bg-secondary)",
          borderRadius: "var(--ctz-radius-sm)",
          border: "1px solid var(--ctz-border)",
          fontSize: "0.8125rem",
          color: "var(--ctz-text-secondary)",
          marginBottom: "16px",
        }}
      >
        <span>
          Cajas: <strong style={{ color: "var(--ctz-text-primary)" }}>{cantidadCajas}</strong>
        </span>
        <span style={{ color: "var(--ctz-border-hover)" }}>|</span>
        <span>
          Peso Facturable: <strong style={{ color: "var(--ctz-text-primary)" }}>{pesoComputableTotal.toFixed(2)} kg</strong>
        </span>
      </div>

      {/* Coupon notification */}
      {envioInfo.aplicoDescuento && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            padding: "10px 14px",
            background: "var(--ctz-success-light)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            borderRadius: "var(--ctz-radius-sm)",
            fontSize: "0.8125rem",
            color: "var(--ctz-success)",
            marginBottom: "16px",
          }}
        >
          <FiCheckCircle size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>Tarifa preferencial aplicada</p>
            <p style={{ margin: "2px 0 0", opacity: 0.85 }}>
              Precio sobre tarifa de <span style={{ textDecoration: "line-through" }}>{formatCurrency(envioInfo.valorCrudoOriginal)}</span>.
            </p>
          </div>
        </div>
      )}

      {/* Shipping options */}
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--ctz-text-muted)",
          marginBottom: "10px",
        }}
      >
        Seleccioná tu método de envío
      </p>

      <div className="ctz-shipping-options" style={{ display: "grid" }}>
        {/* Standard */}
        <button
          className="ctz-shipping-option"
          onClick={() => setTipoEnvio("standard")}
          style={optionStyle(tipoEnvio === "standard", "var(--ctz-accent)")}
        >
          <div style={{ color: tipoEnvio === "standard" ? "var(--ctz-accent)" : "var(--ctz-text-muted)", flexShrink: 0 }}>
            {tipoEnvio === "standard" ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FiTruck size={14} style={{ color: tipoEnvio === "standard" ? "var(--ctz-accent)" : "var(--ctz-text-muted)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--ctz-text-primary)" }}>
                Standard
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--ctz-text-muted)", margin: "2px 0 0" }}>
              Tiempo de tránsito normal.
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: tipoEnvio === "standard" ? "var(--ctz-accent)" : "var(--ctz-text-primary)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {formatCurrency(envioInfo.standard)}
            </div>
            {pesoComputableTotal > 0 && (
              <div style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--ctz-text-muted)",
                fontVariantNumeric: "tabular-nums",
              }}>
                {formatCurrency(envioInfo.standard / pesoComputableTotal)}/kg
              </div>
            )}
          </div>
        </button>

        {/* Express */}
        <button
          className="ctz-shipping-option"
          onClick={() => setTipoEnvio("express")}
          style={optionStyle(tipoEnvio === "express", "rgb(168, 85, 247)")}
        >
          <div style={{ color: tipoEnvio === "express" ? "rgb(168, 85, 247)" : "var(--ctz-text-muted)", flexShrink: 0 }}>
            {tipoEnvio === "express" ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FiZap size={14} style={{ color: tipoEnvio === "express" ? "rgb(168, 85, 247)" : "var(--ctz-text-muted)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--ctz-text-primary)" }}>
                Express
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--ctz-text-muted)", margin: "2px 0 0" }}>
              Prioridad aduanera y operativa.
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: tipoEnvio === "express" ? "rgb(168, 85, 247)" : "var(--ctz-text-primary)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {formatCurrency(envioInfo.express)}
            </div>
            {pesoComputableTotal > 0 && (
              <div style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--ctz-text-muted)",
                fontVariantNumeric: "tabular-nums",
              }}>
                {formatCurrency(envioInfo.express / pesoComputableTotal)}/kg
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};