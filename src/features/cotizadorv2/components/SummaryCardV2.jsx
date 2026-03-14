import React from "react";
import { Card } from "./Card";
import { Button } from "@/shared/components/ui/Button";
import { useClipboard } from "@/shared/hooks/useClipboard";
import * as CalcsV2 from "../lib/calculationsV2";

// Icons
import { IoCalculatorOutline as CalculatorIcon } from "react-icons/io5";
import { CopyIcon, DownloadIcon } from "@/shared/components/icons";

// Componente para una fila del desglose
const CostRow = ({ label, value, isSubtle = false, indent = false }) => (
  <div
    className={`flex justify-between ${isSubtle ? "text-slate-600" : "text-slate-700"
      } ${indent ? "pl-4" : ""}`}
  >
    <span>{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

/**
 * SummaryCardV2 - Tarjeta de resumen para el Cotizador V2
 * 
 * @param {Object} props - Props del componente
 * @param {number} props.valorFob - Valor FOB
 * @param {Object} props.impuestos - Objeto con desglose de impuestos
 * @param {number} props.totalImpuestos - Total de impuestos
 * @param {number} props.gastoDocumental - Gasto documental
 * @param {number} props.costoImportacion - Costo total de importación (sin FOB)
 * @param {number} props.costoFinalTotal - Costo final total (con FOB)
 * @param {Object} props.categoriaSeleccionada - Categoría seleccionada
 * @param {Array} props.cajas - Array de cajas
 * @param {number} props.pesoComputableTotal - Peso computable total
 * @param {Object} props.envioInfo - Objeto de info de envío { standard, express, valorCrudoOriginal, aplicoDescuento }
 * @param {string} props.tipoEnvio - "standard" o "express"
 * @param {string} props.codigoDescuento - Código de descuento aplicado
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
  const { copy: copyImportacion, copied: copiedImportacion } = useClipboard();

  // Calcular el valor del envío actual según el tipo seleccionado
  const costoEnvioActual = envioInfo[tipoEnvio];

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <Card
      title="Resumen Final"
      icon={<CalculatorIcon size={24} />}
      className="transition-all duration-300 hover:shadow-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
        {/* Columna Izquierda: Desglose Detallado */}
        <div className="md:col-span-2 space-y-6 text-sm">
          {/* Sección 1: Datos del Producto */}
          <div>
            <h3 className="font-bold text-base text-slate-800 mb-3">
              Datos del Producto
            </h3>
            <div className="space-y-2 pl-2 border-l-2 border-slate-200">
              <CostRow label="Categoría" value={categoriaSeleccionada.nombre} />
              <CostRow label="Precio FOB" value={formatCurrency(valorFob)} />
            </div>
          </div>

          {/* Sección 2: Impuestos y Tasas de Aduana */}
          <div>
            <h3 className="font-bold text-base text-slate-800 mb-3">
              Impuestos y Tasas de Aduana
            </h3>
            <div className="space-y-2 pl-2 border-l-2 border-slate-200">
              <CostRow
                label={`Derechos de Importación (${impuestos.importDuty.percentage.toFixed(1)}%)`}
                value={formatCurrency(impuestos.importDuty.amount)}
                isSubtle
              />
              <CostRow
                label={`Tasa Estadística (${impuestos.statisticalFee.percentage.toFixed(1)}%)`}
                value={formatCurrency(impuestos.statisticalFee.amount)}
                isSubtle
              />
              <CostRow
                label={`${impuestos.iva.name} (${impuestos.iva.percentage.toFixed(1)}%)`}
                value={formatCurrency(impuestos.iva.amount)}
                isSubtle
              />
              <CostRow
                label="Gasto Documental Aduana"
                value={formatCurrency(gastoDocumental)}
                isSubtle
              />
              <div className="flex justify-between items-center text-slate-800 font-bold pt-2 mt-2 border-t border-slate-200">
                <span>Total Impuestos y Tasas</span>
                <span>{formatCurrency(totalImpuestos)}</span>
              </div>
            </div>
          </div>

          {/* Sección 3: Envío Internacional */}
          <div>
            <h3 className="font-bold text-base text-slate-800 mb-3">
              Envío Internacional
            </h3>
            <div className="space-y-2 pl-2 border-l-2 border-slate-200">
              <CostRow
                label="Cantidad de cajas"
                value={cajas.length.toString()}
              />
              {cajas.map((caja, index) => {
                const volumetrico = CalcsV2.calcularPesoVolumetrico(
                  caja.length,
                  caja.width,
                  caja.height
                );
                const computable = CalcsV2.calcularPesoComputable(
                  caja.weight,
                  volumetrico
                );
                const dims = `${caja.length}x${caja.width}x${caja.height}cm`;
                return (
                  <CostRow
                    key={caja.id}
                    label={`- Caja ${index + 1}`}
                    value={`${computable.toFixed(2)}kg (${dims})`}
                    isSubtle
                    indent
                  />
                );
              })}
              <CostRow
                label="Peso Facturable (Vol)"
                value={`${pesoComputableTotal.toFixed(2)} kg`}
              />

              {/* Información de Servicio */}
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 mt-2">
                <span className="font-medium text-slate-700">Servicio Seleccionado</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${tipoEnvio === "standard" ? "bg-sky-100 text-sky-700" : "bg-purple-100 text-purple-700"
                  }`}>
                  {tipoEnvio === "standard" ? "Standard" : "Express"}
                </span>
              </div>

              {/* Subtotal Flete - Solo se muestra si hay descuento para visualizar el tachado */}
              {envioInfo.aplicoDescuento && (
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="font-medium text-slate-700">Tarifa Base</span>
                  <span
                    className="relative inline-block font-semibold transition-all duration-300 text-red-500 opacity-80"
                  >
                    {formatCurrency(envioInfo.valorCrudoOriginal)}

                    {/* Línea diagonal tachado */}
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <span className="w-[110%] h-[1px] bg-red-500 rotate-[-10deg] origin-center"></span>
                    </span>
                  </span>
                </div>
              )}

              {/* Fila del descuento */}
              {envioInfo.aplicoDescuento && (
                <div className="flex justify-between items-center text-sm bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                  <span className="font-medium">Cupón {codigoDescuento}</span>
                  <span className="font-semibold">Aplicado</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-800 font-bold pt-2 mt-2 border-t border-slate-200">
                <span>
                  Costo Envío Internacional
                  {envioInfo.aplicoDescuento && (
                    <span className="text-emerald-600 ml-1 text-sm font-semibold">
                      c/ descuento
                    </span>
                  )}
                </span>
                <span className={envioInfo.aplicoDescuento ? 'text-emerald-600' : ''}>
                  {formatCurrency(costoEnvioActual)}
                </span>
              </div>
              <CostRow
                label="Tarifa Efectiva por kg"
                value={pesoComputableTotal > 0 ? `${formatCurrency(costoEnvioActual / pesoComputableTotal)} / kg` : "N/A"}
                isSubtle
              />
            </div>
          </div>

          {/* Sección 4: Totales Finales */}
          <div className="pt-4 mt-6 border-t border-slate-300">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 space-y-3 shadow-sm border border-blue-100">
              {/* FOB */}
              <div className="flex justify-between items-baseline">
                <span className="text-md font-medium text-slate-800">
                  Precio FOB
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {formatCurrency(valorFob)}
                </span>
              </div>

              {/* Costos de Importación */}
              <div className="flex justify-between items-baseline">
                <span className="text-md font-medium text-slate-800">
                  Costos de Importación (Impuestos y Tasas + Envío)
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {formatCurrency(costoImportacion)}
                </span>
              </div>

              <hr className="my-2 border-blue-200" />

              {/* Costo Final Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold text-slate-800">
                  Costo Final Total
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {formatCurrency(costoFinalTotal)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Totales y Acciones */}
        <div className="md:col-span-1 flex flex-col justify-end">
          <div className="space-y-4 bg-slate-50 rounded-lg p-4 text-center border border-slate-200/80">
            {/* Costo de Importación */}
            <div>
              <h3 className="text-base text-slate-600 font-medium">
                Costos de Importación
              </h3>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl text-sky-800 font-bold">
                  {formatCurrency(costoImportacion)}
                </p>
                <button
                  onClick={() => copyImportacion(costoImportacion.toFixed(2))}
                  className="relative text-slate-500 hover:text-sky-600 transition-colors p-1"
                  aria-label="Copiar costo de importación"
                >
                  {copiedImportacion ? (
                    <span className="text-sm text-sky-600 font-semibold">
                      ¡Copiado!
                    </span>
                  ) : (
                    <CopyIcon className="cursor-pointer h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Costo Final Total */}
            <div className="pt-2 border-t border-slate-200/80">
              <h3 className="text-base text-slate-600 font-medium">
                Costo Final Total
              </h3>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl text-blue-700 font-bold">
                  {formatCurrency(costoFinalTotal)}
                </p>
                <button
                  onClick={() => copyTotal(costoFinalTotal.toFixed(2))}
                  className="relative text-slate-500 hover:text-blue-600 transition-colors p-1"
                  aria-label="Copiar costo final total"
                >
                  {copiedTotal ? (
                    <span className="text-sm text-blue-600 font-semibold">
                      ¡Copiado!
                    </span>
                  ) : (
                    <CopyIcon className="cursor-pointer h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-6 space-y-3">
            <Button
              onClick={() => copyTotal(costoFinalTotal.toFixed(2))}
              variant="secondary"
              className="w-full"
              icon={<CopyIcon size={18} />}
            >
              {copiedTotal ? "¡Copiado!" : "Copiar Total"}
            </Button>

          </div>
        </div>
      </div>
    </Card>
  );
};
