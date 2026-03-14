import React from "react";
import { Card } from "./Card";
import { Button } from "../../../shared/components/ui/Button";
import * as Calcs from "../lib/calculations";
import { useClipboard } from "../../../shared/hooks/useClipboard";
import { formatSummary } from "../lib/formatSummary";
import { generateSummaryPdf } from "../lib/generateSummaryPdf";
import { useDataTransfer } from "@/shared/context/DataTransferContext";
import { useRouter } from "next/navigation";

// Icons
import { IoCalculatorOutline as CalculatorIcon } from "react-icons/io5";
import { CopyIcon, DownloadIcon } from "@/shared/components/icons";
import { FaLongArrowAltRight } from "react-icons/fa";

// FIX: Moved CostRow outside of SummaryCard to prevent it from being redeclared on every render
// and to fix TypeScript errors where the 'key' prop was not recognized on an inline component.
// Componente para una fila del desglose, para evitar repetición de código.
const CostRow = ({ label, value, isSubtle = false, indent = false }) => (
  <div
    className={`flex justify-between ${
      isSubtle ? "text-slate-600" : "text-slate-700"
    } ${indent ? "pl-4" : ""}`}
  >
    <span>{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

/**
 * Tarjeta de resumen que ocupa más espacio y muestra el resultado final del cálculo.
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.selectedCategory - Categoría seleccionada
 * @param {number} props.fob - Valor FOB
 * @param {number} props.quantity - Cantidad
 * @param {Array} props.boxes - Lista de cajas
 * @param {number} props.totalComputableWeight - Peso computable total
 * @param {Object} props.taxes - Impuestos calculados
 * @param {number} props.totalTaxes - Total de impuestos
 * @param {number} props.customsDocumentalFee - Tasa documental de aduana
 * @param {number} props.internationalFreight - Envio internacional
 * @param {number} props.finalCost - Costo final total
 * @param {number} props.finalUnitCost - Costo final por unidad
 */
export const SummaryCard = ({
  selectedCategory,
  fob,
  quantity,
  boxes,
  totalComputableWeight,
  freightRatePerKg,
  taxes,
  totalTaxes,
  customsDocumentalFee,
  internationalFreight,
  finalCost,
  finalUnitCost,
}) => {
  const { copy: copyTotal, copied: copiedTotal } = useClipboard();
  const { copy: copyUnit, copied: copiedUnit } = useClipboard();
  const { copy: copySummary, copied: copiedSummary } = useClipboard();
  const { saveTransferData } = useDataTransfer();
  const router = useRouter();

  // New clipboard hooks for the additional copyable values
  const { copy: copyIncludingFob, copied: copiedIncludingFob } = useClipboard();
  const { copy: copyLogisticTotal, copied: copiedLogisticTotal } =
    useClipboard();
  const { copy: copyLogisticUnit, copied: copiedLogisticUnit } = useClipboard();

  // Función para formatear un número como moneda USD.
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Costos
  const finalCostWithOutFob = finalCost; // impuestos + envío
  const finalCostWithFob = finalCost + fob; // Inversión total.
  const finalUnitCostWithOutFob = finalUnitCost; // Costo unitario sin FOB.
  const finalUnitCostWithFob = quantity > 0 ? finalCostWithFob / quantity : 0; // Costo unitario con FOB.

  // Precio unitario calculado
  const unitPrice = quantity > 0 ? fob / quantity : 0;

  const summaryData = React.useMemo(
    () => ({
      selectedCategoryName: selectedCategory.name,
      quantity,
      fob,
      boxes,
      totalComputableWeight,
      freightRatePerKg,
      taxes,
      totalTaxes,
      customsDocumentalFee,
      internationalFreight,
      finalCost,
      finalUnitCost,
    }),
    [
      selectedCategory,
      quantity,
      fob,
      boxes,
      totalComputableWeight,
      taxes,
      totalTaxes,
      customsDocumentalFee,
      internationalFreight,
      finalCost,
      finalUnitCost,
    ]
  );

  // Manejador para copiar el resumen completo.
  const handleSummaryCopy = () => {
    const summaryText = formatSummary(summaryData);
    copySummary(summaryText);
  };

  const handleSummaryPdf = () => {
    generateSummaryPdf(summaryData);
  };

  // Manejador para ir a la calculadora con datos precargados
  const handleGoToCalculator = () => {
    if (fob > 0 && quantity > 0) {
      saveTransferData({
        fob,
        quantity,
        finalCost: finalCostWithOutFob,
        unitPrice,
        finalUnitCost: finalUnitCostWithOutFob,
      });
    }
    router.push("/calculadora");
  };

  // Lógica para mostrar solo un tipo de IVA si es aplicable.
  const taxesToDisplay = [taxes.importDuty, taxes.statisticalFee];
  if (taxes.iva.percentage > 0) {
    taxesToDisplay.push(taxes.iva);
  } else if (taxes.iva10_5.percentage > 0) {
    taxesToDisplay.push(taxes.iva10_5);
  } else {
    taxesToDisplay.push(taxes.iva, taxes.iva10_5);
  }

  return (
    <Card
      title="Resumen Final"
      icon={<CalculatorIcon size={24} />}
      className=" transition-all duration-300 hover:shadow-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
        {/* Columna Izquierda: Desglose Detallado */}
        <div className="md:col-span-2 space-y-6 text-sm">
          {/* Sección de Producto */}
          <div>
            <h3 className="font-bold text-base text-slate-800 mb-2">
              Detalles del Producto
            </h3>
            <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
              <CostRow label="Categoría" value={selectedCategory.name} />
              <CostRow label="FOB" value={formatCurrency(fob)} />
            </div>
          </div>

          {/* Sección de Impuestos y Tasas - REORDENADA */}
          <div>
            <h3 className="font-bold text-base text-slate-800 mb-2">
              Impuestos y Tasas de Aduana
            </h3>
            <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
              {taxesToDisplay.map((tax) => (
                <CostRow
                  key={tax.name}
                  label={`${tax.name} (${(tax.percentage * 100).toFixed(1)}%)`}
                  value={formatCurrency(tax.amount)}
                  isSubtle
                />
              ))}
              <CostRow
                label="Gasto Documental Aduana"
                value={formatCurrency(customsDocumentalFee)}
                isSubtle
              />
              <div className="flex justify-between items-center text-slate-800 font-bold pt-2 mt-2 border-t border-slate-200/80">
                <span>Total Impuestos y Tasas</span>
                <span>{formatCurrency(totalTaxes + customsDocumentalFee)}</span>
              </div>
            </div>
          </div>

          {/* Sección de Envío - REORDENADA */}
          <div>
            <h3 className="font-bold text-base text-slate-800 mb-2">Envío</h3>
            <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
              <CostRow
                label="Cantidad de cajas"
                value={boxes.length.toString()}
              />
              {boxes.map((box, index) => {
                const computable = Calcs.calculateComputableWeight(
                  box.weight,
                  Calcs.calculateVolumetricWeight(
                    box.length,
                    box.width,
                    box.height
                  )
                );
                const dims = `${box.length}x${box.width}x${box.height}cm`;
                return (
                  <CostRow
                    key={box.id}
                    label={`- Caja ${index + 1}`}
                    value={`${computable.toFixed(2)}kg (${dims})`}
                    isSubtle
                    indent
                  />
                );
              })}
              <CostRow
                label="Peso Total Computable"
                value={`${totalComputableWeight.toFixed(2)} kg`}
              />
              {typeof freightRatePerKg !== "undefined" &&
                freightRatePerKg !== null && (
                  <CostRow
                    label="Tarifa por kg"
                    value={`${formatCurrency(freightRatePerKg)} / kg`}
                  />
                )}
              <div className="flex justify-between items-center text-slate-800 font-bold pt-2 mt-2 border-t border-slate-200/80">
                <span>Costo Envío Internacional</span>
                <span>{formatCurrency(internationalFreight)}</span>
              </div>
            </div>
          </div>

          {/* Sección de Totales Mejorada */}
          <div className="pt-4 mt-6 border-t border-slate-300">
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 shadow-sm">
              {/* FOB */}
              <div className="flex justify-between items-baseline">
                <span className="text-md font-medium text-slate-800">
                  Precio FOB
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {formatCurrency(fob)}
                </span>
              </div>

              {/* Costos de envío + impuestos */}
              <div className="flex justify-between items-baseline">
                <span className="text-md font-medium text-slate-800">
                  Costos de envío + impuestos
                </span>
                <span className="text-base font-semibold text-sky-700">
                  {formatCurrency(finalCostWithOutFob)}
                </span>
              </div>

              <hr className="my-2 border-slate-300" />

              {/* Costo Final Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold text-slate-900">
                  Costo Final Total
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {formatCurrency(finalCostWithFob)}
                </span>
              </div>

              {/* Costo Final por Unidad */}
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold text-slate-900">
                  Costo Final por Unidad
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {formatCurrency(finalUnitCostWithFob)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Totales y Acciones */}
        <div className="md:col-span-1 flex flex-col justify-end">
          <div className="space-y-4 bg-slate-50 rounded-lg p-4 text-center border border-slate-200/80">
            <div>
              <h3 className="text-base text-slate-600 font-medium">
                Costos de envio + impuestos
              </h3>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl text-sky-800 font-bold">
                  {formatCurrency(finalCostWithOutFob)}
                </p>
                <button
                  onClick={() =>
                    copyLogisticTotal(finalCostWithOutFob.toFixed(2))
                  }
                  className="relative text-slate-500 hover:text-sky-600 transition-colors p-1"
                  aria-label="Copiar costo logístico total"
                >
                  {copiedLogisticTotal ? (
                    <span className="text-sm text-sky-600 font-semibold">
                      ¡Copiado!
                    </span>
                  ) : (
                    <CopyIcon className="cursor-pointer h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <h3 className="text-base text-slate-600 font-medium">
                Costo Final Total (incluyendo FOB)
              </h3>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl text-slate-700 font-bold">
                  {formatCurrency(finalCostWithFob)}
                </p>
                <button
                  onClick={() => copyIncludingFob(finalCostWithFob.toFixed(2))}
                  className="relative text-slate-500 hover:text-sky-600 transition-colors p-1"
                  aria-label="Copiar costo final incluyendo FOB"
                >
                  {copiedIncludingFob ? (
                    <span className="text-sm text-sky-600 font-semibold">
                      ¡Copiado!
                    </span>
                  ) : (
                    <CopyIcon className="cursor-pointer h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <h3 className="text-base text-slate-600 font-medium">
                Costo Final por Unidad
              </h3>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl text-slate-700 font-bold">
                  {formatCurrency(finalUnitCostWithFob)}
                </p>
                <button
                  onClick={() =>
                    copyLogisticUnit(finalUnitCostWithFob.toFixed(2))
                  }
                  className="relative text-slate-500 hover:text-sky-600 transition-colors p-1"
                  aria-label="Copiar costo unitario logístico"
                >
                  {copiedLogisticUnit ? (
                    <span className="text-sm text-sky-600 font-semibold">
                      ¡Copiado!
                    </span>
                  ) : (
                    <CopyIcon className="cursor-pointer h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="pt-6 space-y-3">
            <Button
              onClick={handleSummaryCopy}
              variant="secondary"
              className="w-full"
              icon={<CopyIcon size={18} />}
            >
              {copiedSummary ? "¡Resumen Copiado!" : "Copiar Resumen"}
            </Button>

            <Button
              onClick={handleSummaryPdf}
              variant="pdf"
              className="w-full"
              icon={<DownloadIcon size={18} />}
            >
              Descargar PDF
            </Button>

            {fob > 0 && (
              <Button
                onClick={handleGoToCalculator}
                variant="green"
                className="w-full"
                icon={<CalculatorIcon size={20} />}
              >
                Calcular Rentabilidad
                <FaLongArrowAltRight className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
