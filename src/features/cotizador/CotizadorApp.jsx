"use client"; // si usás hooks de React

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRef } from "react";
import { usePathname } from "next/navigation";

// Note: Types removed in JSX version - functionality preserved without TypeScript interfaces

// Constants
import { CATEGORIES, INITIAL_BOXES } from "./constants";

// Cálculos
import * as Calcs from "./lib/calculations";

// Componentes
import CotizadorHeader from "./components/CotizadorHeader";
import { ProductCard } from "./components/ProductCard";
import { CategoryCard } from "./components/CategoryCard";
import { BoxesCard } from "./components/BoxesCard";
import { ShippingCostsCard } from "./components/ShippingCostsCard";
import { SummaryCard } from "./components/SummaryCard";
import { CostChart } from "./components/CostChart";

// UI Compartida
import { Button } from "@/shared/components/ui/Button";

// Hooks
import { useClipboard } from "@/shared/hooks/useClipboard";
import { formatSummary } from "./lib/formatSummary";

// Icons
import { CopyIcon } from "@/shared/components/icons";

// --- Lógica de Persistencia de Datos ---
const STORAGE_KEY = "importCalculatorState";

/**
 * El componente principal de la aplicación que orquesta el estado y la interfaz.
 * @returns {React.ReactElement} El componente principal del cotizador
 */
export default function App() {
  // Hook de clipboard
  const { copy, copied } = useClipboard();
  const pathname = usePathname();

  // Estado para controlar si ya se cargaron los datos iniciales
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  // Estado para los datos del producto.
  // Inicializamos con valores por defecto vacíos y los hidratamos desde localStorage
  // dentro de useEffect para asegurar que el acceso a localStorage ocurre en el cliente.
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  // Make FOB a controlled state so it can be entered independently of quantity
  const [fob, setFob] = useState(0);
  // Refs to control debounce and last edited field to avoid overwriting user input
  const lastEditedRef = useRef(null); // 'fob' | 'unitPrice' | null
  const syncTimerRef = useRef(null);

  // Estado para la categoría de producto seleccionada
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  // Estado para la lista de cajas de embalaje
  const [boxes, setBoxes] = useState(INITIAL_BOXES);

  // Hidratar estado desde localStorage cuando el cliente monta
  useEffect(() => {
    // Agregar un pequeño delay para asegurar que localStorage esté disponible
    const loadData = () => {
      try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        console.log(
          "Cotizador: Intentando cargar datos del localStorage:",
          serializedState ? "datos encontrados" : "no hay datos"
        );

        if (!serializedState) {
          setIsInitialDataLoaded(true);
          return;
        }
        const saved = JSON.parse(serializedState);

        if (typeof saved.unitPrice === "number") setUnitPrice(saved.unitPrice);
        if (typeof saved.quantity === "number") setQuantity(saved.quantity);
        if (typeof saved.fob === "number") setFob(saved.fob);

        if (saved.selectedCategoryName) {
          const found = CATEGORIES.find(
            (c) => c.name === saved.selectedCategoryName
          );
          if (found) setSelectedCategory(found);
        }

        if (Array.isArray(saved.boxes)) setBoxes(saved.boxes);

        console.log("Cotizador: Datos cargados exitosamente");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          "No se pudo hidratar el estado desde localStorage:",
          error
        );
      }

      // Marcar que la carga inicial está completa
      setIsInitialDataLoaded(true);
    };

    // Ejecutar inmediatamente
    loadData();

    // También ejecutar con un pequeño delay por si acaso
    const timeoutId = setTimeout(loadData, 100);

    // Escuchar evento de focus de la ventana para recargar si se navega desde otra página
    const handleFocus = () => {
      console.log("Cotizador: Ventana enfocada, recargando datos...");
      loadData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // useEffect adicional para cuando se navega a esta página
  useEffect(() => {
    // Solo ejecutar si estamos en la ruta del cotizador
    if (pathname === "/cotizador") {
      console.log("Cotizador: Navegado a la página, recargando datos...");

      try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState) {
          const saved = JSON.parse(serializedState);

          if (typeof saved.unitPrice === "number")
            setUnitPrice(saved.unitPrice);
          if (typeof saved.quantity === "number") setQuantity(saved.quantity);
          if (typeof saved.fob === "number") setFob(saved.fob);

          if (saved.selectedCategoryName) {
            const found = CATEGORIES.find(
              (c) => c.name === saved.selectedCategoryName
            );
            if (found) setSelectedCategory(found);
          }

          if (Array.isArray(saved.boxes)) setBoxes(saved.boxes);

          console.log("Cotizador: Datos recargados por navegación");
        }

        // Marcar como cargado después de la navegación
        setIsInitialDataLoaded(true);
      } catch (error) {
        console.error("Error recargando datos por navegación:", error);
        setIsInitialDataLoaded(true);
      }
    }
  }, [pathname]);

  // --- LOCAL STORAGE Persistence ---
  // useEffect para guardar el estado en localStorage cada vez que un dato relevante cambia.
  useEffect(() => {
    // Solo guardar después de que se haya completado la carga inicial
    if (!isInitialDataLoaded) {
      console.log("Cotizador: Saltando guardado - carga inicial no completada");
      return;
    }

    try {
      const stateToSave = {
        unitPrice,
        quantity,
        fob,
        selectedCategoryName: selectedCategory.name,
        boxes,
      };
      const serializedState = JSON.stringify(stateToSave);
      localStorage.setItem(STORAGE_KEY, serializedState);
      console.log("Cotizador: Datos guardados en localStorage:", stateToSave);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("No se pudo guardar el estado en localStorage:", error);
    }
  }, [isInitialDataLoaded, unitPrice, quantity, fob, selectedCategory, boxes]);

  // --- MEMOIZED CALCULATIONS ---
  // Utilizamos useMemo para recalcular valores solo cuando sus dependencias cambian,
  // optimizando el rendimiento.

  // Calcula el peso computable total de todas las cajas.
  const totalComputableWeight = useMemo(
    () => Calcs.calculateTotalComputableWeight(boxes),
    [boxes]
  );

  // Obtiene la tarifa de flete por kg basada en el peso total.
  const freightRate = useMemo(
    () => Calcs.getFreightRate(totalComputableWeight),
    [totalComputableWeight]
  );

  // Calcula el costo total del flete internacional.
  const internationalFreight = useMemo(
    () =>
      Calcs.calculateInternationalFreight(totalComputableWeight, freightRate),
    [totalComputableWeight, freightRate]
  );

  // Calcula el costo de los servicios documentales de aduana.
  const customsDocumentalFee = useMemo(
    () => Calcs.calculateCustomsFee(fob),
    [fob]
  );

  // Calcula el desglose y el total de los impuestos.
  const taxes = useMemo(
    () => Calcs.calculateTaxes(fob, selectedCategory),
    [fob, selectedCategory]
  );
  // FIX: Removing explicit type annotation to prevent TypeScript errors in JSX version
  const totalTaxes = useMemo(
    () => Object.values(taxes).reduce((sum, tax) => sum + tax.amount, 0),
    [taxes]
  );

  // Calcula el costo final total y por unidad.
  const finalCost = useMemo(
    () =>
      Calcs.calculateFinalCost(
        fob,
        internationalFreight,
        customsDocumentalFee,
        totalTaxes
      ),
    [fob, internationalFreight, customsDocumentalFee, totalTaxes]
  );
  const finalUnitCost = useMemo(
    () => Calcs.calculateFinalUnitCost(finalCost, quantity),
    [finalCost, quantity]
  );

  // --- HANDLERS ---
  // Funciones para manejar los cambios de estado desde los componentes hijos.
  // Usamos useCallback para evitar que se recreen en cada render.

  const handleUnitPriceChange = useCallback((value) => {
    setUnitPrice(value > 0 ? value : 0);
    lastEditedRef.current = "unitPrice";
    // Debounced sync: update FOB after 500ms if quantity > 0
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      if (quantity > 0) {
        setFob(Calcs.calculateFob(value > 0 ? value : 0, quantity));
      }
      syncTimerRef.current = null;
    }, 500);
  }, []);

  const handleQuantityChange = useCallback((value) => {
    setQuantity(value > 0 ? value : 0);
    lastEditedRef.current = "quantity";
    // When quantity changes, debounce a sync depending on last edited field
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      // If user last edited unitPrice, update FOB; if last edited FOB, update unitPrice
      if (value > 0) {
        if (lastEditedRef.current === "unitPrice") {
          setFob(Calcs.calculateFob(unitPrice, value));
        } else if (lastEditedRef.current === "fob") {
          // Only update unitPrice from FOB if FOB > 0
          if (fob > 0) {
            const newUnit = Calcs.calculateUnitPrice(fob, value);
            setUnitPrice(newUnit > 0 ? newUnit : 0);
          }
        }
      }
      syncTimerRef.current = null;
    }, 500);
  }, []);

  const handleFobChange = useCallback(
    (value) => {
      // Update FOB state but avoid immediate overwrite of unitPrice; use debounce
      const normalized = value >= 0 ? value : 0;
      setFob(normalized);
      lastEditedRef.current = "fob";
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        if (quantity > 0) {
          const newUnitPrice = Calcs.calculateUnitPrice(normalized, quantity);
          setUnitPrice(newUnitPrice > 0 ? newUnitPrice : 0);
        }
        syncTimerRef.current = null;
      }, 500);
    },
    [quantity]
  );

  // When unitPrice or quantity change, keep FOB in sync
  useEffect(() => {
    // Keep previous behavior but guarded: don't overwrite if user recently edited FOB
    if (quantity > 0) {
      // If last edited was FOB, avoid immediately overwriting it.
      if (lastEditedRef.current === "fob") return;
      setFob(Calcs.calculateFob(unitPrice, quantity));
    }
  }, [unitPrice, quantity]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, []);

  const handleBoxesChange = useCallback((updatedBoxes) => {
    setBoxes(updatedBoxes);
  }, []);

  const handleCategoryChange = useCallback((categoryName) => {
    const category =
      CATEGORIES.find((c) => c.name === categoryName) || CATEGORIES[0];
    setSelectedCategory(category);
  }, []);

  return (
    <main className="min-h-screen p-4 py-14 lg:py-18">
      <div className="max-w-7xl mx-auto">
        {/* Introduccion con título */}
        <CotizadorHeader />

        {/* Layout principal de grid mixto, siguiendo el prototipo. Se elimina 'items-start' para que las cards de la misma fila tengan igual altura. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductCard
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            unitPrice={unitPrice}
            quantity={quantity}
            fob={fob}
            onCategoryChange={handleCategoryChange}
            onUnitPriceChange={handleUnitPriceChange}
            onQuantityChange={handleQuantityChange}
            onFobChange={handleFobChange}
          />
          <CategoryCard
            selectedCategory={selectedCategory}
            taxes={taxes}
            totalTaxes={totalTaxes}
            customsDocumentalFee={customsDocumentalFee}
          />

          <div className="lg:col-span-2">
            <BoxesCard boxes={boxes} onBoxesChange={handleBoxesChange} />
          </div>

          {/* Nueva tarjeta unificada que reemplaza a las dos anteriores */}
          <ShippingCostsCard
            totalComputableWeight={totalComputableWeight}
            freightRate={freightRate}
            internationalFreight={internationalFreight}
          />

          {/* Gráfico de distribución de costos */}
          <CostChart
            fob={fob}
            quantity={quantity}
            totalComputableWeight={totalComputableWeight}
            internationalFreight={internationalFreight}
            taxes={taxes}
            customsDocumentalFee={customsDocumentalFee}
          />

          <div className="lg:col-span-2">
            <SummaryCard
              selectedCategory={selectedCategory}
              fob={fob}
              quantity={quantity}
              boxes={boxes}
              totalComputableWeight={totalComputableWeight}
              freightRatePerKg={freightRate}
              taxes={taxes}
              totalTaxes={totalTaxes}
              customsDocumentalFee={customsDocumentalFee}
              internationalFreight={internationalFreight}
              finalCost={finalCost}
              finalUnitCost={finalUnitCost}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
