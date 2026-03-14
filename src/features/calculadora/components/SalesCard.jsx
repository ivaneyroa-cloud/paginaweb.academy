import React, { useState } from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";
import { StoreIcon } from "@/shared/components/icons";
import { HiChevronDown } from "react-icons/hi";

export const SalesCard = ({
  grossSellingPrice,
  promotionalDiscount,
  platformFeePercent,
  paymentFeePercent,
  installmentFeePercent,
  taxesAndRetentions,
  sellerShippingCost,
  onGrossSellingPriceChange,
  onPromotionalDiscountChange,
  onPlatformFeeChange,
  onPaymentFeeChange,
  onInstallmentFeeChange,
  onTaxesAndRetentionsChange,
  onSellerShippingCostChange,
  finalSellingPrice,
  totalDeductions,
  netIncomePerSale,
}) => {
  const hasAdvancedValues =
    paymentFeePercent > 0 ||
    installmentFeePercent > 0 ||
    taxesAndRetentions > 0 ||
    sellerShippingCost > 0 ||
    promotionalDiscount > 0;

  const [showAdvanced, setShowAdvanced] = useState(hasAdvancedValues);

  return (
    <Card title="Venta" icon={<StoreIcon size={18} />} tier="input">
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* ── PRIMARY: Price + Platform fee ── */}
        <Input
          label="Precio de venta"
          value={grossSellingPrice}
          onChange={onGrossSellingPriceChange}
          prefix="$"
          tip="Precio al que querés vender antes de descuentos."
        />
        <Input
          label="Comisión de plataforma"
          value={platformFeePercent}
          onChange={onPlatformFeeChange}
          prefix="%"
          tip="Mercado Libre: 11–17%. Tienda Nube: 0.7–2%."
        />

        {/* ── ADVANCED TOGGLE ── */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "0",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--ctz-text-muted)",
            transition: "color 200ms",
            marginTop: "2px",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ctz-text-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ctz-text-muted)"; }}
        >
          <HiChevronDown
            size={14}
            style={{
              transition: "transform 200ms",
              transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
          {showAdvanced ? "Ocultar deducciones" : "Descuento, cuotas, impuestos y envío"}
        </button>

        {/* ── ADVANCED SECTION ── */}
        {showAdvanced && (
          <div style={{
            paddingTop: "10px",
            borderTop: "1px dashed var(--ctz-border)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            opacity: 0.85,
          }}>
            <Input
              label="Descuento promocional"
              value={promotionalDiscount}
              onChange={onPromotionalDiscountChange}
              prefix="%"
              tip="Descuento que vas a ofrecer (opcional)."
            />
            <Input
              label="Comisión medio de pago"
              value={paymentFeePercent}
              onChange={onPaymentFeeChange}
              prefix="%"
              tip="Comisión de la pasarela de pago (3–6%)."
            />
            <Input
              label="Costo por cuotas"
              value={installmentFeePercent}
              onChange={onInstallmentFeeChange}
              prefix="%"
              tip="Costo por ofrecer cuotas sin interés (4–18% en ML)."
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <Input
                label="Impuestos sobre venta"
                value={taxesAndRetentions}
                onChange={onTaxesAndRetentionsChange}
                prefix="%"
                tip="IIBB, retenciones, etc."
              />
              <Input
                label="Envío a cargo tuyo"
                value={sellerShippingCost}
                onChange={onSellerShippingCostChange}
                prefix="$"
                tip="Parte del envío que pagás vos."
              />
            </div>
          </div>
        )}

        {/* ── SUMMARY (always visible) ── */}
        <div style={{
          marginTop: "2px",
          paddingTop: "10px",
          borderTop: "1px solid var(--ctz-border)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--ctz-text-muted)" }}>Precio final</span>
            <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--ctz-text-secondary)", fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(finalSellingPrice)}
            </span>
          </div>
          {totalDeductions > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--ctz-text-muted)" }}>Deducciones</span>
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--ctz-error)", fontVariantNumeric: "tabular-nums" }}>
                -{formatCurrency(totalDeductions)}
              </span>
            </div>
          )}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginTop: "4px", paddingTop: "6px", borderTop: "1px solid var(--ctz-border)",
          }}>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--ctz-text-muted)",
            }}>
              Ingreso neto
            </span>
            <span style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--ctz-accent)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.01em",
            }}>
              {formatCurrency(netIncomePerSale)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
