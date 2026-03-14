"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";

// Context
import { useDataTransfer } from "@/shared/context/DataTransferContext";

// Components
import { DataTransferMessage } from "./components/DataTransferMessage";

// Cálculos
import * as PCalcs from "./lib/profitabilityCalculations";

// Componentes
import CalculadoraHeader from "@/features/calculadora/components/CalculadoraHeader";

import { TotalCostsCard } from "./components/TotalCostsCard";
import { SalesCard } from "./components/SalesCard";
import { ResultCard } from "./components/ResultCard";
import VolumeAnalysisCard from "./components/VolumeAnalysisCard";
import BreakEvenPriceCard from "./components/BreakEvenPriceCard";

// UI Compartida — no longer using Button component
// import { Button } from "@/shared/components/ui/Button";

// Hooks
import { useClipboard } from "@/shared/hooks/useClipboard";
import { formatProfitabilityAnalysis } from "./lib/formatProfitabilityAnalysis";
import {
  formatCurrency,
  formatPercent,
} from "@/shared/lib/formatters";

// Icons
import { CopyIcon } from "@/shared/components/icons";
import { IoInformationCircleOutline as InfoIcon } from "react-icons/io5";

/**
 * Componente principal de la calculadora de rentabilidad
 */
export const CalculadoraApp = () => {
  // --- STATE MANAGEMENT ---
  const { copy, copied } = useClipboard();
  // Solo usamos el contexto para acceder a saveTransferData desde el cotizador
  const { saveTransferData } = useDataTransfer();

  // Transfer data state
  const [showTransferMessage, setShowTransferMessage] = useState(false);
  const [transferData, setTransferData] = useState(null);
  const [messageTemporarilyHidden, setMessageTemporarilyHidden] =
    useState(false);

  // Mode and Inputs State
  const [calculationMode, setCalculationMode] = useState("unit"); // "unit" o "batch"
  // Unit Mode State
  const [unitProductCost, setUnitProductCost] = useState(0);
  const [unitShippingCost, setUnitShippingCost] = useState(0);
  const [unitAdditionalCosts, setUnitAdditionalCosts] = useState([]);
  // Batch Mode State
  const [batchTotalCost, setBatchTotalCost] = useState(0);
  const [batchShippingCost, setBatchShippingCost] = useState(0);
  const [batchQuantity, setBatchQuantity] = useState(0);
  const [batchAdditionalCosts, setBatchAdditionalCosts] = useState([]);
  // Global Multiplier State
  const [globalMultiplier, setGlobalMultiplier] = useState(1);

  // Sales State
  const [grossSellingPrice, setGrossSellingPrice] = useState(0);
  const [promotionalDiscount, setPromotionalDiscount] = useState(0);
  const [platformFeePercent, setPlatformFeePercent] = useState(15);
  const [paymentFeePercent, setPaymentFeePercent] = useState(0);
  const [installmentFeePercent, setInstallmentFeePercent] = useState(0);
  const [taxesAndRetentions, setTaxesAndRetentions] = useState(0);
  const [sellerShippingCost, setSellerShippingCost] = useState(0);

  // Projections State
  const [projectedQuantity, setProjectedQuantity] = useState(100);

  // Sincronizar projectedQuantity (proyeccion) con batchQuantity (cantidad por lote en costos) en modo batch
  useEffect(() => {
    if (calculationMode === "batch" && batchQuantity > 0) {
      setProjectedQuantity(batchQuantity);
    }
  }, [batchQuantity, calculationMode]);

  // --- LOCAL STORAGE Persistence ---
  // cambiarle key si cambia el formato de los datos
  const STORAGE_KEY = "shippar:calculadora:v1";

  // Cargar datos guardados al iniciar la app
  useEffect(() => {
    // Primero cargar datos de transferencia directamente desde localStorage
    try {
      const stored = localStorage.getItem("shippar:data-transfer");
      if (stored) {
        const data = JSON.parse(stored);
        // Solo cargar si los datos son recientes (menos de 1 hora)
        if (
          data.timestamp &&
          Date.now() - data.timestamp < 3600000 &&
          data.hasData
        ) {
          setTransferData(data);
          // Solo mostrar el mensaje si no fue ocultado temporalmente en esta sesión
          const wasTemporarilyHidden =
            sessionStorage.getItem("shippar:transfer-message-hidden") ===
            "true";
          setShowTransferMessage(!wasTemporarilyHidden);
          setMessageTemporarilyHidden(wasTemporarilyHidden);
        } else {
          // Limpiar datos viejos
          localStorage.removeItem("shippar:data-transfer");
        }
      }
    } catch (error) {
      console.error("Error cargando datos de transferencia:", error);
      localStorage.removeItem("shippar:data-transfer");
    }

    // Luego cargar datos persistidos de la calculadora
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const savedData = JSON.parse(raw);

      if (savedData.calculationMode)
        setCalculationMode(savedData.calculationMode);

      setUnitProductCost(savedData.unitProductCost ?? 0);
      setUnitShippingCost(savedData.unitShippingCost ?? 0);
      setUnitAdditionalCosts(savedData.unitAdditionalCosts ?? []);

      setBatchTotalCost(savedData.batchTotalCost ?? 0);
      setBatchShippingCost(savedData.batchShippingCost ?? 0);
      setBatchQuantity(savedData.batchQuantity ?? 0);
      setBatchAdditionalCosts(savedData.batchAdditionalCosts ?? []);

      setGlobalMultiplier(savedData.globalMultiplier ?? 1);

      setGrossSellingPrice(savedData.grossSellingPrice ?? 0);
      setPromotionalDiscount(savedData.promotionalDiscount ?? 0);
      setPlatformFeePercent(savedData.platformFeePercent ?? 15);
      setPaymentFeePercent(savedData.paymentFeePercent ?? 0);
      setInstallmentFeePercent(savedData.installmentFeePercent ?? 0);
      setTaxesAndRetentions(savedData.taxesAndRetentions ?? 0);
      setSellerShippingCost(savedData.sellerShippingCost ?? 0);

      setProjectedQuantity(savedData.projectedQuantity ?? 100);
    } catch (err) {
      // Fail silently but log for debugging
      // localStorage may be unavailable in some environments
      // or the stored JSON could be corrupted
      // eslint-disable-next-line no-console
      console.error("Failed to load calculadora data from localStorage", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  // useEffect para guardar el estado en localStorage cada vez que un dato relevante cambia.
  const persistData = useMemo(() => {
    return {
      calculationMode,
      unitProductCost,
      unitShippingCost,
      unitAdditionalCosts,
      batchTotalCost,
      batchShippingCost,
      batchQuantity,
      batchAdditionalCosts,
      globalMultiplier,
      grossSellingPrice,
      promotionalDiscount,
      platformFeePercent,
      paymentFeePercent,
      installmentFeePercent,
      taxesAndRetentions,
      sellerShippingCost,
      projectedQuantity,
    };
  }, [
    calculationMode,
    unitProductCost,
    unitShippingCost,
    unitAdditionalCosts,
    batchTotalCost,
    batchShippingCost,
    batchQuantity,
    batchAdditionalCosts,
    globalMultiplier,
    grossSellingPrice,
    promotionalDiscount,
    platformFeePercent,
    paymentFeePercent,
    installmentFeePercent,
    taxesAndRetentions,
    sellerShippingCost,
    projectedQuantity,
  ]);

  useEffect(() => {
    // Debounce el guardado para evitar sobrescribir datos que el usuario está escribiendo
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistData));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to save calculadora data to localStorage", err);
      }
    }, 500); // Esperar 500ms después de la última modificación

    return () => clearTimeout(timeoutId);
  }, [persistData]);

  // --- HANDLERS ---
  const handleNumericChange = (setter) =>
    useCallback(
      (value) => {
        setter(value >= 0 ? value : 0);
      },
      [setter]
    );

  const createCostHandlers = (state, setState) => ({
    add: useCallback(
      () =>
        setState((prev) => [...prev, { id: Date.now(), name: "", amount: 0 }]),
      [setState]
    ),
    update: useCallback(
      (id, field, value) => {
        setState((prev) =>
          prev.map((cost) =>
            cost.id === id ? { ...cost, [field]: value } : cost
          )
        );
      },
      [setState]
    ),
    remove: useCallback(
      (id) => setState((prev) => prev.filter((cost) => cost.id !== id)),
      [setState]
    ),
  });

  const unitCostHandlers = createCostHandlers(
    unitAdditionalCosts,
    setUnitAdditionalCosts
  );
  const batchCostHandlers = createCostHandlers(
    batchAdditionalCosts,
    setBatchAdditionalCosts
  );

  // --- TRANSFER DATA HANDLERS ---
  const handleAcceptTransferData = useCallback(() => {
    if (transferData) {
      // Mapeo de campos según las especificaciones:
      // FOB --> costo total del lote (batch mode)
      // cantidad de unidades --> cantidad de unidades (batch mode)
      // Costo Final Total Logístico (sin FOB) --> Costo de importación (del lote) (batch mode)
      // Precio Unitario --> Costo del producto (por unidad) (unit mode)
      // Costo Unitario Logístico Final (sin FOB) --> Costo de importación (por unidad) (unit mode)

      // Cambiar a modo batch y configurar valores
      setCalculationMode("batch");
      setBatchTotalCost(transferData.fob);
      setBatchQuantity(transferData.quantity);
      setBatchShippingCost(transferData.finalCost);

      // También configurar valores unitarios para referencia
      setUnitProductCost(transferData.unitPrice);
      setUnitShippingCost(transferData.finalUnitCost);

      // Actualizar proyección con la cantidad del lote
      setProjectedQuantity(transferData.quantity);

      // Limpiar datos de transferencia directamente
      setShowTransferMessage(false);
      setMessageTemporarilyHidden(false);
      setTransferData(null);

      // Limpiar localStorage y sessionStorage
      try {
        localStorage.removeItem("shippar:data-transfer");
        sessionStorage.removeItem("shippar:transfer-message-hidden");
      } catch (error) {
        console.error("Error limpiando datos de transferencia:", error);
      }
    }
  }, [transferData]);
  const handleRejectTransferData = useCallback(() => {
    // Limpiar datos de transferencia directamente
    setShowTransferMessage(false);
    setTransferData(null);
    setMessageTemporarilyHidden(false);

    // Limpiar localStorage y sessionStorage
    try {
      localStorage.removeItem("shippar:data-transfer");
      sessionStorage.removeItem("shippar:transfer-message-hidden");
    } catch (error) {
      console.error("Error limpiando datos de transferencia:", error);
    }
  }, []);

  const handleDismissTransferMessage = useCallback(() => {
    setShowTransferMessage(false);
    setMessageTemporarilyHidden(true);
    // Guardar en sessionStorage para recordar durante esta sesión
    try {
      sessionStorage.setItem("shippar:transfer-message-hidden", "true");
    } catch (error) {
      console.error("Error guardando estado de mensaje oculto:", error);
    }
  }, []);

  // --- MEMOIZED CALCULATIONS ---
  const { finalUnitCost, totalInvestment, totalAdditionalCosts } =
    useMemo(() => {
      let finalUnitCost = 0;
      let totalInvestment = 0;
      let totalAdditionalCosts = 0;

      if (calculationMode === "unit") {
        totalAdditionalCosts =
          PCalcs.calculateTotalAdditionalCosts(unitAdditionalCosts);
        finalUnitCost =
          unitProductCost + unitShippingCost + totalAdditionalCosts;
        totalInvestment = finalUnitCost * projectedQuantity;
      } else {
        // batch mode
        totalAdditionalCosts =
          PCalcs.calculateTotalAdditionalCosts(batchAdditionalCosts);
        const totalBaseCost =
          batchTotalCost + batchShippingCost + totalAdditionalCosts;
        finalUnitCost = PCalcs.calculateUnitCost(totalBaseCost, batchQuantity);
        totalInvestment = totalBaseCost;
      }
      return { finalUnitCost, totalInvestment, totalAdditionalCosts };
    }, [
      calculationMode,
      unitProductCost,
      unitShippingCost,
      unitAdditionalCosts,
      batchTotalCost,
      batchShippingCost,
      batchQuantity,
      batchAdditionalCosts,
      projectedQuantity,
    ]);

  const adjustedUnitCost = useMemo(
    () => finalUnitCost * (globalMultiplier > 0 ? globalMultiplier : 1),
    [finalUnitCost, globalMultiplier]
  );

  // Cálculos de Ventas
  // Precio de Venta Final después de Descuentos
  const finalSellingPrice = useMemo(() => {
    return grossSellingPrice * (1 - promotionalDiscount / 100);
  }, [grossSellingPrice, promotionalDiscount]);

  // Deducciones sobre el post-descuento
  const platformFeeAmount = useMemo(() => {
    return finalSellingPrice * (platformFeePercent / 100);
  }, [finalSellingPrice, platformFeePercent]);

  const paymentFeeAmount = useMemo(() => {
    return finalSellingPrice * (paymentFeePercent / 100);
  }, [finalSellingPrice, paymentFeePercent]);

  const installmentFeeAmount = useMemo(() => {
    return finalSellingPrice * (installmentFeePercent / 100);
  }, [finalSellingPrice, installmentFeePercent]);

  const taxesAmount = useMemo(() => {
    return finalSellingPrice * (taxesAndRetentions / 100);
  }, [finalSellingPrice, taxesAndRetentions]);

  const totalDeductions = useMemo(() => {
    return (
      platformFeeAmount +
      paymentFeeAmount +
      installmentFeeAmount +
      taxesAmount +
      sellerShippingCost
    );
  }, [
    platformFeeAmount,
    paymentFeeAmount,
    installmentFeeAmount,
    taxesAmount,
    sellerShippingCost,
  ]);

  const netIncomePerSale = useMemo(() => {
    return finalSellingPrice - totalDeductions;
  }, [finalSellingPrice, totalDeductions]);

  const netProfitPerSale = useMemo(() => {
    return netIncomePerSale - adjustedUnitCost;
  }, [netIncomePerSale, adjustedUnitCost]);

  // Métricas Clave
  const marginOnRevenue = useMemo(
    () => PCalcs.calculateMarginOnRevenue(netProfitPerSale, finalSellingPrice),
    [netProfitPerSale, finalSellingPrice]
  );
  const roi = useMemo(
    () => PCalcs.calculateRoi(netProfitPerSale, adjustedUnitCost),
    [netProfitPerSale, adjustedUnitCost]
  );
  const breakEvenPrice = useMemo(
    () =>
      PCalcs.calculateBreakEvenPrice(
        adjustedUnitCost,
        platformFeePercent,
        paymentFeePercent,
        installmentFeePercent
      ),
    [
      adjustedUnitCost,
      platformFeePercent,
      paymentFeePercent,
      installmentFeePercent,
    ]
  );

  // Inversión ajustada para las unidades proyectadas
  const adjustedInvestment = useMemo(() => {
    if (calculationMode === "unit") {
      // En modo unitario, la inversión es simplemente el costo unitario por la cantidad proyectada
      return adjustedUnitCost * projectedQuantity;
    } else {
      // En modo batch, calculamos la inversión proporcional
      return adjustedUnitCost * projectedQuantity;
    }
  }, [calculationMode, adjustedUnitCost, projectedQuantity]);

  // Proyecciones del Lote
  const projectedRevenue = useMemo(
    () =>
      PCalcs.calculateProjectedRevenue(finalSellingPrice, projectedQuantity),
    [finalSellingPrice, projectedQuantity]
  );
  const projectedNetIncome = useMemo(
    () =>
      PCalcs.calculateProjectedNetIncome(netIncomePerSale, projectedQuantity),
    [netIncomePerSale, projectedQuantity]
  );
  const projectedNetProfit = useMemo(
    () =>
      PCalcs.calculateProjectedNetProfit(netProfitPerSale, projectedQuantity),
    [netProfitPerSale, projectedQuantity]
  );

  const handleCopyAnalysis = useCallback(() => {
    const analysisData = {
      calculationMode,
      // Inputs - Costos
      unitProductCost,
      unitShippingCost,
      unitAdditionalCosts,
      batchTotalCost,
      batchShippingCost,
      batchQuantity,
      batchAdditionalCosts,
      globalMultiplier,
      // Inputs - Ventas
      grossSellingPrice,
      promotionalDiscount,
      platformFeePercent,
      paymentFeePercent,
      installmentFeePercent,
      taxesAndRetentions,
      sellerShippingCost,
      // Calculated - Ventas
      finalSellingPrice,
      platformFeeAmount,
      paymentFeeAmount,
      installmentFeeAmount,
      taxesAmount,
      totalDeductions,
      // Calculated - Costos y Rentabilidad
      totalInvestment,
      adjustedInvestment,
      finalUnitCost,
      adjustedUnitCost,
      netIncomePerSale,
      netProfitPerSale,
      marginOnRevenue,
      roi,
      breakEvenPrice,
      projectedRevenue,
      projectedNetIncome,
      projectedNetProfit,
      projectedQuantity,
    };
    const analysisText = formatProfitabilityAnalysis(analysisData);
    copy(analysisText);
  }, [
    calculationMode,
    unitProductCost,
    unitShippingCost,
    unitAdditionalCosts,
    batchTotalCost,
    batchShippingCost,
    batchQuantity,
    batchAdditionalCosts,
    globalMultiplier,
    grossSellingPrice,
    promotionalDiscount,
    platformFeePercent,
    paymentFeePercent,
    installmentFeePercent,
    taxesAndRetentions,
    sellerShippingCost,
    finalSellingPrice,
    platformFeeAmount,
    paymentFeeAmount,
    installmentFeeAmount,
    taxesAmount,
    totalDeductions,
    totalInvestment,
    adjustedInvestment,
    finalUnitCost,
    adjustedUnitCost,
    netIncomePerSale,
    netProfitPerSale,
    marginOnRevenue,
    roi,
    breakEvenPrice,
    projectedRevenue,
    projectedNetIncome,
    projectedNetProfit,
    projectedQuantity,
    copy,
  ]);

  return (
    <main className="ctz-main min-h-screen">
      <div className="max-w-7xl mx-auto">
        <CalculadoraHeader />

        {/* Transfer data mini-button */}
        {!showTransferMessage && transferData && messageTemporarilyHidden && (
          <div style={{ marginBottom: "12px" }}>
            <button
              onClick={() => {
                setShowTransferMessage(true);
                setMessageTemporarilyHidden(false);
                try { sessionStorage.removeItem("shippar:transfer-message-hidden"); }
                catch (e) { console.error(e); }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--ctz-accent)",
                background: "var(--ctz-accent-light)",
                border: "1px solid var(--ctz-accent-ring)",
                borderRadius: "var(--ctz-radius-sm)",
                cursor: "pointer",
                transition: "all 200ms",
              }}
            >
              <InfoIcon size={16} />
              Datos del cotizador disponibles
            </button>
          </div>
        )}

        {/* Transfer message */}
        {showTransferMessage && transferData && (
          <DataTransferMessage
            transferData={transferData}
            onAccept={handleAcceptTransferData}
            onReject={handleRejectTransferData}
            onDismiss={handleDismissTransferMessage}
          />
        )}

        {/* ═══ ROW 1: INPUTS ═══ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
          className="calc-inputs-grid"
        >
          <TotalCostsCard
            mode={calculationMode}
            onModeChange={setCalculationMode}
            unitProductCost={unitProductCost}
            onUnitProductCostChange={handleNumericChange(setUnitProductCost)}
            unitShippingCost={unitShippingCost}
            onUnitShippingCostChange={handleNumericChange(setUnitShippingCost)}
            unitAdditionalCosts={unitAdditionalCosts}
            onAddUnitAdditionalCost={unitCostHandlers.add}
            onRemoveUnitAdditionalCost={unitCostHandlers.remove}
            onUpdateUnitAdditionalCost={unitCostHandlers.update}
            batchTotalCost={batchTotalCost}
            onBatchTotalCostChange={handleNumericChange(setBatchTotalCost)}
            batchShippingCost={batchShippingCost}
            onBatchShippingCostChange={handleNumericChange(setBatchShippingCost)}
            batchQuantity={batchQuantity}
            onBatchQuantityChange={handleNumericChange(setBatchQuantity)}
            batchAdditionalCosts={batchAdditionalCosts}
            onAddBatchAdditionalCost={batchCostHandlers.add}
            onRemoveBatchAdditionalCost={batchCostHandlers.remove}
            onUpdateBatchAdditionalCost={batchCostHandlers.update}
            globalMultiplier={globalMultiplier}
            onGlobalMultiplierChange={handleNumericChange(setGlobalMultiplier)}
            finalUnitCost={finalUnitCost}
            adjustedUnitCost={adjustedUnitCost}
          />

          <SalesCard
            grossSellingPrice={grossSellingPrice}
            promotionalDiscount={promotionalDiscount}
            platformFeePercent={platformFeePercent}
            paymentFeePercent={paymentFeePercent}
            installmentFeePercent={installmentFeePercent}
            taxesAndRetentions={taxesAndRetentions}
            sellerShippingCost={sellerShippingCost}
            onGrossSellingPriceChange={handleNumericChange(setGrossSellingPrice)}
            onPromotionalDiscountChange={handleNumericChange(setPromotionalDiscount)}
            onPlatformFeeChange={handleNumericChange(setPlatformFeePercent)}
            onPaymentFeeChange={handleNumericChange(setPaymentFeePercent)}
            onInstallmentFeeChange={handleNumericChange(setInstallmentFeePercent)}
            onTaxesAndRetentionsChange={handleNumericChange(setTaxesAndRetentions)}
            onSellerShippingCostChange={handleNumericChange(setSellerShippingCost)}
            finalSellingPrice={finalSellingPrice}
            totalDeductions={totalDeductions}
            netIncomePerSale={netIncomePerSale}
          />
        </div>

        {/* ═══ ROW 2: RESULTS — 4 KPIs in one row ═══ */}
        <div style={{ marginTop: "20px" }}>
          {/* Section label */}
          <div style={{
            borderLeft: "3px solid var(--ctz-accent)",
            paddingLeft: "14px",
            paddingTop: "2px",
            paddingBottom: "2px",
            marginBottom: "16px",
          }}>
            <h2 style={{
              margin: 0,
              fontSize: "1.125rem",
              fontWeight: 800,
              color: "var(--ctz-text-primary)",
              letterSpacing: "-0.02em",
            }}>
              Resultados
            </h2>
            <p style={{
              margin: "2px 0 0",
              fontSize: "0.8125rem",
              color: "var(--ctz-text-secondary)",
            }}>
              Métricas clave de tu operación por unidad.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
            className="calc-kpi-grid"
          >
            <ResultCard
              label="Ganancia neta"
              value={formatCurrency(netProfitPerSale)}
              valueColor={netProfitPerSale >= 0 ? "var(--ctz-success)" : "var(--ctz-error)"}
              infoText="Ganancia por venta después de restar todos los costos y deducciones."
            />
            <ResultCard
              label="Margen"
              value={formatPercent(marginOnRevenue)}
              valueColor={marginOnRevenue >= 0 ? "var(--ctz-accent)" : "var(--ctz-error)"}
              infoText="Porcentaje de cada venta que queda como ganancia."
            />
            <ResultCard
              label="ROI"
              value={formatPercent(roi)}
              valueColor={roi >= 0 ? "var(--ctz-accent)" : "var(--ctz-error)"}
              infoText="Retorno sobre el costo invertido por unidad."
            />
            <BreakEvenPriceCard breakEvenPrice={breakEvenPrice} />
          </div>
        </div>

        {/* ═══ ROW 3: PROJECTION ═══ */}
        <div style={{ marginTop: "20px" }}>
          <VolumeAnalysisCard
            quantity={projectedQuantity}
            onQuantityChange={handleNumericChange(setProjectedQuantity)}
            netProfitPerSale={netProfitPerSale}
            projectedRevenue={projectedRevenue}
            unitSellingPrice={finalSellingPrice}
            projectedNetIncome={projectedNetIncome}
            unitNetIncome={netIncomePerSale}
            totalInvestment={adjustedInvestment}
            unitCost={finalUnitCost}
            projectedNetProfit={projectedNetProfit}
          />
        </div>

        {/* ═══ COPY BUTTON ═══ */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          paddingBottom: "20px",
        }}>
          <button
            onClick={handleCopyAnalysis}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#ffffff",
              background: "var(--ctz-accent-gradient)",
              border: "none",
              borderRadius: "var(--ctz-radius-sm)",
              cursor: "pointer",
              transition: "all 250ms ease-out",
              boxShadow: "var(--ctz-shadow-sm)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--ctz-shadow-md)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--ctz-shadow-sm)"; }}
          >
            <CopyIcon style={{ width: "15px", height: "15px" }} />
            {copied ? "Copiado ✓" : "Copiar análisis"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default CalculadoraApp;
