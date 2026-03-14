import React from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";
import { StoreIcon } from "@/shared/components/icons";

/* ── Summary Row ── */
const SummaryRow = ({ label, value, color = "var(--ctz-text-primary)", bold = false }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
  }}>
    <span style={{
      fontSize: "0.8125rem",
      fontWeight: bold ? 600 : 400,
      color: bold ? "var(--ctz-text-primary)" : "var(--ctz-text-secondary)",
    }}>
      {label}
    </span>
    <span style={{
      fontSize: bold ? "1.0625rem" : "0.875rem",
      fontWeight: bold ? 700 : 500,
      color,
      fontVariantNumeric: "tabular-nums",
    }}>
      {formatCurrency(value)}
    </span>
  </div>
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
  return (
    <Card title="Venta" icon={<StoreIcon size={20} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Precio + Descuento */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input
            label="Precio bruto"
            value={grossSellingPrice}
            onChange={onGrossSellingPriceChange}
            prefix="$"
            tip="Precio al que querés vender antes de descuentos."
          />
          <Input
            label="Descuento promocional"
            value={promotionalDiscount}
            onChange={onPromotionalDiscountChange}
            prefix="%"
            tip="Descuento que vas a ofrecer (opcional)."
          />
        </div>

        {/* Divider: Comisiones */}
        <div style={{
          paddingTop: "12px",
          borderTop: "1px solid var(--ctz-border)",
        }}>
          <span style={{
            display: "block",
            fontSize: "0.6875rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--ctz-text-muted)",
            marginBottom: "10px",
          }}>
            Comisiones y deducciones
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Input
              label="Comisión de plataforma"
              value={platformFeePercent}
              onChange={onPlatformFeeChange}
              prefix="%"
              tip="Mercado Libre: 11–17%. Tienda Nube: 0.7–2%."
            />
            <Input
              label="Comisión medio de pago"
              value={paymentFeePercent}
              onChange={onPaymentFeeChange}
              prefix="%"
              tip="Comisión de la pasarela de pago. Suele estar entre 3% y 6%."
            />
            <Input
              label="Costo por cuotas"
              value={installmentFeePercent}
              onChange={onInstallmentFeeChange}
              prefix="%"
              tip="Costo adicional al ofrecer cuotas sin interés (4–18% en ML)."
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input
                label="Impuestos sobre venta"
                value={taxesAndRetentions}
                onChange={onTaxesAndRetentionsChange}
                prefix="%"
                tip="IIBB, retenciones, etc."
              />
              <Input
                label="Envío a cargo del vendedor"
                value={sellerShippingCost}
                onChange={onSellerShippingCostChange}
                prefix="$"
                tip="Parte del envío que pagás vos."
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{
          paddingTop: "12px",
          borderTop: "1px solid var(--ctz-border)",
          display: "flex", flexDirection: "column", gap: "6px",
        }}>
          <SummaryRow label="Precio final de venta" value={finalSellingPrice} />
          <SummaryRow label="Total deducciones" value={totalDeductions} color="var(--ctz-error)" />

          {/* Hero: Ingreso Neto */}
          <div style={{
            marginTop: "6px",
            padding: "10px 14px",
            background: "var(--ctz-accent-light)",
            borderRadius: "var(--ctz-radius-sm)",
            border: "1px solid var(--ctz-accent-ring)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--ctz-text-primary)",
            }}>
              Ingreso neto por venta
            </span>
            <span style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--ctz-accent)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {formatCurrency(netIncomePerSale)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
