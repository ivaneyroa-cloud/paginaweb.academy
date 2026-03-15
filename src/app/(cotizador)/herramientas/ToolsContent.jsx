"use client";

import { useState } from "react";
import Link from "next/link";
import { TbArrowRight, TbTruckDelivery, TbChevronDown } from "react-icons/tb";
import { IoCalculatorOutline } from "react-icons/io5";
import { HiOutlineShieldCheck, HiOutlineCube, HiOutlineChartBar } from "react-icons/hi";

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
            {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
            {item.href ? (
              <Link href={item.href} style={{
                color: "var(--ctz-text-muted)", textDecoration: "none", transition: "color 200ms",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ctz-accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ctz-text-muted)"; }}
              >{item.label}</Link>
            ) : (
              <span style={{ color: "var(--ctz-text-secondary)", fontWeight: 500 }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ─── Tool Card ─── */
function ToolCard({ icon, title, description, features, href, cta, accent }) {
  const accentColor = accent || "var(--ctz-accent)";
  return (
    <article style={{
      background: "var(--ctz-bg-elevated)",
      border: "1px solid var(--ctz-border)",
      borderRadius: "var(--ctz-radius-lg)",
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      transition: "border-color 300ms ease-out, box-shadow 300ms ease-out, transform 300ms ease-out",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ctz-border-hover)";
        e.currentTarget.style.boxShadow = "var(--ctz-shadow-lg)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--ctz-border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Icon */}
      <div style={{
        width: "44px", height: "44px",
        borderRadius: "var(--ctz-radius-sm)",
        background: "var(--ctz-accent-light)",
        border: "1px solid var(--ctz-accent-ring)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: accentColor,
      }}>
        {icon}
      </div>

      {/* Title */}
      <h2 style={{
        fontSize: "1.25rem", fontWeight: 700,
        color: "var(--ctz-text-primary)",
        letterSpacing: "-0.02em", lineHeight: 1.25, margin: 0,
      }}>
        {title}
      </h2>

      {/* Description */}
      <p style={{
        fontSize: "0.9375rem", color: "var(--ctz-text-secondary)",
        lineHeight: 1.65, margin: 0,
      }}>
        {description}
      </p>

      {/* Feature list */}
      {features && (
        <ul style={{
          margin: 0, padding: "0 0 0 18px",
          fontSize: "0.875rem", color: "var(--ctz-text-secondary)",
          lineHeight: 1.8, listStyleType: "'→  '",
        }}>
          {features.map((f) => (
            <li key={f} style={{ paddingLeft: "4px" }}>{f}</li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link href={href} className="ctz-btn-primary" style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: "10px", padding: "12px 24px", marginTop: "auto",
        fontSize: "0.9375rem", fontWeight: 700,
        borderRadius: "var(--ctz-radius-sm)", textDecoration: "none",
        width: "100%",
      }}>
        {cta}
        <TbArrowRight size={18} />
      </Link>
    </article>
  );
}

/* ─── Accordion ─── */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--ctz-bg-elevated)",
      border: "1px solid var(--ctz-border)",
      borderRadius: "var(--ctz-radius-md)",
      overflow: "hidden",
      transition: "border-color 250ms ease-out",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "18px 24px",
        background: "transparent", border: "none", cursor: "pointer",
        color: "var(--ctz-text-primary)", fontSize: "0.9375rem",
        fontWeight: 600, letterSpacing: "-0.01em", textAlign: "left",
        transition: "color 200ms ease-out",
      }}>
        {title}
        <TbChevronDown size={18} style={{
          color: "var(--ctz-text-muted)", flexShrink: 0, marginLeft: "12px",
          transition: "transform 300ms ease-out",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }} />
      </button>
      <div style={{
        maxHeight: open ? "600px" : "0px",
        opacity: open ? 1 : 0, overflow: "hidden",
        transition: "max-height 400ms ease-out, opacity 300ms ease-out",
      }}>
        <div style={{
          padding: "0 24px 20px", color: "var(--ctz-text-secondary)",
          fontSize: "0.875rem", lineHeight: 1.7,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Differentiator ─── */
function DiffItem({ icon, title, children }) {
  return (
    <div style={{
      display: "flex", gap: "14px", alignItems: "flex-start",
    }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "var(--ctz-radius-sm)",
        background: "var(--ctz-accent-light)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--ctz-accent)", flexShrink: 0, marginTop: "2px",
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{
          fontSize: "0.9375rem", fontWeight: 700, margin: "0 0 4px",
          color: "var(--ctz-text-primary)", letterSpacing: "-0.01em",
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: "0.875rem", color: "var(--ctz-text-secondary)",
          lineHeight: 1.6, margin: 0,
        }}>
          {children}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Content — Hub SEO de Herramientas
   ═══════════════════════════════════════════════════════ */
export default function ToolsContent() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 16px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "48px", paddingBottom: "80px" }}>

        {/* ── Breadcrumbs ── */}
        <Breadcrumbs items={[
          { label: "Shippar", href: "/" },
          { label: "Herramientas" },
        ]} />

        {/* ═══════ HERO ═══════ */}
        <header style={{ textAlign: "center", marginBottom: "56px" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 14px", borderRadius: "var(--ctz-radius-pill)",
            background: "var(--ctz-accent-light)", color: "var(--ctz-accent)",
            fontSize: "0.75rem", fontWeight: 600,
            letterSpacing: "0.04em", textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "var(--ctz-accent)",
            }} />
            Herramientas gratuitas
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800, letterSpacing: "-0.03em",
            lineHeight: 1.1, color: "var(--ctz-text-primary)",
            margin: "0 0 16px",
          }}>
            Calculá tu importación y analizá rentabilidad
          </h1>

          {/* Subtitle — visible, crawlable, keyword-rich */}
          <p style={{
            fontSize: "1.0625rem", color: "var(--ctz-text-secondary)",
            lineHeight: 1.6, maxWidth: "600px", margin: "0 auto",
          }}>
            Dos herramientas pensadas para importadores que operan desde Argentina. Estimá costos reales con impuestos, aranceles y flete — y después calculá tu margen de ganancia por unidad.
          </p>
        </header>

        {/* ═══════ TOOL CARDS ═══════ */}
        <section style={{ marginBottom: "56px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "20px",
          }}>
            {/* Cotizador */}
            <ToolCard
              icon={<TbTruckDelivery size={22} />}
              title="Cotizador de Importación"
              description="Estimá el costo total de importar tu producto a Argentina. Incluye flete internacional, seguro, aranceles, IVA aduanero, tasa estadística y gastos de gestión."
              features={[
                "Cálculo automático de CIF",
                "Impuestos con criterio aduanero real",
                "Tarifas generales Shippar vigentes",
                "Desglose completo por concepto",
              ]}
              href="/cotizador-importacion"
              cta="Cotizar importación"
            />

            {/* Calculadora */}
            <ToolCard
              icon={<IoCalculatorOutline size={22} />}
              title="Calculadora de Rentabilidad"
              description="Analizá si tu importación es negocio. Ingresá costos, precio de venta y comisiones — y obtené ganancia neta, margen, ROI y punto de equilibrio por unidad."
              features={[
                "Ganancia neta por unidad",
                "Margen sobre ingresos y ROI",
                "Punto de equilibrio (precio mínimo)",
                "Proyección por volumen de ventas",
              ]}
              href="/calculadora-rentabilidad"
              cta="Calcular rentabilidad"
            />
          </div>
        </section>

        {/* ═══════ PARA QUIÉN ═══════ */}
        <section style={{ marginBottom: "56px" }}>
          <p style={{
            fontSize: "0.6875rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "var(--ctz-text-muted)", marginBottom: "6px",
          }}>
            Para quién son estas herramientas
          </p>
          <h2 style={{
            fontSize: "1.375rem", fontWeight: 700,
            letterSpacing: "-0.02em", color: "var(--ctz-text-primary)",
            margin: "0 0 12px",
          }}>
            Pensadas para importadores que toman decisiones con datos
          </h2>
          <p style={{
            fontSize: "0.9375rem", color: "var(--ctz-text-secondary)",
            lineHeight: 1.65, margin: "0 0 24px", maxWidth: "680px",
          }}>
            Si importás desde China, USA o Europa y vendés en Mercado Libre, Tienda Nube o tu propio canal, estas herramientas te dan los números que necesitás antes de comprar y antes de poner precio.
          </p>

          {/* Use cases — visible text */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}>
            {[
              { emoji: "📦", label: "Importadores de productos", detail: "Que compran en origen y revenden en Argentina" },
              { emoji: "🏪", label: "Vendedores en marketplaces", detail: "Que publican en ML, Amazon o Tienda Nube" },
              { emoji: "🏭", label: "Fabricantes y distribuidores", detail: "Que importan materia prima o componentes" },
              { emoji: "📊", label: "Operaciones de volumen", detail: "Que necesitan proyectar antes de invertir" },
            ].map((uc) => (
              <div key={uc.label} style={{
                padding: "16px 18px",
                background: "var(--ctz-bg-elevated)",
                border: "1px solid var(--ctz-border)",
                borderRadius: "var(--ctz-radius-sm)",
              }}>
                <span style={{ fontSize: "1.25rem", display: "block", marginBottom: "6px" }}>{uc.emoji}</span>
                <span style={{
                  display: "block", fontSize: "0.875rem", fontWeight: 600,
                  color: "var(--ctz-text-primary)", marginBottom: "2px",
                }}>{uc.label}</span>
                <span style={{
                  fontSize: "0.8125rem", color: "var(--ctz-text-muted)",
                }}>{uc.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ POR QUÉ SHIPPAR ═══════ */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{
            fontSize: "1.375rem", fontWeight: 700,
            letterSpacing: "-0.02em", color: "var(--ctz-text-primary)",
            margin: "0 0 20px",
          }}>
            Por qué usar las herramientas de Shippar
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <DiffItem icon={<HiOutlineShieldCheck size={18} />} title="Impuestos con criterio aduanero real">
              No usamos porcentajes genéricos. Calculamos sobre base CIF con la misma lógica que usa la aduana: derechos, tasa estadística, IVA aduanero y percepciones según corresponda.
            </DiffItem>
            <DiffItem icon={<HiOutlineCube size={18} />} title="Tarifas reales de operador logístico">
              Las cotizaciones reflejan tarifas generales vigentes de Shippar como freight forwarder y courier internacional. No son estimaciones sueltas — son precios de un operador real.
            </DiffItem>
            <DiffItem icon={<HiOutlineChartBar size={18} />} title="Análisis de rentabilidad integrado">
              El dato de costo de importación se puede transferir directo a la calculadora de rentabilidad. Un flujo continuo de cotizar → analizar → decidir.
            </DiffItem>
          </div>
        </section>

        {/* ═══════ CÓMO FUNCIONA ═══════ */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{
            fontSize: "1.375rem", fontWeight: 700,
            letterSpacing: "-0.02em", color: "var(--ctz-text-primary)",
            margin: "0 0 16px",
          }}>
            Cómo funciona
          </h2>
          <Accordion title="Cómo se calculan los impuestos de importación">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ margin: 0 }}>
                El valor CIF contempla el costo de la mercadería, el seguro y el flete internacional.
              </p>
              <p style={{ margin: 0 }}>
                Sobre esa base se calculan los derechos de importación (arancel según posición arancelaria), la tasa estadística, el IVA aduanero y las percepciones correspondientes.
              </p>
              <p style={{ margin: 0 }}>
                El resultado final depende de la información cargada, el tipo de producto y la estructura de la operación declarada.
              </p>
            </div>
          </Accordion>
        </section>

        {/* ═══════ LINKS INTERNOS ═══════ */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{
            fontSize: "1.375rem", fontWeight: 700,
            letterSpacing: "-0.02em", color: "var(--ctz-text-primary)",
            margin: "0 0 16px",
          }}>
            Servicios relacionados
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}>
            {[
              { label: "Courier Express", desc: "Envíos rápidos puerta a puerta", href: "/servicios/courier" },
              { label: "Carga Marítima", desc: "Fletes para volumen", href: "/servicios/maritima" },
              { label: "Sourcing", desc: "Te ayudamos a encontrar proveedores", href: "/servicios/sourcing" },
              { label: "Rastreo", desc: "Seguí tu envío en tiempo real", href: "/rastreo" },
            ].map((svc) => (
              <Link key={svc.href} href={svc.href} style={{
                display: "block", padding: "16px 18px",
                background: "var(--ctz-bg-elevated)",
                border: "1px solid var(--ctz-border)",
                borderRadius: "var(--ctz-radius-sm)",
                textDecoration: "none",
                transition: "border-color 200ms, background 200ms",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--ctz-border-hover)";
                  e.currentTarget.style.background = "var(--ctz-glass-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--ctz-border)";
                  e.currentTarget.style.background = "var(--ctz-bg-elevated)";
                }}
              >
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontSize: "0.875rem", fontWeight: 600, color: "var(--ctz-text-primary)",
                  marginBottom: "4px",
                }}>
                  {svc.label}
                  <TbArrowRight size={14} style={{ color: "var(--ctz-text-muted)" }} />
                </span>
                <span style={{
                  fontSize: "0.8125rem", color: "var(--ctz-text-muted)",
                }}>{svc.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════ FAQs ═══════ */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{
            fontSize: "1.375rem", fontWeight: 700,
            letterSpacing: "-0.02em", color: "var(--ctz-text-primary)",
            margin: "0 0 16px",
          }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Accordion title="¿Cómo calculo el costo total de una importación a Argentina?">
              <p style={{ margin: 0 }}>
                Con el <Link href="/cotizador-importacion" style={{ color: "var(--ctz-accent)", textDecoration: "none" }}>cotizador de Shippar</Link> podés estimar el costo completo. Seleccioná origen, destino, producto y cantidad. El sistema calcula automáticamente CIF, aranceles, IVA aduanero, tasa estadística, flete internacional y seguro.
              </p>
            </Accordion>

            <Accordion title="¿Qué impuestos se pagan al importar mercadería a Argentina?">
              <p style={{ margin: 0 }}>
                Los principales impuestos son: derechos de importación (arancel según posición arancelaria), tasa estadística, IVA aduanero (sobre base imponible que incluye CIF + derechos), IVA adicional y percepción de ganancias. El porcentaje varía según el tipo de producto y el régimen aplicable.
              </p>
            </Accordion>

            <Accordion title="¿Cuánto cuesta importar un producto desde China a Argentina?">
              <p style={{ margin: 0 }}>
                El costo depende del peso, volumen, valor del producto y modalidad de envío. Con el <Link href="/cotizador-importacion" style={{ color: "var(--ctz-accent)", textDecoration: "none" }}>cotizador de importación</Link> podés estimar el costo real en minutos ingresando los datos de tu producto. Incluye flete internacional, seguro, impuestos y tasas aduaneras.
              </p>
            </Accordion>

            <Accordion title="¿Cómo sé si mi importación es rentable?">
              <p style={{ margin: 0 }}>
                Usá la <Link href="/calculadora-rentabilidad" style={{ color: "var(--ctz-accent)", textDecoration: "none" }}>calculadora de rentabilidad</Link>. Ingresá el costo de producto + importación, tu precio de venta y las comisiones de tu canal. El sistema calcula tu ganancia neta, margen, ROI y punto de equilibrio por unidad.
              </p>
            </Accordion>

            <Accordion title="¿Las cotizaciones incluyen envío puerta a puerta?">
              <p style={{ margin: 0 }}>
                Las cotizaciones se basan en tarifas generales de Shippar que incluyen flete internacional y gestión. El alcance del servicio depende de la modalidad seleccionada. Para condiciones personalizadas, podés <Link href="/servicios/courier" style={{ color: "var(--ctz-accent)", textDecoration: "none" }}>consultar el servicio de courier express</Link> o solicitar una cuenta preferencial.
              </p>
            </Accordion>
          </div>
        </section>

      </div>
    </main>
  );
}
