"use client";

import Link from "next/link";

/**
 * BlogArticleLayout — Shared wrapper for all blog articles.
 * Provides breadcrumbs, header, article styling, and footer CTAs.
 */
export default function BlogArticleLayout({ children, title, readTime, tags = [] }) {
  return (
    <main style={{ minHeight: "100vh", padding: "80px 16px 60px" }}>
      <article style={{ maxWidth: "780px", margin: "0 auto" }}>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "24px" }}>
          <ol style={{
            display: "flex", alignItems: "center", gap: "6px",
            listStyle: "none", margin: 0, padding: 0,
            fontSize: "0.8125rem", color: "var(--ctz-text-muted)",
          }}>
            <li><Link href="/" style={{ color: "var(--ctz-text-muted)", textDecoration: "none" }}>Shippar</Link></li>
            <li style={{ opacity: 0.5 }}>/</li>
            <li><Link href="/blog" style={{ color: "var(--ctz-text-muted)", textDecoration: "none" }}>Blog</Link></li>
            <li style={{ opacity: 0.5 }}>/</li>
            <li style={{ color: "var(--ctz-text-secondary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <span key={tag} style={{
                padding: "3px 10px", fontSize: "0.6875rem", fontWeight: 600,
                color: "var(--ctz-accent)", background: "var(--ctz-accent-light)",
                borderRadius: "var(--ctz-radius-pill)", letterSpacing: "0.02em",
                border: "1px solid var(--ctz-accent-ring)",
              }}>
                {tag}
              </span>
            ))}
            {readTime && (
              <span style={{ fontSize: "0.75rem", color: "var(--ctz-text-muted)" }}>
                {readTime} de lectura
              </span>
            )}
          </div>
          <h1 style={{
            fontSize: "2rem", fontWeight: 800, color: "var(--ctz-text-primary)",
            letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0,
          }}>
            {title}
          </h1>
        </header>

        {/* Article body */}
        <div className="blog-content">
          {children}
        </div>

        {/* Footer CTA */}
        <div style={{
          marginTop: "48px", paddingTop: "32px",
          borderTop: "1px solid var(--ctz-border)",
        }}>
          <div style={{
            background: "var(--ctz-bg-elevated)",
            border: "1px solid var(--ctz-border)",
            borderRadius: "var(--ctz-radius-lg)",
            padding: "24px 28px",
            display: "flex", flexDirection: "column", gap: "16px",
          }}>
            <div>
              <p style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: "var(--ctz-text-primary)" }}>
                ¿Listo para hacer los números?
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "0.9375rem", color: "var(--ctz-text-secondary)", lineHeight: 1.5 }}>
                Usá las herramientas gratuitas de Shippar para estimar tu operación con datos reales.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/cotizador-importacion" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "10px 20px", fontSize: "0.875rem", fontWeight: 600,
                color: "#fff", background: "var(--ctz-accent-gradient)",
                borderRadius: "var(--ctz-radius-sm)", textDecoration: "none",
              }}>
                Cotizar importación →
              </Link>
              <Link href="/calculadora-rentabilidad" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "10px 20px", fontSize: "0.875rem", fontWeight: 600,
                color: "var(--ctz-accent)", background: "var(--ctz-accent-light)",
                border: "1px solid var(--ctz-accent-ring)",
                borderRadius: "var(--ctz-radius-sm)", textDecoration: "none",
              }}>
                Calcular rentabilidad →
              </Link>
            </div>
          </div>

          {/* Back to blog */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link href="/blog" style={{
              fontSize: "0.875rem", fontWeight: 500, color: "var(--ctz-text-muted)",
              textDecoration: "none",
            }}>
              ← Volver al blog
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
