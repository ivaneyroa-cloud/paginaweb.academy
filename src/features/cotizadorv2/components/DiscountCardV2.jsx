import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Card } from "./Card";
import { LuTag } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { validarCuponAction } from "../actions";

/**
 * DiscountCardV2 - Paso 3: Código de descuento de envío
 *
 * @param {number}   props.porcentajeDescuento - Porcentaje de descuento actualmente aplicado
 * @param {string}   props.codigoDescuento     - Código aplicado (para mostrar feedback)
 * @param {function} props.onDescuentoChange   - Callback para actualizar el porcentaje del descuento
 * @param {function} props.onCodigoChange      - Callback para actualizar el código
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
      // Si está vacío, limpiamos el padre y avanzamos
      if (!parsedCodigo) {
        if (porcentajeDescuento > 0) handleLimpiar();
        return true;
      }
      // Si es el mismo código que ya validé, ok
      if (parsedCodigo === codigoDescuento && porcentajeDescuento > 0) {
        return true;
      }
      // Sino, validarlo ahora mismo
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

  return (
    <Card
      title="Paso 3: Código de Descuento"
      icon={<LuTag size={20} className="text-sky-600" />}
      className="transition-all duration-300 hover:shadow-xl border-1 border-sky-200"
    >
      <div className="space-y-2">
        {/* Descripción */}
        <p className="text-sm text-slate-500">
          Si tenés un código de descuento, ingresalo acá para aplicarlo al costo de envío.
          Este campo es <span className="font-medium text-slate-600">opcional</span>.
        </p>

        {/* Input + Botón */}
        <div className="flex gap-2">
          <input
            type="text"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value.toUpperCase());
              setMensajeError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ej: SH-20"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 uppercase bg-white transition-all ${mensajeError
              ? "border-red-400 focus:ring-red-500/50"
              : porcentajeDescuento > 0
                ? "border-emerald-400 focus:ring-emerald-500/50"
                : "border-slate-300"
              }`}
          />
          <button
            onClick={handleAplicarDescuento}
            disabled={codigo.length === 0 || isApplying}
            className={`cursor-pointer px-6 md:px-20 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${codigo.length > 0 && !isApplying
              ? "bg-sky-600   hover:bg-sky-700 text-white shadow-sm"
              : "bg-slate-200 text-slate-500 border border-transparent cursor-not-allowed"
              }`}
          >
            {isApplying ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validando...
              </>
            ) : (
              "Aplicar"
            )}
          </button>
        </div>

        {/* Mensaje de error */}
        {mensajeError && (
          <p className="text-xs text-red-500 font-medium">{mensajeError}</p>
        )}

        {/* Feedback de descuento aplicado */}
        {porcentajeDescuento > 0 && (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2.5 rounded-lg animate-fade-in">
            <span className="flex items-center gap-2 text-sm font-medium">
              <FaRegCircleCheck size={16} />
              Cupón <strong>{codigoDescuento}</strong> aplicado
            </span>
            <button
              onClick={handleLimpiar}
              className="text-xs text-emerald-600 hover:text-emerald-800 underline cursor-pointer"
            >
              Quitar
            </button>
          </div>
        )}
      </div>
    </Card>
  );
});
