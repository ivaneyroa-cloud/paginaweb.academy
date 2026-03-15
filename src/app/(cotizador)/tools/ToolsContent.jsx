"use client";

import { useState } from "react";
import Link from "next/link";
import { TbArrowRight, TbTruckDelivery, TbChevronDown } from "react-icons/tb";
import { IoCalculatorOutline } from "react-icons/io5";

/* ─── Breadcrumbs ─── */
function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "24px" }}>
      <ol style={{
        display: "flex", alignItems: "center", gap: "6px",
        listStyle: "none", margin: 0, padding: 0,
        fontSize: "0.8125rem", color: "var(--ctz-text-muted)",
      }}>
        {items.map((item, i) => (
          <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {i > 0 && <span style={{ color: "var(--ctz-text-muted)", opacity: 0.5 }}>/</span>}
            {item.href ? (
              <Link href={item.href} style={{
                color: "var(--ctz-text-muted)", textDecoration: "none",
                transition: "color 200ms",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ctz-accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ctz-text-muted)"; }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: "var(--ctz-text-secondary)", fontWeight: 500 }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ─── Accordion Component ─── */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "var(--ctz-bg-elevated)",
        border: "1px solid var(--ctz-border)",
        borderRadius: "var(--ctz-radius-md)",
        overflow: "hidden",
        transition: "border-color 250ms ease-out",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--ctz-text-primary)",
          fontSize: "0.9375rem",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          textAlign: "left",
          transition: "color 200ms ease-out",
        }}
      >
        {title}
        <TbChevronDown
          size={18}
          style={{
            color: "var(--ctz-text-muted)",
            transition: "transform 300ms ease-out",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
            marginLeft: "12px",
          }}
        />
      </button>

      <div
        style={{
          maxHeight: open ? "600px" : "0px",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 400ms ease-out, opacity 300ms ease-out",
        }}
      >
        <div
          style={{
            padding: "0 24px 20px",
            color: "var(--ctz-text-secondary)",
            fontSize: "0.875rem",
            lineHeight: 1.7,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Trust Item Component ─── */
function TrustItem({ number, title, children, cta }) {
  return (
    <div
      style={{
        background: "var(--ctz-bg-elevated)",
        border: "1px solid var(--ctz-border)",
        borderRadius: "var(--ctz-radius-md)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 250ms ease-out, box-shadow 250ms ease-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ctz-border-hover)";
        e.currentTarget.style.boxShadow = "var(--ctz-shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--ctz-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Number badge */}
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "var(--ctz-accent-light)",
          color: "var(--ctz-accent)",
          fontSize: "0.75rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {number}
      </div>

      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--ctz-text-primary)",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--ctz-text-secondary)",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {children}
      </p>

      {cta && (
        <div style={{ marginTop: "4px" }}>
          {cta}
        </div>
      )}
    </div>
  );
}

/* ─── Main Content ─── */
export default function ToolsContent() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          paddingTop: "48px",
          paddingBottom: "80px",
        }}
      >
        {/* ── Breadcrumbs ── */}
        <Breadcrumbs items={[
          { label: "Shippar", href: "/" },
          { label: "Herramientas" },
        ]} />

        {/* ═══════ HERO ═══════ */}
        <section
          style={{
            textAlign: "center",
            marginBottom: "64px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              borderRadius: "var(--ctz-radius-pill)",
              background: "var(--ctz-accent-light)",
              color: "var(--ctz-accent)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--ctz-accent)",
              }}
            />
            Herramientas gratuitas
          </div>

          {/* H1 */}
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--ctz-text-primary)",
              margin: "0 0 16px",
            }}
          >
            Herramientas para importadores
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--ctz-text-secondary)",
              lineHeight: 1.6,
              maxWidth: "540px",
              margin: "0 auto 36px",
            }}
          >
            Estimá el costo total de tu importación y analizá la rentabilidad por unidad antes de comprar.
          </p>

          {/* Primary CTA */}
          <Link
            href="/cotizadorv2"
            className="ctz-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 32px",
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: "var(--ctz-radius-sm)",
              textDecoration: "none",
              marginBottom: "20px",
            }}
          >
            <TbTruckDelivery size={20} />
            Cotizar importación
            <TbArrowRight size={18} />
          </Link>

          {/* Secondary link */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Link
              href="/calculadora"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--ctz-text-secondary)",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "var(--ctz-radius-sm)",
                transition: "color 200ms ease-out, background 200ms ease-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--ctz-accent)";
                e.currentTarget.style.background = "var(--ctz-accent-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ctz-text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <IoCalculatorOutline size={16} />
              Calculadora de rentabilidad
              <TbArrowRight size={14} />
            </Link>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--ctz-text-muted)",
                maxWidth: "380px",
              }}
            >
              Estimá margen, ROI y punto de equilibrio al importar y revender.
            </span>
          </div>
        </section>

        {/* ═══════ CONFIANZA ═══════ */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--ctz-text-muted)",
                marginBottom: "6px",
              }}
            >
              Sobre estas herramientas
            </p>
            <h2
              style={{
                fontSize: "1.375rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--ctz-text-primary)",
                margin: 0,
              }}
            >
              Qué vas a encontrar en el cotizador
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            <TrustItem
              number="1"
              title="Cuenta preferencial para importadores frecuentes"
              cta={
                <button
                  onClick={() => {}}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--ctz-accent)",
                    background: "var(--ctz-accent-light)",
                    border: "1px solid transparent",
                    borderRadius: "var(--ctz-radius-sm)",
                    cursor: "pointer",
                    transition: "all 200ms ease-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--ctz-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  Solicitar cuenta preferencial
                  <TbArrowRight size={14} />
                </button>
              }
            >
              Si ya importás con frecuencia o manejás volumen, podés solicitar una cuenta preferencial con condiciones comerciales personalizadas para tu operación.
            </TrustItem>

            <TrustItem number="2" title="Tarifas generales">
              Las cotizaciones utilizan nuestras tarifas generales vigentes para que puedas obtener una referencia rápida, clara y realista.
            </TrustItem>

            <TrustItem number="3" title="Impuestos calculados con criterio aduanero">
              La parte impositiva suele generar dudas. Por eso la mostramos con una lógica clara y contemplando una base real de cálculo. No buscamos mostrar valores artificialmente bajos — preferimos darte una proyección más confiable y útil.
            </TrustItem>
          </div>
        </section>

        {/* ═══════ CÓMO FUNCIONA ═══════ */}
        <section style={{ marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--ctz-text-primary)",
              margin: "0 0 16px",
            }}
          >
            Cómo funciona
          </h2>
          <Accordion title="Cómo se calculan los impuestos de importación">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ margin: 0 }}>
                El valor CIF contempla el costo de la mercadería, el seguro y el flete.
              </p>
              <p style={{ margin: 0 }}>
                Sobre esa base se calculan distintos conceptos impositivos según el régimen aplicable y el tipo de operación.
              </p>
              <p style={{ margin: 0 }}>
                El IVA aduanero puede estimarse sobre la base imponible correspondiente, que incluye el valor de la mercadería y otros conceptos aduaneros según cada caso.
              </p>
              <p style={{ margin: 0 }}>
                El resultado final depende de la información cargada, el tipo de producto y la estructura de la operación declarada.
              </p>
            </div>
          </Accordion>
        </section>

        {/* ═══════ FAQs ═══════ */}
        <section style={{ marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--ctz-text-primary)",
              margin: "0 0 16px",
            }}
          >
            Preguntas frecuentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Accordion title="¿Cómo calculo el costo total de una importación a Argentina?">
              <p style={{ margin: 0 }}>
                Con el cotizador de Shippar podés estimar el costo completo de tu importación. Seleccioná origen, destino, producto y cantidad. El sistema calcula automáticamente CIF, aranceles, IVA aduanero, tasa estadística, flete internacional y seguro.
              </p>
            </Accordion>

            <Accordion title="¿Qué impuestos se pagan al importar mercadería a Argentina?">
              <p style={{ margin: 0 }}>
                Los principales impuestos son: derechos de importación (arancel según posición arancelaria), tasa estadística, IVA aduanero (sobre base imponible que incluye CIF + derechos), IVA adicional y percepción de ganancias. El porcentaje varía según el tipo de producto y el régimen aplicable.
              </p>
            </Accordion>

            <Accordion title="¿Cuánto cuesta importar un producto desde China a Argentina?">
              <p style={{ margin: 0 }}>
                El costo depende del peso, volumen, valor del producto y modalidad de envío. Con el <Link href="/cotizadorv2" style={{ color: "var(--ctz-accent)", textDecoration: "none" }}>cotizador de Shippar</Link> podés estimar el costo real en minutos ingresando los datos de tu producto. Incluye flete internacional, seguro, impuestos y tasas aduaneras.
              </p>
            </Accordion>

            <Accordion title="¿Cómo sé si mi importación es rentable?">
              <p style={{ margin: 0 }}>
                Usá la <Link href="/calculadora" style={{ color: "var(--ctz-accent)", textDecoration: "none" }}>calculadora de rentabilidad</Link>. Ingresá el costo de producto + importación, tu precio de venta y las comisiones de tu canal. El sistema calcula tu ganancia neta, margen, ROI y punto de equilibrio por unidad.
              </p>
            </Accordion>

            <Accordion title="¿Las cotizaciones incluyen envío puerta a puerta?">
              <p style={{ margin: 0 }}>
                Las cotizaciones se basan en tarifas generales de Shippar que incluyen flete internacional y gestión. El alcance del servicio (puerta a puerta, puerto a puerta, etc.) depende de la modalidad seleccionada. Para condiciones personalizadas, podés solicitar una cuenta preferencial.
              </p>
            </Accordion>
          </div>
        </section>
      </div>
    </main>
  );
}
