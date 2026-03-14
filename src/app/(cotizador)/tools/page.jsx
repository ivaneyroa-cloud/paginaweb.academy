"use client";

import { useState } from "react";
import Link from "next/link";
import { TbArrowRight, TbTruckDelivery, TbChevronDown } from "react-icons/tb";
import { IoCalculatorOutline } from "react-icons/io5";

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

/* ─── Main Page ─── */
export default function ToolsPage() {
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
        {/* ═══════ BLOQUE PRINCIPAL ═══════ */}
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
            Herramienta de cotización
          </div>

          {/* Title */}
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
            Cotizá tu importación
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
            Calculá el costo estimado de tu operación con tarifas generales y una base impositiva clara.
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
            Comenzar cotización
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
              Herramienta complementaria para estimar margen, costo por unidad y precio de venta.
            </span>
          </div>
        </section>

        {/* ═══════ BLOQUE DE CONFIANZA ═══════ */}
        <section style={{ marginBottom: "48px" }}>
          {/* Section header */}
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
              Sobre esta herramienta
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
              Qué vas a encontrar en este cotizador
            </h2>
          </div>

          {/* Trust grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Item 1: Cuenta preferencial */}
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
                    e.currentTarget.style.background = "var(--ctz-accent-light)";
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

            {/* Item 2: Tarifas generales */}
            <TrustItem
              number="2"
              title="Tarifas generales"
            >
              Las cotizaciones utilizan nuestras tarifas generales vigentes para que puedas obtener una referencia rápida, clara y realista.
            </TrustItem>

            {/* Item 3: Impuestos con criterio aduanero */}
            <TrustItem
              number="3"
              title="Impuestos calculados con criterio aduanero"
            >
              La parte impositiva suele generar dudas. Por eso la mostramos con una lógica clara y contemplando una base real de cálculo. No buscamos mostrar valores artificialmente bajos — preferimos darte una proyección más confiable y útil.
            </TrustItem>
          </div>
        </section>

        {/* ═══════ ACORDEÓN TÉCNICO ═══════ */}
        <section style={{ marginBottom: "48px" }}>
          <Accordion title="Cómo se calculan los impuestos">
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
      </div>
    </main>
  );
}