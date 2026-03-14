import { useState, useCallback } from "react";

/**
 * Hook reutilizable para manejar la copia de texto al portapapeles.
 * @param {number} timeout - Duración en milisegundos para resetear el estado 'copied'.
 * @returns {Object} Un objeto con la función 'copy' y el estado booleano 'copied'.
 */
export const useClipboard = (timeout = 2000) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn("El portapapeles no está disponible en este navegador.");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, timeout);

        return true;
      } catch (error) {
        console.error("Error al copiar al portapapeles:", error);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { copy, copied };
};
