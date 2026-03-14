import React from "react";
import { Card } from "./Card";
import { Button } from "@/shared/components/ui/Button";
import { useClipboard } from "@/shared/hooks/useClipboard";
import * as CalcsV2 from "../lib/calculationsV2";

import { IoCalculatorOutline as CalculatorIcon } from "react-icons/io5";
import { CopyIcon } from "@/shared/components/icons";

const CostRow = ({ label, value, subtle = false, indent = false }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "4px 0",
      paddingLeft: indent ? "14px" : "0",
      fontSize: "0.8125rem",
      color: subtle ? "var(--ctz-text-secondary)" : "var(--ctz-text-primary)",
      fontVariantNumeric: "tabular-nums",
    }}
  >
    <span>{label}</span>
    <span style={{ fontWeight: subtle ? 500 : 600, textAlign: "right" }}>{value}</span>
  </div>
);

/**
 * SummaryCardV2 — The ONLY premium accent card in results.
 * Accent border, elevated shadow, the visual "destination" of the cotizador.
 */
export const SummaryCardV2 = ({
  valorFob,
  impuestos,
  totalImpuestos,
  gastoDocumental,
  costoImportacion,
  costoFinalTotal,
  categoriaSeleccionada,
  cajas,
  pesoComputableTotal,
  envioInfo = { standard: 0, express: 0, valorCrudoOriginal: 0, aplicoDescuento: false },
  tipoEnvio = "standard",
  codigoDescuento = "",
}) => {
  const { copy: copyTotal, copied: copiedTotal } = useClipboard();
  const costoEnvioActual = envioInfo[tipoEnvio];

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <Card
      title="Resumen Final"
      icon={<CalculatorIcon size={20} />}
      accent={true}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>

        {/* Breakdown sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontSize: "0.8125rem" }}>

          {/* Product */}
          <div>
            <h3 style={{
              margin: "0 0 8px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ctz-text-muted)",
            }}>
              Datos del Producto
            </h3>
            <div style={{ borderLeft: "2px solid var(--ctz-border-hover)", paddingLeft: "12px" }}>
              <CostRow label="Categoría" value={categoriaSeleccionada.nombre} />
              <CostRow label="Precio FOB" value={formatCurrency(valorFob)} />
            </div>
          </div>

          {/* Taxes */}
          <div>
            <h3 style={{
              margin: "0 0 8px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ctz-text-muted)",
            }}>
              Impuestos y Tasas
            </h3>
            <div style={{ borderLeft: "2px solid var(--ctz-border-hover)", paddingLeft: "12px" }}>
              <CostRow
                label={`Derechos de Importación (${impuestos.importDuty.percentage.toFixed(1)}%)`}
                value={formatCurrency(impuestos.importDuty.amount)}
                subtle
              />
              <CostRow
                label={`Tasa Estadística (${impuestos.statisticalFee.percentage.toFixed(1)}%)`}
                value={formatCurrency(impuestos.statisticalFee.amount)}
                subtle
              />
              <CostRow
                label={`${impuestos.iva.name} (${impuestos.iva.percentage.toFixed(1)}%)`}
                value={formatCurrency(impuestos.iva.amount)}
                subtle
              />
              <CostRow
                label="Gasto Documental"
                value={formatCurrency(gastoDocumental)}
                subtle
              />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "8px",
                marginTop: "6px",
                borderTop: "1px solid var(--ctz-border)",
                fontWeight: 700,
                color: "var(--ctz-text-primary)",
                fontSize: "0.8125rem",
              }}>
                <span>Total Impuestos</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(totalImpuestos)}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h3 style={{
              margin: "0 0 8px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ctz-text-muted)",
            }}>
              Envío Internacional
            </h3>
            <div style={{ borderLeft: "2px solid var(--ctz-border-hover)", paddingLeft: "12px" }}>
              <CostRow label="Cantidad de cajas" value={cajas.length.toString()} />
              {cajas.map((caja, index) => {
                const volumetrico = CalcsV2.calcularPesoVolumetrico(caja.length, caja.width, caja.height);
                const computable = CalcsV2.calcularPesoComputable(caja.weight, volumetrico);
                return (
                  <CostRow
                    key={caja.id}
                    label={`Caja ${index + 1}`}
                    value={`${computable.toFixed(2)}kg (${caja.length}×${caja.width}×${caja.height}cm)`}
                    subtle
                    indent
                  />
                );
              })}
              <CostRow label="Peso Facturable" value={`${pesoComputableTotal.toFixed(2)} kg`} />

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "6px",
                marginTop: "4px",
                fontSize: "0.75rem",
              }}>
                <span style={{ color: "var(--ctz-text-muted)" }}>Servicio</span>
                <span style={{
                  padding: "2px 10px",
                  borderRadius: "var(--ctz-radius-pill)",
                  background: tipoEnvio === "standard" ? "var(--ctz-accent-light)" : "rgba(168, 85, 247, 0.08)",
                  color: tipoEnvio === "standard" ? "var(--ctz-accent)" : "rgb(168, 85, 247)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                  {tipoEnvio === "standard" ? "Standard" : "Express"}
                </span>
              </div>

              {envioInfo.aplicoDescuento && (
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "4px",
                  fontSize: "0.8125rem",
                }}>
                  <span style={{ color: "var(--ctz-text-muted)" }}>Tarifa Base</span>
                  <span style={{
                    textDecoration: "line-through",
                    color: "var(--ctz-error)",
                    fontVariantNumeric: "tabular-nums",
                    opacity: 0.7,
                  }}>
                    {formatCurrency(envioInfo.valorCrudoOriginal)}
                  </span>
                </div>
              )}

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "8px",
                marginTop: "6px",
                borderTop: "1px solid var(--ctz-border)",
                fontWeight: 700,
                color: envioInfo.aplicoDescuento ? "var(--ctz-success)" : "var(--ctz-text-primary)",
                fontSize: "0.8125rem",
              }}>
                <span>
                  Costo Envío
                  {envioInfo.aplicoDescuento && (
                    <span style={{ fontWeight: 500, fontSize: "0.75rem", marginLeft: "6px", opacity: 0.8 }}>
                      c/ descuento
                    </span>
                  )}
                </span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(costoEnvioActual)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TOTALS BOX ═══ */}
        <div
          style={{
            background: "var(--ctz-bg-secondary)",
            borderRadius: "var(--ctz-radius-sm)",
            padding: "20px",
            border: "1px solid var(--ctz-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "8px",
              fontSize: "0.875rem",
            }}
          >
            <span style={{ color: "var(--ctz-text-secondary)", fontWeight: 500 }}>Precio FOB</span>
            <span style={{ fontWeight: 600, color: "var(--ctz-text-primary)", fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(valorFob)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "14px",
              fontSize: "0.875rem",
            }}
          >
            <span style={{ color: "var(--ctz-text-secondary)", fontWeight: 500 }}>Costos de Importación</span>
            <span style={{ fontWeight: 600, color: "var(--ctz-text-primary)", fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(costoImportacion)}
            </span>
          </div>

          <div
            style={{
              borderTop: "2px solid var(--ctz-accent)",
              paddingTop: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--ctz-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Costo Final Total
            </span>
            <span
              style={{
                fontSize: "1.375rem",
                fontWeight: 800,
                color: "var(--ctz-accent)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
              }}
            >
              {formatCurrency(costoFinalTotal)}
            </span>
          </div>
        </div>

        {/* Copy button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => copyTotal(costoFinalTotal.toFixed(2))}
            variant="secondary"
            icon={<CopyIcon size={16} />}
          >
            {copiedTotal ? "¡Copiado!" : "Copiar Total"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
