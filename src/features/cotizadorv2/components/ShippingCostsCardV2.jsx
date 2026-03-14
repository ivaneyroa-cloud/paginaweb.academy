import React from "react";
import { Card } from "./Card";
import { LuPlaneTakeoff as ShipIcon } from "react-icons/lu";
import { FiCheckCircle, FiCircle, FiZap, FiTruck } from "react-icons/fi";

/**
 * ShippingCostsCardV2 - Muestra el costo base y permite elegir entre Standard y Express
 * 
 * @param {Object} props
 * @param {number} props.pesoComputableTotal - Peso ya redondeado por Shippar.
 * @param {number} props.cantidadCajas       - Cantidad de bultos.
 * @param {Object} props.envioInfo           - Objeto calculado por calculationsV2: { standard, express, valorCrudoOriginal, aplicoDescuento }
 * @param {string} props.tipoEnvio           - "standard" o "express" (estado levantado)
 * @param {function} props.setTipoEnvio      - Función para cambiar la selección
 */
export const ShippingCostsCardV2 = ({
  pesoComputableTotal = 0,
  cantidadCajas = 0,
  envioInfo = { standard: 0, express: 0, valorCrudoOriginal: 0, aplicoDescuento: false },
  tipoEnvio = "standard",
  setTipoEnvio
}) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <Card
      title="Envío Internacional Shippar"
      icon={<ShipIcon size={20} className="text-sky-600" />}
    >
      <div className="flex flex-col gap-5">

        {/* Banner de Información Básica */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex justify-between items-center text-sm px-4">
          <div className="flex gap-2 text-slate-600">
            <span>Cajas: <strong className="text-slate-800">{cantidadCajas}</strong></span>
            <span className="text-slate-300">|</span>
            <span>Peso Facturable: <strong className="text-slate-800">{pesoComputableTotal.toFixed(2)} kg</strong></span>
          </div>
        </div>

        {/* Notificación de Cupón */}
        {envioInfo.aplicoDescuento && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-sm flex items-start gap-2 animate-fade-in shadow-sm">
            <FiCheckCircle className="mt-0.5 shrink-0" size={16} />
            <div>
              <p className="font-semibold leading-tight">¡Cupón aplicado exitosamente!</p>
              <p className="text-emerald-800 mt-0.5">El precio del envío ya tiene el descuento incluido sobre la tarifa de <span className="line-through font-semibold opacity-95">{formatCurrency(envioInfo.valorCrudoOriginal)}</span>.</p>
            </div>
          </div>
        )}

        {/* Opciones de Envío (Standard vs Express) */}
        <div className="mt-1">
          <p className="text-sm font-semibold text-slate-700 mb-3">Seleccioná tu método de envío:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opción STANDARD */}
          <button
            onClick={() => setTipoEnvio("standard")}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4 ${tipoEnvio === "standard"
              ? "border-sky-500 bg-sky-50 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
          >
            <div className={`shrink-0 ${tipoEnvio === "standard" ? "text-sky-600" : "text-slate-400"}`}>
              {tipoEnvio === "standard" ? <FiCheckCircle size={22} /> : <FiCircle size={22} />}
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <FiTruck className={tipoEnvio === "standard" ? "text-sky-600" : "text-slate-500"} size={14} />
                <span className={`font-bold ${tipoEnvio === "standard" ? "text-sky-800" : "text-slate-700"}`}>
                  Envío Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Tiempo de tránsito normal.</p>
            </div>

            {/* Valores Standard */}
            <div className="text-right shrink-0">
              <div className={`text-lg font-bold ${tipoEnvio === "standard" ? "text-sky-700" : "text-slate-700"}`}>
                {formatCurrency(envioInfo.standard)}
              </div>
              {pesoComputableTotal > 0 && (
                <div className={`text-sm font-semibold mt-0.5 ${tipoEnvio === "standard" ? "text-sky-600" : "text-slate-500"}`}>
                  {formatCurrency(envioInfo.standard / pesoComputableTotal)} <span className="opacity-75 font-normal text-xs">/kg</span>
                </div>
              )}
            </div>
          </button>

          {/* Opción EXPRESS */}
          <button
            onClick={() => setTipoEnvio("express")}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4 ${tipoEnvio === "express"
              ? "border-purple-500 bg-purple-50 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
          >
            <div className={`shrink-0 ${tipoEnvio === "express" ? "text-purple-600" : "text-slate-400"}`}>
              {tipoEnvio === "express" ? <FiCheckCircle size={22} /> : <FiCircle size={22} />}
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <FiZap className={tipoEnvio === "express" ? "text-purple-600" : "text-slate-500"} size={14} />
                <span className={`font-bold ${tipoEnvio === "express" ? "text-purple-800" : "text-slate-700"}`}>
                  Servicio Express
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Prioridad aduanera y operativa.</p>
            </div>

            {/* Valores Express */}
            <div className="text-right shrink-0">
              <div className={`text-lg font-bold ${tipoEnvio === "express" ? "text-purple-700" : "text-slate-700"}`}>
                {formatCurrency(envioInfo.express)}
              </div>
              {pesoComputableTotal > 0 && (
                <div className={`text-sm font-semibold mt-0.5 ${tipoEnvio === "express" ? "text-purple-600" : "text-slate-500"}`}>
                  {formatCurrency(envioInfo.express / pesoComputableTotal)} <span className="opacity-75 font-normal text-xs">/kg</span>
                </div>
              )}
            </div>
          </button>
          </div>
        </div>

      </div>
    </Card>
  );
};