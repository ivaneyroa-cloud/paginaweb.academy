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
import { SummaryCardV2 } from "./components/SummaryCardV2";
import { ShippingCostsCardV2 } from "./components/ShippingCostsCardV2";
import { DiscountCardV2 } from "./components/DiscountCardV2";

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
        <div className="relative my-8" id="resultados-seccion">
          
          {/* Línea separadora de fondo (Siempre visible para estructurar la página) */}
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-dashed border-slate-300"></div>
          </div>
          
          {/* Contenedor central dinámico */}
          <div className="relative flex justify-center">
            {!mostrarResultados ? (
          // ESTADO 1: Botón principal de Cotizar (Estilo Sólido Oscuro Premium)
              <button
                type="button"
                onClick={handleCotizar}
                // Usamos bg-sky-600 (azul sólido) y text-white.
                className="group cursor-pointer flex items-center gap-4 pl-8 pr-2 py-2 text-[17px] font-bold text-white bg-sky-600 border border-transparent rounded-full shadow-md hover:shadow-lg hover:bg-sky-700 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="tracking-tight">Cotizar Importación</span>
                
                {/* Ícono de ancla visual (Círculo un tono más oscuro) */}
                {/* Usamos bg-sky-700 para generar profundidad dentro del botón */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-700 text-white transition-colors duration-300 group-hover:bg-sky-800">
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ) : (
              // ESTADO 2: Badge indicando que el formulario ahora reacciona en vivo
              <span className="bg-slate-50 px-6 py-2 rounded-full text-sm font-semibold text-sky-700 shadow-sm border border-slate-200 flex items-center gap-2 animate-fade-in">
                {/* Ícono de rayo en SVG */}
                <svg 
                  className="w-4 h-4 text-sky-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
                Cálculos Automáticos
              </span>
            )}
          </div>
          
        </div>


{/* =========================== */}
        {/* SECCIÓN 2: RESULTADOS       */}
        {/* =========================== */}
        {mostrarResultados && (
          <div className="animate-fade-in space-y-8" id="resultados-seccion">
            
            {/* Encabezado de la Sección de Resultados */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-l-4 border-sky-500 pl-4 py-1">
              <h2 className="text-2xl font-extrabold text-slate-800">
                Resultados de la Cotización
              </h2>
              <p className="text-sm text-slate-700 mt-1">
                Desglose detallado de costos logísticos y tasas aduaneras estimadas.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Bloque 1: Envío Internacional (Logística Shippar) */}
              <div className="w-full">
                <ShippingCostsCardV2
                  pesoComputableTotal={pesoComputableTotal}
                  cantidadCajas={cajas.length}
                  envioInfo={envioInfo}
                  tipoEnvio={tipoEnvio}
                  setTipoEnvio={setTipoEnvio}
                />
              </div>

              {/* Bloque 2: Impuestos y Tasas (Costo Aduanero) */}
              <div className="w-full">
                <ImpuestosTasasCardV2
                  categoriaSeleccionada={categoriaSeleccionada}
                  valorCif={valorCif}
                  impuestos={impuestos}
                  totalImpuestos={totalImpuestos}
                  gastoDocumental={gastoDocumental}
                />
              </div>

              {/* Bloque 3: Resumen Final (Visión 360 de la operación) */}
              <div className="w-full mt-2">
                <SummaryCardV2
                  valorFob={valorFob}
                  impuestos={impuestos}
                  totalImpuestos={totalImpuestos}
                  gastoDocumental={gastoDocumental}
                  costoImportacion={costoImportacionSeleccionado}
                  costoFinalTotal={costoFinalTotalSeleccionado}
                  categoriaSeleccionada={categoriaSeleccionada}
                  cajas={cajas}
                  pesoComputableTotal={pesoComputableTotal}
                  envioInfo={envioInfo}
                  tipoEnvio={tipoEnvio}
                  codigoDescuento={codigoDescuento}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
