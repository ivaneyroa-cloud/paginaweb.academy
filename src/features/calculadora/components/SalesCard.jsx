import React, { useState } from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";
import { StoreIcon } from "@/shared/components/icons";
import { HiChevronDown } from "react-icons/hi";

/* ── Collapsible Toggle ── */
const AdvancedToggle = ({ isOpen, onClick, label, badge }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: "6px",
      padding: "0", background: "none", border: "none",
      cursor: "pointer", fontSize: "0.8125rem", fontWeight: 500,
      color: "var(--ctz-text-muted)", transition: "color 200ms",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ctz-text-secondary)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ctz-text-muted)"; }}
  >
    <HiChevronDown size={14} style={{
      transition: "transform 200ms",
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    }} />
    {label}
    {badge && (
      <span style={{
        marginLeft: "4px",
        padding: "1px 6px",
        fontSize: "0.6875rem",
        fontWeight: 600,
        borderRadius: "4px",
        background: "var(--ctz-accent-light)",
        color: "var(--ctz-accent)",
      }}>
        {badge}
      </span>
    )}
  </button>
);

/* ── Group label for advanced sections ── */
const GroupLabel = ({ children }) => (
  <span style={{
    display: "block",
    fontSize: "0.6875rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "var(--ctz-text-muted)",
    marginBottom: "8px",
  }}>
    {children}
  </span>
);

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
  // Count how many advanced fields have values
  const advancedFields = [
    { val: promotionalDiscount, label: "descuento" },
    { val: paymentFeePercent, label: "pago" },
    { val: installmentFeePercent, label: "cuotas" },
    { val: taxesAndRetentions, label: "impuestos" },
    { val: sellerShippingCost, label: "envío" },
  ];
  const activeCount = advancedFields.filter(f => f.val > 0).length;
  const hasAdvancedValues = activeCount > 0;

  const [showAdvanced, setShowAdvanced] = useState(hasAdvancedValues);

  return (
    <Card
      title="Venta"
      icon={<StoreIcon size={20} />}
      tooltip="Configurá el precio de venta y las deducciones aplicables a tu canal de venta."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* ── ESSENTIAL ── */}
        <Input label="Precio de venta" value={grossSellingPrice}
          onChange={onGrossSellingPriceChange} prefix="$"
          tip="Precio de lista publicado, antes de descuentos." />
        <Input label="Comisión de plataforma" value={platformFeePercent}
          onChange={onPlatformFeeChange} prefix="%"
          tip="ML: 11–17%  ·  Tienda Nube: 0.7–2%  ·  Venta directa: 0%" />

        {/* ── ADVANCED TOGGLE ── */}
        <AdvancedToggle
          isOpen={showAdvanced}
          onClick={() => setShowAdvanced(!showAdvanced)}
          label={showAdvanced ? "Ocultar deducciones" : "Deducciones adicionales"}
          badge={!showAdvanced && activeCount > 0 ? `${activeCount} activa${activeCount > 1 ? "s" : ""}` : null}
        />

        {/* ── ADVANCED SECTION ── */}
        {showAdvanced && (
          <div style={{
            paddingTop: "12px", borderTop: "1px solid var(--ctz-border)",
            display: "flex", flexDirection: "column", gap: "16px",
          }}>
            {/* Group: Descuento y comisiones */}
            <div>
              <GroupLabel>Descuento y comisiones</GroupLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Input label="Descuento promocional" value={promotionalDiscount}
                  onChange={onPromotionalDiscountChange} prefix="%"
                  tip="Descuento que ofrecés al comprador (opcional)." />
                <Input label="Comisión medio de pago" value={paymentFeePercent}
                  onChange={onPaymentFeeChange} prefix="%"
                  tip="Pasarela de pago: 3–6% según proveedor." />
                <Input label="Costo por cuotas" value={installmentFeePercent}
                  onChange={onInstallmentFeeChange} prefix="%"
                  tip="Costo por cuotas sin interés: 4–18% en ML." />
              </div>
            </div>

            {/* Group: Impuestos y envío */}
            <div>
              <GroupLabel>Impuestos y envío</GroupLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Input label="Impuestos sobre venta" value={taxesAndRetentions}
                  onChange={onTaxesAndRetentionsChange} prefix="%"
                  tip="IIBB, retenciones u otros impuestos." />
                <Input label="Envío a cargo tuyo" value={sellerShippingCost}
                  onChange={onSellerShippingCostChange} prefix="$"
                  tip="Costo de envío que absorbés como vendedor." />
              </div>
            </div>
          </div>
        )}

        {/* ── SUMMARY (always visible) ── */}
        <div style={{
          paddingTop: "12px", borderTop: "1px solid var(--ctz-border)",
          display: "flex", flexDirection: "column", gap: "6px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--ctz-text-muted)" }}>Precio final</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ctz-text-secondary)", fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(finalSellingPrice)}
            </span>
          </div>
          {totalDeductions > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--ctz-text-muted)" }}>Deducciones</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ctz-error)", fontVariantNumeric: "tabular-nums" }}>
                -{formatCurrency(totalDeductions)}
              </span>
            </div>
          )}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginTop: "4px", paddingTop: "8px", borderTop: "1px solid var(--ctz-border)",
          }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--ctz-text-secondary)" }}>
              Ingreso neto
            </span>
            <span style={{
              fontSize: "1.25rem", fontWeight: 700, color: "var(--ctz-accent)",
              fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em",
            }}>
              {formatCurrency(netIncomePerSale)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
