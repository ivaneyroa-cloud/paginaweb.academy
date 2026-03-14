"use client";

import { CheckIcon, XIcon } from "@/shared/components/icons";

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

const toneStyles = {
  primary: {
    base: "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500",
  },
  danger: {
    base: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmTone = "primary",
}) {
  if (!isOpen) return null;

  const tone = toneStyles[confirmTone] || toneStyles.primary;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>

        <div className="text-slate-600 mb-6 text-sm leading-relaxed">
          {renderMessageWithBold(message)}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <XIcon className="w-4 h-4 mr-2" />
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${tone.base}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckIcon className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

