import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency } from "@/shared/lib/formatters";
import { CheckIcon, XIcon, InfoIcon } from "@/shared/components/icons";

/**
 * Mensaje de confirmación para datos precargados desde el cotizador
 * @param {Object} props
 * @param {Object} props.transferData - Datos transferidos desde el cotizador
 * @param {Function} props.onAccept - Función para aceptar los datos
 * @param {Function} props.onReject - Función para rechazar los datos
 * @param {Function} props.onDismiss - Función para ocultar temporalmente el mensaje
 */
export const DataTransferMessage = ({
  transferData,
  onAccept,
  onReject,
  onDismiss,
}) => {
  if (!transferData) return null;

  const { fob, quantity, finalCost, unitPrice, finalUnitCost } = transferData;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Icono principal */}
        <div className="flex-shrink-0 mt-0.5">
          <InfoIcon className="h-5 w-5 text-yellow-600" />
        </div>

        <div className="flex-grow">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Datos disponibles del Cotizador
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-slate-500 hover:text-slate-700 transition-colors p-1"
                aria-label="Ocultar mensaje temporalmente"
              >
                <XIcon size={16} />
              </button>
            )}
          </div>

          {/* Descripción */}
          <p className="text-sm text-slate-800 mb-4 leading-relaxed">
            Encontramos información calculada en el cotizador. ¿Quieres
            precargarla en la calculadora de rentabilidad?
            <span className="block text-xs text-slate-600 mt-1">
              Podrás editar todos los valores en cualquier momento.
            </span>
          </p>

          {/* Datos listados en tabla compacta */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5 max-w-md">
            <span className="text-slate-600">Costo total del lote:</span>
            <span className="text-slate-900 font-semibold text-right">
              {formatCurrency(fob)}
            </span>

            <span className="text-slate-600">Cantidad de unidades:</span>
            <span className="text-slate-900 font-semibold text-right">
              {quantity.toLocaleString()}
            </span>

            <span className="text-slate-600">Costo de importación (lote):</span>
            <span className="text-slate-900 font-semibold text-right">
              {formatCurrency(finalCost)}
            </span>

            <span className="text-slate-600">Costo del producto (unidad):</span>
            <span className="text-slate-900 font-semibold text-right">
              {formatCurrency(unitPrice)}
            </span>

            <span className="text-slate-600">
              Costo de importación (unidad):
            </span>
            <span className="text-slate-900 font-semibold text-right">
              {formatCurrency(finalUnitCost)}
            </span>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onAccept}
              variant="primary"
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white w-full sm:w-auto"
              icon={<CheckIcon size={14} />}
            >
              Usar estos datos
            </Button>
            <Button
              onClick={onReject}
              variant="secondary"
              size="sm"
              className="text-slate-800 border-yellow-300 hover:bg-yellow-100 w-full sm:w-auto"
              icon={<XIcon size={14} />}
            >
              Empezar desde cero
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
