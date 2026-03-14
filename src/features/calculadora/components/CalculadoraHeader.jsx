import React from "react";
import { BsCalculator as CalculatorIcon } from "react-icons/bs";

/**
 * Componente que se utiliza como encabezado de la Calculadora, mostrando el título y una breve descripción.
 */
export default function CalculadoraHeader() {
  return (
    // Replicamos el antialiased y los bordes/sombras del cotizador
    <div className="mb-8 p-6 rounded-2xl shadow-sm bg-white border border-slate-200 antialiased">
      
      {/* Título y Descripción Principal */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
        <div className="flex-shrink-0 bg-sky-50 text-sky-600 rounded-xl p-3 shadow-sm border border-sky-100">
          <CalculatorIcon size={26} />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Calculadora de Rentabilidad
          </h1>
          <p className="mt-1 max-w-2xl text-slate-600 text-base leading-relaxed">
            Con la calculadora de rentabilidad de Shippar, descubrí tu ganancia real al vender online. Solo necesitás:{" "}
            <span className="text-sky-700 font-bold">
              costos del producto, gastos de venta y precio de venta
            </span>.
          </p>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="h-px bg-slate-200 w-full mb-6" />

      {/* Guía rápida de pasos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paso 1 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-sky-600 text-white rounded-full text-xs font-bold shadow-sm">
            1
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Ingresá tus costos</h3>
            <p className="text-xs font-medium text-slate-600 mt-0.5 leading-snug">
              Precio del producto, importación y gastos adicionales.
            </p>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-sky-600 text-white rounded-full text-xs font-bold shadow-sm">
            2
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Configurá la venta</h3>
            <p className="text-xs font-medium text-slate-600 mt-0.5 leading-snug">
              Precio de venta y comisiones de la plataforma.
            </p>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-sm">
            3
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Analizá resultados</h3>
            <p className="text-xs font-medium text-slate-600 mt-0.5 leading-snug">
              Ganancia, margen y precio mínimo recomendado.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}