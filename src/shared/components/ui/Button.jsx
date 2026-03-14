import React from "react";

/**
 * Componente de botón reutilizable con estilos predefinidos.
 * 🚀 MIGRADO A JSX - VERSIÓN ACTIVA
 */
export const Button = ({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 ";

  const variantClasses = {
    primary:
      "border-transparent text-white bg-sky-600 hover:bg-sky-700 focus:ring-sky-500",
    secondary:
      "border-sky-300 text-sky-700 bg-white hover:bg-sky-50 focus:ring-sky-500",
    pdf: "border-rose-300 text-rose-700 bg-rose-100 hover:bg-rose-200 focus:ring-rose-300",
    green:
      "border-green-300 text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-300",
  };

  return (
    <button
      type="button"
      className={`cursor-pointer ${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
