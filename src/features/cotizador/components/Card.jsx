import React from "react";

/**
 * Componente reutilizable para crear las tarjetas del layout Bento.
 * Proporciona un estilo base consistente (padding, sombra, bordes redondeados).
 */
export const Card = ({ title, icon, children, className = "" }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg border border-sky-400/90 flex flex-col bg-white/80 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 bg-sky-100 text-sky-700 rounded-lg p-2 mr-4">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-sky-900">{title}</h2>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
};
