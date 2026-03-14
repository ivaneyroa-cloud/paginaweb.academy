import React from "react";
import { Card } from "../components/Card";
import { Input } from "@/shared/components/ui/Input";
import { formatCurrency } from "@/shared/lib/formatters";

// Icons
import { StoreIcon } from "@/shared/components/icons";

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
    <Card title="Precio de Venta" icon={<StoreIcon size={24} />}>
      <div className="flex flex-col gap-2">
        {/* Precio de Venta y Descuento */}
        <div className="p-3 rounded-lg bg-sky-100/40 border border-sky-200">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio de Venta Bruto (USD)"
              value={grossSellingPrice}
              onChange={onGrossSellingPriceChange}
              prefix="$"
              className="text-sky-800 font-bold"
              tip="Precio al que querés vender antes de descuentos. Ejemplo: $8 por cable USB."
            />

            <Input
              label="Descuento por Promoción (%)"
              value={promotionalDiscount}
              onChange={onPromotionalDiscountChange}
              prefix="%"
              className="text-fuchsia-600 font-bold"
              tip="Descuento que vas a ofrecer (opcional). Ejemplo: 10% para promoción de lanzamiento."
            />
          </div>
        </div>

        {/* Demás Costos */}
        <div className="p-3 pt-5 rounded-lg bg-fuchsia-100/40 border border-fuchsia-200">
          {/* Comisiones - Responsive grid */}
          <Input
            label="Cargo de la plataforma por vender (%)"
            value={platformFeePercent}
            onChange={onPlatformFeeChange}
            prefix="%"
            className="mb-4"
            tip={[
              "<strong>Mercado Libre:</strong> entre 11,80% y 17,14%. Varía por categoría y provincia. Verificá en ML.",
              "<strong>Tienda Nube:</strong> según el plan → Esencial: 2% · Impulso: 1% · Escala: 0,7%.",
            ]}
          />

          {/* Impuestos y Envío - Responsive grid */}
          <div className="grid grid-cols-1 gap-0">
            <Input
              label="Comisión Medio de Pago (%)"
              value={paymentFeePercent}
              onChange={onPaymentFeeChange}
              prefix="%"
              className="mb-4"
              tip="<strong>Tienda Nube:</strong> sumá la comisión de la pasarela de pago (PagoNube, Mercado Pago, etc.). Suele estar entre 3% y 6% + IVA, según plan y plazo de acreditación. Verificá en TiendaNube."
            />

            <Input
              label="Costo Por Ofrecer Cuotas (en ML) (%)"
              value={installmentFeePercent}
              onChange={onInstallmentFeeChange}
              prefix="%"
              placeholder="de 4% a 18,3% en ML"
              className="mb-4"
              tip="<strong>Mercado Libre:</strong> costo adicional cuando ofreces el pago en cuotas sin interés. Verificá en ML según tu categoría."
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Impuestos estimados sobre la Venta (%)"
                value={taxesAndRetentions}
                onChange={onTaxesAndRetentionsChange}
                prefix="%"
                className="mb-0"
                tip="Impuestos que podés tener que pagar sobre las ventas. Ejemplo: IIBB (1-4%), retenciones, etc. Consultalo en la plataforma donde vendas."
              />

              <Input
                label="Costo de Envío Asumido por Vendedor (USD)"
                value={sellerShippingCost}
                onChange={onSellerShippingCostChange}
                prefix="$"
                className="mb-0"
                tip="Parte del envío que pagás vos como vendedor."
              />
            </div>
          </div>
        </div>

        {/* Resultados de Ventas */}
        <div className="mt-2 pt-3 border-t border-slate-300 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Precio Final de Venta</span>
            <span className="text-base font-semibold text-slate-800">
              {formatCurrency(finalSellingPrice)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600">Total Deducciones</span>
            <span className="text-base font-semibold text-red-600">
              {formatCurrency(totalDeductions)}
            </span>
          </div>

          <div className="flex justify-between items-center bg-sky-50 p-3 rounded-lg border-sky-200 border">
            <span className="font-bold text-slate-800">
              Ingreso Neto por Venta
            </span>
            <span className="font-extrabold text-2xl text-sky-700">
              {formatCurrency(netIncomePerSale)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
