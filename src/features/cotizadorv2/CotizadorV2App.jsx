"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRef } from "react";

// Constantes
import { INITIAL_BOXES } from "./constants";

// Cálculos V2
import * as CalcsV2 from "./lib/calculationsV2";

// Validación
import { cotizadorSchema } from "./schemas/cotizador.schema";

// Componentes V2
import CotizadorHeaderV2 from "./components/CotizadorHeaderV2";
import { BoxesCardV2 } from "./components/BoxesCardV2";
import { ProductCardV2 } from "./components/ProductCardV2";
import { ImpuestosTasasCardV2 } from "./components/ImpuestosTasasCardV2";
import { ShippingCostsCardV2 } from "./components/ShippingCostsCardV2";
import { DiscountCardV2 } from "./components/DiscountCardV2";
import { ExecutiveSummary } from "./components/ExecutiveSummary";

// UI Compartida
import { Button } from "@/shared/components/ui/Button";

// Hooks
import { useClipboard } from "@/shared/hooks/useClipboard";

// --- Lógica de Persistencia de Datos ---
const STORAGE_KEY = "importCalculatorStateV2";

/**
 * CotizadorV2App - Nueva versión del cotizador con cálculo en cascada
 * @param {Object} props - Props del componente
 * @param {Object} props.datosCotizacion - Objeto devuelto por getDatosCotizacion con configs, tarifas y categorias.
 * @returns {React.ReactElement}
 */
export default function CotizadorV2App({ datosCotizacion }) {
  // Configs del servidor (fallbacks por seguridad si venían vacías)
  const categorias = datosCotizacion?.categorias || [];
  const configuraciones = datosCotizacion?.configuraciones || {};
  const tarifasInternacionales = datosCotizacion?.tarifasInternacionales || [];
  const tarifasPublicas = datosCotizacion?.tarifasPublicas || [];

  // Hook de clipboard
  const { copy, copied } = useClipboard();

  // Estado para controlar si ya se cargaron los datos iniciales
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  // Estados base con nomenclatura en español
  const [valorFob, setValorFob] = useState(0);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]);
  const [cajas, setCajas] = useState(INITIAL_BOXES);

  // Estado de tipo de envío seleccionado
  const [tipoEnvio, setTipoEnvio] = useState("standard"); // "standard" o "express"

  // Estado para controlar si se muestran los resultados
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState({ producto: {}, cajas: {} });
  const [intentoCotizar, setIntentoCotizar] = useState(false);

  // Estado para el descuento de envío validado desde DB
  const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
  const [codigoDescuento, setCodigoDescuento] = useState("");
  const discountCardRef = useRef(null); // Ref para forzar validación de cupón pendiente

  // Establecer categoría por defecto cuando las categorías estén disponibles
  useEffect(() => {
    if (categorias.length > 0 && !categoriaSeleccionada) {
      setCategoriaSeleccionada(categorias[0]);
    }
  }, [categorias, categoriaSeleccionada]);

  // Hidratar estado desde localStorage cuando el cliente monta
  useEffect(() => {
    const loadData = () => {
      try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        console.log(
          "CotizadorV2: Intentando cargar datos del localStorage:",
          serializedState ? "datos encontrados" : "no hay datos"
        );

        if (!serializedState) {
          setIsInitialDataLoaded(true);
          return;
        }
        const saved = JSON.parse(serializedState);

        if (typeof saved.valorFob === "number") setValorFob(saved.valorFob);

        if (saved.categoriaNombre) {
          const found = categorias.find((c) => c.nombre === saved.categoriaNombre);
          if (found) setCategoriaSeleccionada(found);
        }

        if (Array.isArray(saved.cajas)) setCajas(saved.cajas);

        console.log("CotizadorV2: Datos cargados exitosamente");
      } catch (error) {
        console.error(
          "No se pudo hidratar el estado desde localStorage:",
          error
        );
      }

      setIsInitialDataLoaded(true);
    };

    loadData();
    const timeoutId = setTimeout(loadData, 100);

    const handleFocus = () => {
      console.log("CotizadorV2: Ventana enfocada, recargando datos...");
      loadData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [categorias]);

  // Guardar en localStorage
  useEffect(() => {
    if (!isInitialDataLoaded) {
      console.log("CotizadorV2: Saltando guardado - carga inicial no completada");
      return;
    }

    try {
      const stateToSave = {
        valorFob,
        categoriaNombre: categoriaSeleccionada.nombre,
        cajas,
      };
      const serializedState = JSON.stringify(stateToSave);
      localStorage.setItem(STORAGE_KEY, serializedState);
      console.log("CotizadorV2: Datos guardados en localStorage:", stateToSave);
    } catch (error) {
      console.error("No se pudo guardar el estado en localStorage:", error);
    }
  }, [isInitialDataLoaded, valorFob, categoriaSeleccionada, cajas]);

  // --- CÁLCULOS PRINCIPAL CON PATRÓN FACTORY ---
  
  // Ejecutamos todo el motor matemático reactivo en la función central
  const resultadoCotizacion = useMemo(() => {
    return CalcsV2.calcularCotizacionCompleta({
      precioUnitario: 0, // No usamos PU x Cantidad en esta V2, el usuario entra FOB directo
      cantidad: 1,       // Fijo a 1
      valorFob,
      cajas,
      categoria: categoriaSeleccionada,
      porcentajeDescuento,
      configuraciones,
      tarifasPublicas,
      tarifasInternacionales
    });
  }, [
    valorFob, 
    cajas, 
    categoriaSeleccionada, 
    porcentajeDescuento, 
    configuraciones, 
    tarifasPublicas, 
    tarifasInternacionales
  ]);

  // Extraemos variables clave para la UI
  const { 
    pesoComputableTotal, 
    envio: envioInfo,
    impuestos, 
    totalImpuestos, 
    gastoDocumental, 
    valorCif,
    costosFinales
  } = resultadoCotizacion;

  // Extraer valores dinámicos según el tipo de envío elegido
  const costoImportacionSeleccionado = costosFinales[tipoEnvio].importacion;
  const costoFinalTotalSeleccionado = costosFinales[tipoEnvio].total;

  // --- HANDLERS ---
  const handleFobChange = useCallback((value) => {
    setValorFob(value >= 0 ? value : 0);
  }, []);

  const handleCajasChange = useCallback((updatedCajas) => {
    setCajas(updatedCajas);
  }, []);

  const handleCategoriaChange = useCallback((categoriaNombre) => {
    const categoria =
      categorias.find((c) => c.nombre === categoriaNombre) || categorias[0];
    setCategoriaSeleccionada(categoria);
  }, [categorias]);

  // Función para validar y cotizar
  const handleCotizar = useCallback(async () => {
    setIntentoCotizar(true);

    // 1. Validar cupón pendiente si hay algo escrito y no aplicado
    if (discountCardRef.current) {
      const cuponValido = await discountCardRef.current.validarPendiente();
      if (!cuponValido) {
        // Falló validación de cupón, no avanzamos con la cotización
        setMostrarResultados(false);
        // Scrolleamos a la zona del descuento suavemente
        setTimeout(() => {
          const discountCard = document.querySelector(".border-red-400"); // el input se pone rojo o buscamos la card
          if (discountCard) {
            discountCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
        return;
      }
    }
    
    // Preparar datos para validación
    const datosFormulario = {
      categoria: categoriaSeleccionada.nombre,
      fob: valorFob,
      cajas: cajas.map(caja => ({
        id: caja.id,
        peso: caja.weight,
        length: caja.length,
        width: caja.width,
        height: caja.height,
      })),
    };

    console.log("Datos a validar:", datosFormulario);

    // Validar con Zod
    const resultado = cotizadorSchema.safeParse(datosFormulario);

    console.log("Resultado de validación:", resultado);

    if (resultado.success) {
      // Validación exitosa - mostrar resultados
      setMostrarResultados(true);
      setErroresValidacion({ producto: {}, cajas: {} });
      console.log("✅ Validación exitosa:", resultado.data);
      
      // Scroll suave hacia los resultados
      setTimeout(() => {
        const resultadosElement = document.getElementById("resultados-seccion");
        if (resultadosElement) {
          resultadosElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // Validación fallida - organizar errores para componentes
      setMostrarResultados(false);
      const erroresOrganizados = {
        producto: {}, // errores de ProductCardV2 (fob, categoria)
        cajas: {}, // errores de BoxesCardV2 organizados por índice
      };
      
      console.log("Error completo de Zod:", resultado.error);
      console.log("Errores individuales de Zod:", resultado.error?.issues);
      
      // Verificar que exista el array de errores antes de procesarlo
      if (resultado.error && resultado.error.issues && Array.isArray(resultado.error.issues)) {
        resultado.error.issues.forEach((error) => {
          console.log("  Procesando error:", { path: error.path, message: error.message });
          
          if (error.path[0] === "fob") {
            erroresOrganizados.producto.fob = error.message;
          } else if (error.path[0] === "categoria") {
            erroresOrganizados.producto.categoria = error.message;
          } else if (error.path[0] === "cajas") {
            if (error.path.length > 1) {
              // Error en una caja específica
              const indiceCaja = error.path[1];
              const campo = error.path[2];
              
              console.log(`    -> Caja ${indiceCaja}, campo: ${campo}, mensaje: ${error.message}`);
              
              if (!erroresOrganizados.cajas[indiceCaja]) {
                erroresOrganizados.cajas[indiceCaja] = {};
              }
              
              erroresOrganizados.cajas[indiceCaja][campo] = error.message;
            }
          }
        });
      }
      
      setErroresValidacion(erroresOrganizados);
      console.log("⚠️ Errores de validación encontrados:", erroresOrganizados);
      console.log("Total de errores en producto:", Object.keys(erroresOrganizados.producto).length);
      console.log("Total de cajas con errores:", Object.keys(erroresOrganizados.cajas).length);
      
      // Scroll al primer input con error
      setTimeout(() => {
        const primerInput = document.querySelector(".border-red-400");
        if (primerInput) {
          primerInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [categoriaSeleccionada, valorFob, cajas]);

  // Validar que haya categorías disponibles
  if (!categorias || categorias.length === 0) {
    return (
      <main className="min-h-screen p-4 py-14 lg:py-18">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">
              No se pudieron cargar las categorías. Por favor, recarga la página.
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Si el problema persiste, contacta con soporte.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Validar que haya una categoría seleccionada
  if (!categoriaSeleccionada) {
    return (
      <main className="min-h-screen p-4 py-14 lg:py-18">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800 font-medium">
              Cargando categorías...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 py-14 lg:py-18">
      <div className="max-w-7xl mx-auto">
        {/* Header V2 */}
        <CotizadorHeaderV2 />

        {/* Acceso preferencial — above inputs */}
        <div style={{ marginBottom: '16px' }}>
          <DiscountCardV2
            ref={discountCardRef}
            porcentajeDescuento={porcentajeDescuento}
            codigoDescuento={codigoDescuento}
            onDescuentoChange={setPorcentajeDescuento}
            onCodigoChange={setCodigoDescuento}
          />
        </div>

        {/* =========================== */}
        {/* SECCIÓN 1: INPUTS           */}
        {/* =========================== */}
        <div className="mb-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Paso 1: Información del Producto (2/5 del ancho) */}
            <div className="lg:col-span-2">
              <ProductCardV2
                categories={categorias}
                categoriaSeleccionada={categoriaSeleccionada}
                valorFob={valorFob}
                onCategoriaChange={handleCategoriaChange}
                onFobChange={handleFobChange}
                errores={erroresValidacion.producto || {}}
              />
            </div>

            {/* Paso 2: Dimensiones y Peso (3/5 del ancho) */}
            <div className="lg:col-span-3">
              <BoxesCardV2 
                boxes={cajas} 
                onBoxesChange={handleCajasChange}
                erroresCajas={erroresValidacion.cajas || {}}
              />
            </div>
          </div>
        </div>
        {/* =========================== */}
        {/* ZONA DE ACCIÓN Y TRANSICIÓN */}
        {/* =========================== */}
        <div style={{ position: "relative", margin: "32px 0" }} id="resultados-seccion">
          
          {/* Divider line */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }} aria-hidden="true">
            <div style={{ width: "100%", borderTop: "1px solid var(--ctz-border)" }} />
          </div>
          
          {/* CTA / Badge */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            {!mostrarResultados ? (
              <button
                type="button"
                onClick={handleCotizar}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 28px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  background: "var(--ctz-accent-gradient)",
                  border: "none",
                  borderRadius: "var(--ctz-radius-pill)",
                  cursor: "pointer",
                  transition: "all 250ms ease-out",
                  boxShadow: "var(--ctz-shadow-md)",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--ctz-shadow-lg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--ctz-shadow-md)"; }}
              >
                Cotizar Importación
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 16px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--ctz-accent)",
                  background: "var(--ctz-bg-elevated)",
                  border: "1px solid var(--ctz-border)",
                  borderRadius: "var(--ctz-radius-pill)",
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Cálculos en tiempo real
              </span>
            )}
          </div>
        </div>


{/* =========================== */}
        {/* SECCIÓN 2: RESULTADOS       */}
        {/* =========================== */}
        {mostrarResultados && (
          <div style={{ animation: 'ctz-fade-in 300ms ease-out' }} id="resultados-seccion">
            
            {/* Section header */}
            <div
              style={{
                borderLeft: "3px solid var(--ctz-accent)",
                paddingLeft: "14px",
                paddingTop: "2px",
                paddingBottom: "2px",
                marginBottom: "24px",
              }}
            >
              <h2 style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--ctz-text-primary)",
                letterSpacing: "-0.02em",
              }}>
                Resultados de la Cotización
              </h2>
              <p style={{
                margin: "4px 0 0",
                fontSize: "0.8125rem",
                color: "var(--ctz-text-secondary)",
              }}>
                Desglose detallado de costos logísticos y tasas aduaneras estimadas.
              </p>
            </div>

            {/* Two-column layout: detail left, summary right sticky */}
            <div className="ctz-results-grid">
              {/* LEFT — Detail sections */}
              <div className="ctz-results-detail" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Shipping method selection */}
                <ShippingCostsCardV2
                  pesoComputableTotal={pesoComputableTotal}
                  cantidadCajas={cajas.length}
                  envioInfo={envioInfo}
                  tipoEnvio={tipoEnvio}
                  setTipoEnvio={setTipoEnvio}
                />

                {/* Divider */}
                <div style={{ height: '1px', background: 'var(--ctz-border)' }} />

                {/* Tax breakdown */}
                <ImpuestosTasasCardV2
                  categoriaSeleccionada={categoriaSeleccionada}
                  valorCif={valorCif}
                  impuestos={impuestos}
                  totalImpuestos={totalImpuestos}
                  gastoDocumental={gastoDocumental}
                />
              </div>

              {/* RIGHT — Executive summary (sticky) */}
              <div className="ctz-results-summary">
                <ExecutiveSummary
                  valorFob={valorFob}
                  costoEnvio={envioInfo[tipoEnvio]}
                  totalImpuestos={totalImpuestos}
                  gastoDocumental={gastoDocumental}
                  costoImportacion={costoImportacionSeleccionado}
                  costoFinalTotal={costoFinalTotalSeleccionado}
                  tipoEnvio={tipoEnvio}
                  aplicoDescuento={envioInfo.aplicoDescuento}
                  codigoDescuento={codigoDescuento}
                  categoriaSeleccionada={categoriaSeleccionada}
                  pesoComputableTotal={pesoComputableTotal}
                  cantidadCajas={cajas.length}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
