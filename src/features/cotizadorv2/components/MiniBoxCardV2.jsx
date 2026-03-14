import React from "react";

import * as CalcsV2 from "../lib/calculationsV2";

// Icons
import { TrashIcon } from "@/shared/components/icons";
import { FaRegCopy } from "react-icons/fa6";

/**
 * Componente para una mini tarjeta de caja individual (V2)
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.box - Datos de la caja
 * @param {number} props.index - Índice de la caja
 * @param {function} props.onChange - Función para cambiar datos de la caja
 * @param {function} props.onRemove - Función para remover la caja
 * @param {function} props.onDuplicate - Función para duplicar la caja
 * @param {boolean} [props.isRemovable=true] - Si la caja se puede remover
 * @param {Object} props.errores - Objeto con errores de validación para esta caja
 */
export const MiniBoxCardV2 = ({
  box,
  index,
  onChange,
  onRemove,
  onDuplicate,
  isRemovable = true,
  errores = {},
}) => {
  const volumetricWeight = CalcsV2.calcularPesoVolumetrico(
    box.length,
    box.width,
    box.height
  );
  const computableWeight = CalcsV2.calcularPesoComputable(
    box.weight,
    volumetricWeight
  );

  const handleInput = (field, value) => {
    onChange(box.id, field, parseFloat(value) || 0);
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-sky-200/80 transition-all flex flex-col space-y-3 h-full min-h-[180px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-slate-700 text-sm">Caja {index + 1}</h4>
        <div className="flex gap-1">
          {/* Botón duplicar */}
          <button
            onClick={() => onDuplicate(box)}
            className="cursor-pointer p-2 rounded-full text-sky-600 hover:text-sky-700 hover:bg-sky-100 transition-colors"
            aria-label={`Duplicar Caja ${index + 1}`}
            title="Duplicar caja"
          >
            <FaRegCopy className="h-4 w-4"/>
          </button>
          {/* Botón eliminar */}
          {isRemovable && (
            <button
              onClick={() => onRemove(box.id)}
              className="cursor-pointer p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
              aria-label={`Eliminar Caja ${index + 1}`}
              title="Eliminar caja"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-3">
        {/* Peso */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={box.weight || ""}
            onChange={(e) => handleInput("weight", e.target.value)}
            placeholder="0"
            className={`h-9 w-full bg-white rounded-md border shadow-sm 
                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-center px-2 ${
                      errores.peso ? "border-red-400" : "border-sky-200"
                    }`}
          />
          {errores.peso && (
            <p className="text-xs text-red-600 font-medium mt-1">!</p>
          )}
        </div>

        {/* Dimensiones */}
        <div className="col-span-2 flex flex-col h-full">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Dimensiones (cm)
          </label>
          <div className="grid grid-cols-3 gap-1 mt-auto">
            <div>
              <input
                placeholder="L"
                value={box.length || ""}
                onChange={(e) => handleInput("length", e.target.value)}
                className={`h-9 w-full bg-white rounded-md border shadow-sm 
                      focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-center px-1 ${
                        errores.length ? "border-red-400" : "border-sky-200"
                      }`}
              />
              {errores.length && <p className="text-xs text-red-600 font-medium mt-0.5">!</p>}
            </div>
            <div>
              <input
                placeholder="A"
                value={box.width || ""}
                onChange={(e) => handleInput("width", e.target.value)}
                className={`h-9 w-full bg-white rounded-md border shadow-sm 
                      focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-center px-1 ${
                        errores.width ? "border-red-400" : "border-sky-200"
                      }`}
              />
              {errores.width && <p className="text-xs text-red-600 font-medium mt-0.5">!</p>}
            </div>
            <div>
              <input
                placeholder="H"
                value={box.height || ""}
                onChange={(e) => handleInput("height", e.target.value)}
                className={`h-9 w-full bg-white rounded-md border shadow-sm 
                      focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-center px-1 ${
                        errores.height ? "border-red-400" : "border-sky-200"
                      }`}
              />
              {errores.height && <p className="text-xs text-red-600 font-medium mt-0.5">!</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-auto pt-2 border-t border-slate-200/80 text-sm space-y-1">
        <div className="flex justify-between text-slate-600">
          <span>Volumétrico:</span>
          <span className="font-bold text-slate-800">
            {volumetricWeight.toFixed(2)} kg
          </span>
        </div>
        <div className="flex justify-between text-sky-700">
          <span className="font-medium">Computable:</span>
          <span className="font-bold text-sky-800">
            {computableWeight.toFixed(2)} kg
          </span>
        </div>
      </div>
    </div>
  );
};
