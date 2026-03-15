import Link from "next/link";
import { TbTruckDelivery, TbChartBar, TbShip } from "react-icons/tb";
import { HiOutlineDocumentText } from "react-icons/hi";
import { getPublishedBlogPosts } from "@/features/admin/blog/actions";

export const metadata = {
  title: "Blog de Importación: Guías, Costos y Rentabilidad | Shippar",
  description:
    "Guías prácticas para importar a Argentina. Aprende sobre costos, impuestos, modalidades de envío y cómo calcular la rentabilidad de tu importación.",
  openGraph: {
    title: "Blog de Importación | Shippar",
    description: "Todo lo que necesitás saber para importar bien. Guías, comparativas y estrategias con datos reales.",
    url: "https://shippar.net/blog",
    type: "website",
  },
  alternates: { canonical: "https://shippar.net/blog" },
};

const ICON_MAP = {
  truck: TbTruckDelivery,
  chart: TbChartBar,
  ship: TbShip,
  document: HiOutlineDocumentText,
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Shippar", item: "https://shippar.net" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://shippar.net/herramientas" },
    { "@type": "ListItem", position: 3, name: "Blog", item: "https://shippar.net/blog" },
  ],
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main style={{ minHeight: "100vh", padding: "80px 16px 60px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: "24px" }}>
            <ol style={{
              display: "flex", alignItems: "center", gap: "6px",
              listStyle: "none", margin: 0, padding: 0,
              fontSize: "0.8125rem", color: "var(--ctz-text-muted)",
            }}>
              <li><Link href="/" style={{ color: "var(--ctz-text-muted)", textDecoration: "none" }}>Shippar</Link></li>
              <li style={{ opacity: 0.5 }}>/</li>
              <li><Link href="/herramientas" style={{ color: "var(--ctz-text-muted)", textDecoration: "none" }}>Herramientas</Link></li>
              <li style={{ opacity: 0.5 }}>/</li>
              <li style={{ color: "var(--ctz-text-secondary)", fontWeight: 500 }}>Blog</li>
            </ol>
          </nav>

          {/* Header */}
          <header style={{ marginBottom: "40px" }}>
            <span style={{
              display: "inline-block", padding: "4px 12px", marginBottom: "12px",
              fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.08em", color: "var(--ctz-accent)",
              background: "var(--ctz-accent-light)", borderRadius: "var(--ctz-radius-pill)",
              border: "1px solid var(--ctz-accent-ring)",
            }}>
              Blog de importación
            </span>
            <h1 style={{
              fontSize: "2rem", fontWeight: 800, color: "var(--ctz-text-primary)",
              letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 12px",
            }}>
              Guías para importar con datos reales
            </h1>
            <p style={{
              fontSize: "1.0625rem", color: "var(--ctz-text-secondary)",
              lineHeight: 1.6, margin: 0, maxWidth: "600px",
            }}>
              Todo lo que necesitás saber para importar bien a Argentina. Sin chamuyo, con números y criterio de operador logístico.
            </p>
          </header>

          {/* Blog cards — dynamic from Supabase */}
          {posts.length === 0 ? (
            <div style={{
              padding: "48px 24px", textAlign: "center",
              background: "var(--ctz-bg-elevated)", border: "1px solid var(--ctz-border)",
              borderRadius: "var(--ctz-radius-lg)",
            }}>
              <p style={{ color: "var(--ctz-text-muted)", fontSize: "0.9375rem" }}>
                Próximamente publicaremos contenido acá. ¡Volvé pronto!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {posts.map((post) => {
                const Icon = ICON_MAP[post.icon] || HiOutlineDocumentText;
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    style={{
                      display: "block", padding: "24px 28px",
                      background: "var(--ctz-bg-elevated)",
                      border: "1px solid var(--ctz-border)",
                      borderRadius: "var(--ctz-radius-lg)",
                      textDecoration: "none",
                      transition: "border-color 250ms, box-shadow 250ms, transform 250ms",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      {(post.tags || []).map((tag) => (
                        <span key={tag} style={{
                          padding: "2px 8px", fontSize: "0.6875rem", fontWeight: 600,
                          color: "var(--ctz-accent)", background: "var(--ctz-accent-light)",
                          borderRadius: "var(--ctz-radius-sm)", letterSpacing: "0.02em",
                        }}>
                          {tag}
                        </span>
                      ))}
                      <span style={{ fontSize: "0.75rem", color: "var(--ctz-text-muted)", marginLeft: "auto" }}>
                        {post.read_time} de lectura
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <div style={{
                        flexShrink: 0, width: "40px", height: "40px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "var(--ctz-accent-light)", borderRadius: "var(--ctz-radius-sm)",
                        color: "var(--ctz-accent)", border: "1px solid var(--ctz-accent-ring)",
                      }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h2 style={{
                          margin: "0 0 6px", fontSize: "1.125rem", fontWeight: 700,
                          color: "var(--ctz-text-primary)", letterSpacing: "-0.01em", lineHeight: 1.3,
                        }}>
                          {post.title}
                        </h2>
                        <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--ctz-text-secondary)", lineHeight: 1.55 }}>
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      marginTop: "14px", paddingTop: "14px",
                      borderTop: "1px solid var(--ctz-border)",
                      display: "flex", alignItems: "center", justifyContent: "flex-end",
                    }}>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--ctz-accent)" }}>
                        Leer artículo →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* CTA to tools */}
          <div style={{
            marginTop: "40px",
            background: "var(--ctz-bg-elevated)",
            border: "1px solid var(--ctz-border)",
            borderRadius: "var(--ctz-radius-md)",
            padding: "20px 24px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
          }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, color: "var(--ctz-text-primary)" }}>
                ¿Listo para calcular tu operación?
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "var(--ctz-text-muted)" }}>
                Estimá costos de importación y rentabilidad con datos reales.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/cotizador-importacion" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "9px 16px", fontSize: "0.8125rem", fontWeight: 600,
                color: "#fff", background: "var(--ctz-accent)",
                borderRadius: "var(--ctz-radius-sm)", textDecoration: "none",
              }}>
                Cotizador →
              </Link>
              <Link href="/calculadora-rentabilidad" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "9px 16px", fontSize: "0.8125rem", fontWeight: 600,
                color: "var(--ctz-accent)", background: "var(--ctz-accent-light)",
                border: "1px solid var(--ctz-accent-ring)",
                borderRadius: "var(--ctz-radius-sm)", textDecoration: "none",
              }}>
                Calculadora →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
