"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRef } from "react";
import Link from "next/link";

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
    <main className="ctz-main min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ── Breadcrumbs ── */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "16px" }}>
          <ol style={{
            display: "flex", alignItems: "center", gap: "6px",
            listStyle: "none", margin: 0, padding: 0,
            fontSize: "0.8125rem", color: "var(--ctz-text-muted)",
          }}>
            <li><Link href="/" style={{ color: "var(--ctz-text-muted)", textDecoration: "none" }}>Shippar</Link></li>
            <li style={{ opacity: 0.5 }}>/</li>
            <li><Link href="/tools" style={{ color: "var(--ctz-text-muted)", textDecoration: "none" }}>Herramientas</Link></li>
            <li style={{ opacity: 0.5 }}>/</li>
            <li style={{ color: "var(--ctz-text-secondary)", fontWeight: 500 }}>Cotizador</li>
          </ol>
        </nav>

        {/* Header V2 */}
        <CotizadorHeaderV2 />

        {/* Acceso preferencial */}
        <div className="ctz-discount-card">
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
        <div className="ctz-inputs-section">
          <div className="ctz-inputs-grid grid grid-cols-1 lg:grid-cols-5">
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
        <div className="ctz-cta-zone" style={{ position: "relative" }} id="resultados-seccion">
          
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
                Calcular costos
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
                Actualización en tiempo real
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
              }}
              className="ctz-results-header"
            >
              <h2 style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--ctz-text-primary)",
                letterSpacing: "-0.02em",
              }}>
                Desglose de costos
              </h2>
              <p style={{
                margin: "4px 0 0",
                fontSize: "0.8125rem",
                color: "var(--ctz-text-secondary)",
              }}>
                Costos logísticos e impuestos estimados para tu operación.
              </p>
            </div>

            {/* Two-column layout: detail left, summary right sticky */}
            <div className="ctz-results-grid">
              {/* LEFT — Detail sections */}
              <div className="ctz-results-detail" style={{ display: "flex", flexDirection: "column" }}>
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

        {/* ═══════════════════════════════════════════ */}
        {/* CONTENIDO SEO VISIBLE (below the tool)     */}
        {/* ═══════════════════════════════════════════ */}

        {/* ── Cross-link to Calculadora ── */}
        <div style={{
          marginTop: "28px",
          background: "var(--ctz-bg-elevated)",
          border: "1px solid var(--ctz-border)",
          borderRadius: "var(--ctz-radius-md)",
          padding: "20px 24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, color: "var(--ctz-text-primary)" }}>
              ¿Ya tenés el costo? Calculá tu rentabilidad
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "var(--ctz-text-muted)" }}>
              Ingresá el costo de importación y estimá margen, ROI y punto de equilibrio.
            </p>
          </div>
          <Link href="/calculadora" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "9px 18px", fontSize: "0.8125rem", fontWeight: 600,
            color: "var(--ctz-accent)", background: "var(--ctz-accent-light)",
            border: "1px solid var(--ctz-accent-ring)",
            borderRadius: "var(--ctz-radius-sm)", textDecoration: "none",
            transition: "all 200ms ease-out",
          }}>
            Calculadora de rentabilidad →
          </Link>
        </div>

        {/* ── Qué calcula esta herramienta ── */}
        <section style={{ marginTop: "40px", marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "1.25rem", fontWeight: 700, color: "var(--ctz-text-primary)",
            letterSpacing: "-0.02em", margin: "0 0 12px",
          }}>
            Qué calcula este cotizador
          </h2>
          <p style={{
            fontSize: "0.9375rem", color: "var(--ctz-text-secondary)",
            lineHeight: 1.65, margin: "0 0 16px", maxWidth: "720px",
          }}>
            El cotizador estima el costo total de importar un producto a Argentina desde cualquier origen. Calcula el valor CIF, aplica impuestos con criterio aduanero real y suma el flete internacional con tarifas vigentes de Shippar.
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px",
          }}>
            {[
              "Valor FOB del producto",
              "Flete internacional y seguro",
              "Valor CIF calculado",
              "Derechos de importación (arancel)",
              "Tasa estadística",
              "IVA aduanero y percepciones",
              "Gastos de gestión aduanera",
              "Costo total de importación",
            ].map((item) => (
              <div key={item} style={{
                padding: "10px 14px", fontSize: "0.8125rem", fontWeight: 500,
                color: "var(--ctz-text-secondary)",
                background: "var(--ctz-bg-elevated)",
                border: "1px solid var(--ctz-border)",
                borderRadius: "var(--ctz-radius-sm)",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{ color: "var(--ctz-accent)", fontWeight: 700, fontSize: "0.75rem" }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* ── Glosario ── */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "1.25rem", fontWeight: 700, color: "var(--ctz-text-primary)",
            letterSpacing: "-0.02em", margin: "0 0 14px",
          }}>
            Conceptos clave de importación
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              {
                term: "FOB (Free On Board)",
                def: "Es el costo del producto puesto en el puerto o aeropuerto de origen. Incluye el precio de compra y los gastos hasta que la mercadería se carga en el transporte internacional. Es el dato que ingresás como punto de partida."
              },
              {
                term: "CIF (Cost, Insurance and Freight)",
                def: "Es el valor del producto puesto en destino, incluyendo flete y seguro. Se calcula como FOB + Flete + Seguro. Es la base imponible sobre la cual Aduana calcula los impuestos de importación en Argentina."
              },
              {
                term: "Peso facturable",
                def: "Es el mayor entre el peso real (bruto) y el peso volumétrico de la carga. El peso volumétrico se calcula a partir de las dimensiones de cada caja. Las líneas aéreas y couriers cobran por el que sea mayor, porque un paquete grande pero liviano igualmente ocupa espacio de bodega."
              },
              {
                term: "Derechos de importación",
                def: "Arancel que cobra la aduana según la posición arancelaria (NCM) del producto. Varía por tipo de mercadería — desde 0% para ciertos insumos hasta 35% para electrónica o indumentaria."
              },
            ].map((g) => (
              <div key={g.term} style={{
                padding: "16px 20px",
                background: "var(--ctz-bg-elevated)",
                border: "1px solid var(--ctz-border)",
                borderRadius: "var(--ctz-radius-md)",
              }}>
                <h3 style={{
                  fontSize: "0.9375rem", fontWeight: 700, margin: "0 0 4px",
                  color: "var(--ctz-text-primary)", letterSpacing: "-0.01em",
                }}>
                  {g.term}
                </h3>
                <p style={{
                  fontSize: "0.875rem", lineHeight: 1.65, margin: 0,
                  color: "var(--ctz-text-secondary)",
                }}>
                  {g.def}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Qué puede hacer variar el resultado ── */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "1.25rem", fontWeight: 700, color: "var(--ctz-text-primary)",
            letterSpacing: "-0.02em", margin: "0 0 12px",
          }}>
            Qué puede hacer variar el resultado
          </h2>
          <p style={{
            fontSize: "0.9375rem", color: "var(--ctz-text-secondary)",
            lineHeight: 1.65, margin: "0 0 12px", maxWidth: "720px",
          }}>
            Esta cotización es una estimación basada en tarifas generales vigentes y criterio aduanero real. El costo final de tu operación puede variar por:
          </p>
          <ul style={{
            margin: 0, padding: "0 0 0 18px", fontSize: "0.875rem",
            color: "var(--ctz-text-secondary)", lineHeight: 1.8,
            listStyleType: "'→  '",
          }}>
            <li>Posición arancelaria exacta del producto (NCM)</li>
            <li>Tipo de cambio vigente al momento del despacho</li>
            <li>Volumen o condiciones especiales de la operación</li>
            <li>Régimen de importación aplicable</li>
            <li>Gastos portuarios o terminales locales</li>
          </ul>
          <p style={{
            fontSize: "0.8125rem", color: "var(--ctz-text-muted)",
            marginTop: "12px", fontStyle: "italic",
          }}>
            Para una cotización comercial formal con condiciones personalizadas, podés solicitar una cuenta preferencial desde la herramienta.
          </p>
        </section>

        {/* ── Preguntas Frecuentes ── */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "1.25rem", fontWeight: 700, color: "var(--ctz-text-primary)",
            letterSpacing: "-0.02em", margin: "0 0 14px",
          }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              {
                q: "¿Qué es el valor FOB en una importación?",
                a: "FOB (Free On Board) es el costo del producto puesto en el puerto o aeropuerto de origen. Incluye el precio de compra y los gastos hasta que la mercadería se carga en el transporte internacional. Es el punto de partida de cualquier cotización.",
              },
              {
                q: "¿Qué es el valor CIF y cómo se calcula?",
                a: "CIF (Cost, Insurance and Freight) es el valor del producto puesto en destino. Se calcula como FOB + Flete + Seguro. Es la base sobre la cual se calculan los impuestos de importación en Argentina.",
              },
              {
                q: "¿Qué es el peso facturable?",
                a: "Es el mayor entre el peso real y el peso volumétrico. El volumétrico se calcula por las dimensiones de cada caja. Couriers y aerolíneas cobran por el que sea mayor, porque un paquete grande pero liviano ocupa espacio de bodega.",
              },
              {
                q: "¿Qué impuestos se pagan al importar a Argentina?",
                a: "Derechos de importación (arancel), tasa estadística, IVA aduanero, IVA adicional y percepción de ganancias. Los porcentajes dependen de la posición arancelaria del producto.",
              },
              {
                q: "¿La cotización es un precio final?",
                a: "Es una estimación con tarifas generales vigentes y criterio aduanero real. El costo final puede variar por posición arancelaria exacta, tipo de cambio y condiciones de la operación.",
              },
              {
                q: "¿Puedo usar el resultado para calcular mi precio de venta?",
                a: "Sí. El costo de importación se puede transferir directo a la calculadora de rentabilidad de Shippar para calcular margen, ROI y punto de equilibrio por unidad.",
              },
            ].map((faq) => (
              <details key={faq.q} style={{
                background: "var(--ctz-bg-elevated)",
                border: "1px solid var(--ctz-border)",
                borderRadius: "var(--ctz-radius-md)",
                overflow: "hidden",
              }}>
                <summary style={{
                  padding: "16px 20px", cursor: "pointer",
                  fontSize: "0.9375rem", fontWeight: 600,
                  color: "var(--ctz-text-primary)",
                  letterSpacing: "-0.01em", listStyle: "none",
                }}>
                  {faq.q}
                </summary>
                <div style={{
                  padding: "0 20px 16px", fontSize: "0.875rem",
                  lineHeight: 1.7, color: "var(--ctz-text-secondary)",
                }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Servicios relacionados ── */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{
            fontSize: "1.125rem", fontWeight: 700, color: "var(--ctz-text-primary)",
            letterSpacing: "-0.01em", margin: "0 0 14px",
          }}>
            Servicios relacionados
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px",
          }}>
            {[
              { label: "Courier Express", desc: "Envíos rápidos puerta a puerta", href: "/servicios/courier" },
              { label: "Carga Marítima", desc: "Fletes para volumen", href: "/servicios/maritima" },
              { label: "Sourcing", desc: "Encontrá proveedores confiables", href: "/servicios/sourcing" },
              { label: "Rastreo", desc: "Seguí tu envío en tiempo real", href: "/rastreo" },
            ].map((svc) => (
              <Link key={svc.href} href={svc.href} style={{
                display: "block", padding: "14px 16px",
                background: "var(--ctz-bg-elevated)",
                border: "1px solid var(--ctz-border)",
                borderRadius: "var(--ctz-radius-sm)",
                textDecoration: "none",
                transition: "border-color 200ms, background 200ms",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ctz-border)"; }}
              >
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontSize: "0.875rem", fontWeight: 600, color: "var(--ctz-text-primary)",
                  marginBottom: "2px",
                }}>
                  {svc.label}
                  <span style={{ color: "var(--ctz-text-muted)", fontSize: "0.75rem" }}>→</span>
                </span>
                <span style={{ fontSize: "0.8125rem", color: "var(--ctz-text-muted)" }}>{svc.desc}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
