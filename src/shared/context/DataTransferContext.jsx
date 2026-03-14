"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

// Tipos de datos que se transferirán del cotizador a la calculadora
const createTransferData = () => ({
  // Del cotizador
  fob: 0, // FOB -> costo total del lote (batch)
  quantity: 0, // cantidad de unidades -> cantidad de unidades
  finalCost: 0, // Costo Final Total Logístico (sin FOB) -> Costo de importación (del lote)
  unitPrice: 0, // Precio Unitario -> Costo del producto (por unidad)
  finalUnitCost: 0, // Costo Unitario Logístico Final (sin FOB) -> Costo de importación (por unidad)
  // Metadatos
  timestamp: null,
  hasData: false,
});

// Contexto
const DataTransferContext = createContext(null);

/**
 * Hook para usar el contexto de transferencia de datos
 */
export const useDataTransfer = () => {
  const context = useContext(DataTransferContext);
  if (!context) {
    throw new Error(
      "useDataTransfer debe usarse dentro de un DataTransferProvider"
    );
  }
  return context;
};

/**
 * Provider del contexto de transferencia de datos
 */
export const DataTransferProvider = ({ children }) => {
  const [transferData, setTransferData] = useState(createTransferData());
  const [hasBeenConsumed, setHasBeenConsumed] = useState(false);

  /**
   * Guarda los datos del cotizador para transferir a la calculadora
   * @param {Object} cotizadorData - Datos del cotizador
   * @param {number} cotizadorData.fob - Valor FOB total
   * @param {number} cotizadorData.quantity - Cantidad de unidades
   * @param {number} cotizadorData.finalCost - Costo final total logístico (sin FOB)
   * @param {number} cotizadorData.unitPrice - Precio por unidad
   * @param {number} cotizadorData.finalUnitCost - Costo unitario logístico final (sin FOB)
   */
  const saveTransferData = useCallback((cotizadorData) => {
    const data = {
      fob: cotizadorData.fob || 0,
      quantity: cotizadorData.quantity || 0,
      finalCost: cotizadorData.finalCost || 0,
      unitPrice: cotizadorData.unitPrice || 0,
      finalUnitCost: cotizadorData.finalUnitCost || 0,
      timestamp: Date.now(),
      hasData: true,
    };

    setTransferData(data);
    setHasBeenConsumed(false);

    // También guardamos en localStorage para persistencia entre sesiones
    try {
      localStorage.setItem("shippar:data-transfer", JSON.stringify(data));
    } catch (error) {
      console.error("Error guardando datos de transferencia:", error);
    }
  }, []);

  /**
   * Obtiene los datos para la calculadora y los marca como consumidos
   * @returns {Object|null} Datos transferidos o null si no hay datos o ya fueron consumidos
   */
  const getTransferData = useCallback(() => {
    if (!transferData.hasData || hasBeenConsumed) {
      return null;
    }
    return transferData;
  }, [transferData, hasBeenConsumed]);

  /**
   * Marca los datos como consumidos (aceptados por el usuario)
   */
  const consumeTransferData = useCallback(() => {
    setHasBeenConsumed(true);
    // Limpiar del localStorage una vez consumido
    try {
      localStorage.removeItem("shippar:data-transfer");
    } catch (error) {
      console.error("Error limpiando datos de transferencia:", error);
    }
  }, []);

  /**
   * Rechaza los datos transferidos
   */
  const rejectTransferData = useCallback(() => {
    setTransferData(createTransferData());
    setHasBeenConsumed(true);
    // Limpiar del localStorage
    try {
      localStorage.removeItem("shippar:data-transfer");
    } catch (error) {
      console.error("Error limpiando datos de transferencia:", error);
    }
  }, []);

  /**
   * Carga datos de localStorage al inicializar (para persistencia entre sesiones)
   */
  const loadTransferData = useCallback(() => {
    try {
      const stored = localStorage.getItem("shippar:data-transfer");
      if (stored) {
        const data = JSON.parse(stored);
        // Solo cargar si los datos son recientes (menos de 1 hora)
        if (data.timestamp && Date.now() - data.timestamp < 3600000) {
          setTransferData(data);
          setHasBeenConsumed(false);
        } else {
          // Limpiar datos viejos
          localStorage.removeItem("shippar:data-transfer");
        }
      }
    } catch (error) {
      console.error("Error cargando datos de transferencia:", error);
      // Limpiar datos corruptos
      localStorage.removeItem("shippar:data-transfer");
    }
  }, []);

  const value = {
    transferData,
    hasBeenConsumed,
    saveTransferData,
    getTransferData,
    consumeTransferData,
    rejectTransferData,
    loadTransferData,
  };

  return (
    <DataTransferContext.Provider value={value}>
      {children}
    </DataTransferContext.Provider>
  );
};
