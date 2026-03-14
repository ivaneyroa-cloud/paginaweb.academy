import React, { useState, forwardRef, useImperativeHandle } from "react";
import { TbKey } from "react-icons/tb";
import { FaRegCircleCheck } from "react-icons/fa6";
import { validarCuponAction } from "../actions";

/**
 * DiscountCardV2 — "Acceso preferencial"
 * Compact, premium card for entering a tariff code.
 * Visual redesign only — internal logic unchanged.
 */
export const DiscountCardV2 = forwardRef(({
  porcentajeDescuento = 0,
  codigoDescuento = "",
  onDescuentoChange,
  onCodigoChange,
}, ref) => {
  const [codigo, setCodigo] = useState(codigoDescuento);
  const [mensajeError, setMensajeError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useImperativeHandle(ref, () => ({
    validarPendiente: async () => {
      const parsedCodigo = codigo.trim();
      if (!parsedCodigo) {
        if (porcentajeDescuento > 0) handleLimpiar();
        return true;
      }
      if (parsedCodigo === codigoDescuento && porcentajeDescuento > 0) {
        return true;
      }
      return await handleAplicarDescuento();
    }
  }));

  const handleAplicarDescuento = async () => {
    if (!codigo.trim() || isApplying) return false;

    setIsApplying(true);
    setMensajeError("");

    try {
      const response = await validarCuponAction(codigo.trim());

      if (response.success) {
        onDescuentoChange(response.porcentaje);
        onCodigoChange(response.codigo);
        return true;
      } else {
        onDescuentoChange(0);
        onCodigoChange("");
        setMensajeError(response.message || "Código inválido");
        return false;
      }
    } catch (error) {
      console.error("Error validando cupón", error);
      setMensajeError("Hubo un error al validar. Intentá de nuevo más tarde.");
      return false;
    } finally {
      setIsApplying(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAplicarDescuento();
    }
  };

  const handleLimpiar = () => {
    setCodigo("");
    onDescuentoChange(0);
    onCodigoChange("");
    setMensajeError("");
  };

  const isApplied = porcentajeDescuento > 0;

  return (
    <div
      style={{
        background: "var(--ctz-bg-elevated)",
        border: `1px solid ${isApplied ? "var(--ctz-success)" : "var(--ctz-border)"}`,
        borderRadius: "var(--ctz-radius-md)",
        padding: "16px 20px",
        transition: "border-color 250ms ease-out",
        opacity: isApplied ? 1 : 0.85,
      }}
    >
      {/* Applied state — compact inline */}
      {isApplied ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaRegCircleCheck
              size={16}
              style={{ color: "var(--ctz-success)", flexShrink: 0 }}
            />
            <div>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--ctz-text-primary)",
                }}
              >
                Tarifa aplicada correctamente
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "var(--ctz-text-muted)",
                  marginTop: "1px",
                }}
              >
                Tu cotización ya contempla la condición asignada.
              </span>
            </div>
          </div>

          <button
            onClick={handleLimpiar}
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--ctz-text-muted)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              padding: "4px 8px",
              transition: "color 200ms ease-out",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ctz-text-secondary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ctz-text-muted)"; }}
          >
            Quitar
          </button>
        </div>
      ) : (
        /* Default state — input form */
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <TbKey
              size={16}
              style={{ color: "var(--ctz-accent)", flexShrink: 0 }}
            />
            <div>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--ctz-text-primary)",
                }}
              >
                Acceso preferencial
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "var(--ctz-text-muted)",
                  marginTop: "1px",
                }}
              >
                Si tenés un código asignado, ingresalo antes de cotizar para aplicar tu tarifa.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.toUpperCase());
                setMensajeError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ej: SH-20"
              style={{
                flex: 1,
                padding: "8px 12px",
                fontSize: "0.8125rem",
                fontWeight: 500,
                background: "var(--ctz-bg-input)",
                color: "var(--ctz-text-primary)",
                border: `1px solid ${mensajeError ? "var(--ctz-error)" : "var(--ctz-border-hover)"}`,
                borderRadius: "var(--ctz-radius-sm)",
                outline: "none",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                transition: "border-color 200ms ease-out",
                minHeight: "38px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--ctz-border-focus)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--ctz-accent-ring)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = mensajeError ? "var(--ctz-error)" : "var(--ctz-border-hover)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              onClick={handleAplicarDescuento}
              disabled={codigo.length === 0 || isApplying}
              style={{
                padding: "8px 20px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                borderRadius: "var(--ctz-radius-sm)",
                border: "none",
                cursor: codigo.length > 0 && !isApplying ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
                transition: "all 200ms ease-out",
                minHeight: "38px",
                ...(codigo.length > 0 && !isApplying
                  ? {
                      background: "var(--ctz-accent-gradient)",
                      color: "#ffffff",
                    }
                  : {
                      background: "var(--ctz-bg-tertiary)",
                      color: "var(--ctz-text-muted)",
                    }),
              }}
            >
              {isApplying ? "Validando..." : "Aplicar"}
            </button>
          </div>

          {/* Error message */}
          {mensajeError && (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--ctz-error)",
              }}
            >
              {mensajeError}
            </p>
          )}
        </>
      )}
    </div>
  );
});
