/**
 * ResultCard.jsx
 *
 * Componente de tarjeta para mostrar un KPI financiero (métrica clave)
 * dentro de la calculadora de rentabilidad.
 *
 * Características:
 * - Muestra un label (nombre de la métrica), el valor principal y un subtítulo opcional.
 * - Diseño centrado, minimalista y con colores personalizables según el estado (ej: verde para positivo, rojo para negativo).
 * - Incluye un ícono de información que despliega un tooltip explicativo:
 *    • En desktop: el tooltip aparece al hacer hover.
 *    • En mobile: el tooltip aparece al hacer tap (click).
 * - El tooltip se cierra automáticamente al hacer click fuera del ícono.
 * - Animaciones suaves con TailwindCSS (fade/scale).
 *
 */

import React, { useState, useRef, useEffect } from "react";
import { IoInformationCircleOutline as InfoIcon } from "react-icons/io5";

/**
 * ResultCard con tooltip.
 * - Desktop: aparece con hover.
 * - Mobile: aparece con click/tap en el ícono.
 * - Se cierra automáticamente al hacer click fuera.
 */
export const ResultCard = ({
  label,
  value,
  subtitle,
  valueColorClass = "text-slate-800",
  className,
  infoText,
}) => {
  const [isOpen, setIsOpen] = useState(false); // estado del tooltip
  const tooltipRef = useRef(null);

  // Hook para cerrar el tooltip si clickeo fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60 
      text-center flex flex-col justify-center ${className}`}
    >
      {/* Header con label + info */}
      <div className="flex items-center justify-center gap-2 relative">
        <h3 className="text-base font-semibold text-slate-700">{label}</h3>

        {infoText && (
          <div className="relative flex items-center" ref={tooltipRef}>
            {/* Ícono: hover en desktop, click en mobile */}
            <InfoIcon
              className="h-5 w-5 text-slate-500 cursor-pointer hover:text-slate-600"
              onClick={() => setIsOpen(!isOpen)}
            />

            {/* Tooltip */}
            <div
              className={`
                absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                w-56 rounded-lg bg-slate-800 text-white text-xs p-2 text-center
                shadow-lg z-10 transition-all duration-200 ease-out

                opacity-0 scale-95 pointer-events-none
                group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : ""}
              `}
            >
              {infoText}
              {/* Flechita */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-slate-800" />
            </div>
          </div>
        )}
      </div>

      {/* Valor principal */}
      <div className="my-2">
        <p
          className={`text-4xl lg:text-5xl font-bold ${valueColorClass} truncate`}
        >
          {value}
        </p>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
