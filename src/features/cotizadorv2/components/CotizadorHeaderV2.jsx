import React from "react";

// Icons
import { FaTruckPlane } from "react-icons/fa6";

/**
 * CotizadorHeaderV2 - Encabezado con diseño de pasos horizontal (Nitidez mejorada)
 */
export default function CotizadorHeaderV2() {
  return (
    // Agregamos `antialiased` al contenedor principal para suavizar y hacer más nítidas las fuentes
    <div className="mb-8 p-6 rounded-2xl shadow-sm bg-white border border-slate-200 antialiased">

      {/* Título y Descripción Principal */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
        <div className="flex-shrink-0 bg-sky-50 text-sky-600 rounded-xl p-3 shadow-sm border border-sky-100">
          <FaTruckPlane size={26} />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cotizador de Importaciones
          </h1>
          {/* Cambiamos slate-500 por slate-600 para mayor contraste y nitidez */}
          <p className="mt-1 max-w-2xl text-slate-800 text-base leading-relaxed">
            Calculá en segundos el costo real de tus importaciones. Solo necesitás los
            <span className="text-sky-700 font-bold"> datos del producto</span> y las
            <span className="text-sky-700 font-bold"> dimensiones del envío</span>.
          </p>
        </div>
      </div>

      {/* Línea divisoria un poco más definida */}
      <div className="h-px bg-slate-200 w-full mb-6" />

      {/* Pasos a seguir */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paso 1 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-sky-600 text-white rounded-full text-xs font-bold shadow-sm">
            1
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Carga inicial</h3>
            {/* Agregamos font-medium y oscurecimos a slate-600 */}
            <p className="text-xs font-medium text-slate-600 mt-0.5 leading-snug">
              Ingresá el valor FOB y seleccioná la categoría del producto.
            </p>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-sky-600 text-white rounded-full text-xs font-bold shadow-sm">
            2
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Configurá el envío</h3>
            <p className="text-xs font-medium text-slate-600 mt-0.5 leading-snug">
              Agregá las dimensiones y el peso de cada una de tus cajas.
            </p>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-sm">
            3
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Obtene la cotización</h3>
            <p className="text-xs font-medium text-slate-600 mt-0.5 leading-snug">
              Revisá el desglose detallado de logística e impuestos finales.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}