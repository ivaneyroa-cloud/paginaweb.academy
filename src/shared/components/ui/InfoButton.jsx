import React, { useState } from "react";
import { IoInformationCircleOutline as InfoIcon } from "react-icons/io5";

/**
 * Componente InfoButton que muestra un tooltip con información al hacer clic
 */
export const InfoButton = ({ tip, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!tip) return null;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full flex items-center justify-center"
        aria-label="Más información"
      >
        <InfoIcon size={18} />
      </button>

      {isOpen && (
        <div className="absolute z-50 -left-32 top-full mt-2 w-80 p-3 bg-white border border-slate-200 rounded-lg shadow-lg">
          <div className="text-xs text-slate-700 space-y-2">
            {Array.isArray(tip) ? (
              <ul className="list-disc list-inside space-y-1">
                {tip.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            ) : (
              <p dangerouslySetInnerHTML={{ __html: tip }} />
            )}
          </div>
          {/* Flecha del tooltip apuntando hacia arriba */}
          <div className="absolute -top-1 left-36 w-2 h-2 bg-white border-l border-t border-slate-200 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};
