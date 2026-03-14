import React from "react";

/**
 * Componente Card Premium para layout Bento.
 * Diseño ultra nítido, bordes suaves y padding compacto.
 */
export const Card = ({ title, icon, children, className = "", noPadding = false }) => {
  return (
    <div
      className={`relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col antialiased overflow-hidden group ${className}`}
    >
      {/* 🪄 MAGIA 1: Destello superior sutil (Efecto cristal/luz) */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-sky-300/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Header Condicional (Padding reducido de px-6/pt-6 a px-5/pt-5) */}
      {(title || icon) && (
        <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-slate-100/60">
          {icon && (
            <div className="flex-shrink-0 bg-sky-50 text-sky-600 rounded-xl p-2.5 border border-sky-100/50">
              {icon}
            </div>
          )}
          {title && (
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* 🪄 MAGIA 2: Flex-grow con padding dinámico (Reducido de p-6 a p-5) */}
      <div className={`flex-grow ${noPadding ? "" : "p-5"}`}>
        {children}
      </div>
    </div>
  );
};