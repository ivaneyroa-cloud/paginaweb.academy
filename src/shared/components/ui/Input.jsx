import React from "react";
import { InfoButton } from "./InfoButton";

/**
 * Componente de entrada numérica estilizado y reutilizable.
 * Facilita la consistencia visual y el manejo de valores numéricos.
 * 🚀 MIGRADO A JSX - VERSIÓN ACTIVA
 */
export const Input = ({
  label,
  value,
  onChange,
  prefix,
  placeholder,
  min = 0,
  className = "mb-4",
  type = "number",
  tip, // Nueva prop para mostrar información adicional
}) => {
  const handleChange = (e) => {
    const numericValue = parseFloat(e.target.value);
    onChange(isNaN(numericValue) ? 0 : numericValue);
  };

  return (
    <div className={`flex flex-col justify-between gap-0 ${className} `}>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-sm font-medium text-slate-600">{label}</label>
        <InfoButton tip={tip} />
      </div>
      <div className="relative">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-slate-500 sm:text-base">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          value={value === 0 ? "" : value}
          onChange={handleChange}
          placeholder={placeholder || "0"}
          min={min}
          className={`w-full bg-white rounded-md border border-sky-100 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-base transition-all duration-200 py-3 ${
            prefix ? "pl-10" : "pl-4"
          } pr-4`}
        />
      </div>
    </div>
  );
};
