"use client";

import { CheckIcon } from "@/shared/components/icons";
import { FiAlertCircle } from "react-icons/fi";

/**
 * Helper para renderizar texto con markdown simple (negrita)
 * Convierte **texto** en <strong>texto</strong>
 */
function renderMessageWithBold(message) {
  if (!message) return null;
  
  const parts = message.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-slate-900">{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

export function ResultModal({
  isOpen,
  onClose,
  isSuccess = true,
  title,
  message,
  actionLabel = "Cerrar",
}) {
  if (!isOpen) return null;

  const successClasses = "bg-green-600 hover:bg-green-700 focus:ring-green-500";
  const errorClasses = "bg-red-600 hover:bg-red-700 focus:ring-red-500";

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-4">
          {isSuccess ? (
            <div className="bg-green-100 rounded-full p-3 mb-3">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
          ) : (
            <div className="bg-red-100 rounded-full p-3 mb-3">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
          )}

          <h3 className={`text-xl font-bold ${isSuccess ? "text-green-800" : "text-red-800"}`}>
            {title}
          </h3>
        </div>

        <div className="text-slate-600 text-center mb-6 text-sm leading-relaxed">
          {renderMessageWithBold(message)}
        </div>

        <button
          onClick={onClose}
          className={`cursor-pointer w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
            isSuccess ? successClasses : errorClasses
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

