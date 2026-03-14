"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Eye, Zap, Users, DollarSign, Package } from "lucide-react";
import { useI18n } from "@/i18n";

/* ══════════════════════════════════════════════════════════
   WHY SHIPPAR — Section 2 (editorial, clean, mockup-driven)
   ──────────────────────────────────────────────────────────
   Atmosphere: editorial pause. Clean bg-mid, no grid, no
   network nodes. The mockup and copy are the protagonists.
   ══════════════════════════════════════════════════════════ */

const FLOATING_CARDS = [
    {
        icon: Eye,
        title: "Seguimiento online",
        desc: "Estado visible en cada etapa del envío",
        position: "top-left" as const,
        variant: "dark" as const,
    },
    {
        icon: Zap,
        title: "Cotizaciones en segundos",
        desc: "Menos ida y vuelta, más velocidad",
        position: "top-right" as const,
        variant: "light" as const,
    },
    {
        icon: Users,
        title: "Equipo detrás de cada envío",
        desc: "Operación, aduana y soporte real",
        position: "bottom-left" as const,
        variant: "dark" as const,
    },
    {
        icon: DollarSign,
        title: "Costo más claro desde el inicio",
        desc: "Más visibilidad, menos sorpresas",
        position: "bottom-right" as const,
        variant: "light" as const,
    },
];

/* ── Card style tokens by variant ── */
const CARD_STYLES = {
    dark: {
        bg: "linear-gradient(165deg, rgba(12,24,50,0.95) 0%, rgba(8,18,40,0.92) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        titleColor: "#FFFFFF",
        descColor: "#94a3b8",
        iconBg: "rgba(43,192,255,0.1)",
        iconColor: "#2BC0FF",
        shadow: "0 4px 20px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.3)",
    },
    light: {
        bg: "linear-gradient(165deg, rgba(215,225,240,0.95) 0%, rgba(200,212,230,0.93) 100%)",
        border: "1px solid rgba(255,255,255,0.4)",
        titleColor: "#0a1628",
        descColor: "rgba(10,22,40,0.6)",
        iconBg: "rgba(29,161,255,0.12)",
        iconColor: "#1565C0",
        shadow: "0 4px 20px rgba(0,0,0,0.25), 0 12px 40px rgba(0,0,0,0.15)",
    },
} as const;

/* ── Card positions relative to the phone (desktop) ── */
const CARD_POSITIONS: Record<string, React.CSSProperties> = {
    "top-left": { top: "2%", left: "-58%" },
    "top-right": { top: "8%", right: "-55%" },
    "bottom-left": { bottom: "18%", left: "-62%" },
    "bottom-right": { bottom: "6%", right: "-52%" },
};

const CARD_OFFSETS: Record<string, { x: number; y: number }> = {
    "top-left": { x: -30, y: -20 },
    "top-right": { x: 30, y: -15 },
    "bottom-left": { x: -25, y: 20 },
    "bottom-right": { x: 25, y: 15 },
};

/* ════════ Phone Mockup UI (code-rendered) ════════ */
function PhoneMockupUI() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(180deg, #070e24 0%, #0a1530 100%)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
        >
            {/* Status bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 20px 4px",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: 600,
                }}
            >
                <span>20:07</span>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="rgba(255,255,255,0.5)" />
                        <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="rgba(255,255,255,0.5)" />
                        <rect x="7" y="2" width="2.5" height="8" rx="0.5" fill="rgba(255,255,255,0.6)" />
                        <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="rgba(255,255,255,0.7)" />
                    </svg>
                    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                        <rect x="0.5" y="0.5" width="17" height="9" rx="2" stroke="rgba(255,255,255,0.3)" />
                        <rect x="2" y="2" width="12" height="6" rx="1" fill="rgba(52,211,153,0.7)" />
                        <rect x="18" y="3" width="2" height="4" rx="1" fill="rgba(255,255,255,0.3)" />
                    </svg>
                </div>
            </div>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 16px" }}>
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <line x1="1" y1="2" x2="17" y2="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="1" y1="7" x2="13" y2="7" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="1" y1="12" x2="10" y2="12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <img src="/shippar-isotipo.webp" alt="Shippar isotipo — plataforma de importaciones express" width={18} height={18} loading="lazy" style={{ height: "18px", width: "auto", objectFit: "contain" as const }} />
                <div style={{ width: 18 }} />
            </div>

            {/* Metric cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "0 16px" }}>
                {[
                    { label: "ENVÍOS DEL MES", value: "6", icon: "🚛" },
                    { label: "ENVÍOS EN TRÁNSITO", value: "2", icon: "⏳" },
                    { label: "ENTREGADOS ESTE MES", value: "4", icon: "✓" },
                    { label: "KG TOTALES", value: "234", suffix: "KG", icon: "↗" },
                ].map((metric, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "7px", fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const }}>{metric.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "12px" }}>{metric.icon}</span>
                            <span style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>{metric.value}</span>
                            {metric.suffix && <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{metric.suffix}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* My Shipments section */}
            <div style={{ padding: "16px 16px 0" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                        <Package size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
                        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", color: "rgba(255,255,255,0.7)" }}>MIS ENVÍOS</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(43,192,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Package size={14} style={{ color: "#2BC0FF" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "10px", fontWeight: 700, color: "#FFFFFF" }}>#SHI-285961</span>
                                <span style={{ fontSize: "7px", fontWeight: 600, color: "#2BC0FF", background: "rgba(43,192,255,0.1)", padding: "1px 5px", borderRadius: "4px" }}>En tránsito</span>
                            </div>
                            <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Capital Federal, Buenos Aires</div>
                            <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.3)", marginTop: "1px" }}>Entrega estimada: 26 abril</div>
                        </div>
                        <ArrowRight size={12} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    </div>
                    <div style={{ marginTop: "10px", textAlign: "center" as const, fontSize: "9px", color: "rgba(255,255,255,0.3)", padding: "6px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}>Ver todos mis envíos</div>
                </div>
            </div>

            {/* Seguir envío button */}
            <div style={{ padding: "16px", marginTop: "auto" }}>
                <div style={{ background: "linear-gradient(135deg, #1D6FFF, #2B8CFF)", borderRadius: "12px", padding: "12px", textAlign: "center" as const, fontSize: "12px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.05em" }}>SEGUIR ENVÍO</div>
            </div>

            {/* Home indicator */}
            <div style={{ padding: "4px 0 8px", display: "flex", justifyContent: "center" }}>
                <div style={{ width: "100px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.15)" }} />
            </div>
        </div>
    );
}

/* ════════ Main Section ════════ */
export default function WhyShipparSection() {
    const { t } = useI18n();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    /* ── Subtle parallax on mouse ── */
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMouseOffset({ x: x * 6, y: y * 6 });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section
            id="why-shippar"
            style={{
                background: "var(--bg-mid)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* ── Very subtle radial depth — no grid, no nodes, editorial clean ── */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: "20%",
                    right: "20%",
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, rgba(15,35,70,0.08) 0%, transparent 70%)",
                    filter: "blur(40px)",
                }}
            />

            {/* ── Bottom fade → HowItWorks (deep) ── */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
                style={{
                    height: "64px",
                    background: "linear-gradient(to bottom, transparent, var(--bg-deep))",
                }}
            />

            <div ref={ref} className="section-padding">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* ═══ LEFT COLUMN: Copy + CTA ═══ */}
                        <div className="relative z-10 order-2 lg:order-1">
                            {/* Eyebrow */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5 }}
                            >
                                <span
                                    style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: "#2BC0FF",
                                    }}
                                >
                                    {t("why.eyebrow")}
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="mt-4"
                                style={{
                                    fontSize: "clamp(28px, 4vw, 44px)",
                                    fontWeight: 800,
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.15,
                                    color: "#FFFFFF",
                                }}
                            >
                                {t("why.title")}{" "}
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >
                                    {t("why.title_accent")}
                                </span>{" "}
                                {t("why.title_post")}
                            </motion.h2>

                            {/* Subheadline */}
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mt-5"
                                style={{
                                    fontSize: "16px",
                                    lineHeight: 1.7,
                                    color: "#adb9cf",
                                    maxWidth: "440px",
                                }}
                            >
                                {t("why.subtitle")}
                            </motion.p>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.35 }}
                                className="mt-8"
                            >
                                <a
                                    href="https://wa.me/5491155955269"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm transition-all duration-300 hover:-translate-y-0.5"
                                    style={{
                                        background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                        fontWeight: 600,
                                        boxShadow: "0 4px 20px rgba(43,192,255,0.2)",
                                    }}
                                >
                                    <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                                        <span
                                            className="hero-shimmer absolute inset-0 -translate-x-full"
                                            style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)" }}
                                        />
                                    </span>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {t("why.cta")} <ArrowRight size={16} />
                                    </span>
                                </a>
                            </motion.div>

                        </div>

                        {/* ═══ RIGHT COLUMN: Phone Mockup + Floating Cards ═══ */}
                        <div className="relative z-10 order-1 lg:order-2 flex justify-center items-center" style={{ minHeight: "auto" }}>
                            {/* ── Phone Container (desktop only) ── */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: [0, -10, 0] }
                                        : {}
                                }
                                transition={{
                                    opacity: { duration: 0.8, delay: 0.2 },
                                    y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                                }}
                                className="hidden lg:flex items-center"
                                style={{
                                    position: "relative",
                                    width: "260px",
                                    minHeight: "580px",
                                    transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px) rotate(${mouseOffset.x * 0.15}deg)`,
                                    transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                                }}
                            >
                                {/* Phone frame */}
                                <div
                                    style={{
                                        width: "260px",
                                        height: "540px",
                                        borderRadius: "36px",
                                        border: "3px solid rgba(255,255,255,0.1)",
                                        overflow: "hidden",
                                        position: "relative",
                                        boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
                                    }}
                                >
                                    {/* Notch */}
                                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "24px", background: "#000", borderRadius: "0 0 16px 16px", zIndex: 10 }} />
                                    <PhoneMockupUI />
                                </div>

                                {/* ── Floating cards (desktop only) ── */}
                                {FLOATING_CARDS.map((card, i) => {
                                    const s = CARD_STYLES[card.variant];
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: CARD_OFFSETS[card.position].x, y: CARD_OFFSETS[card.position].y }}
                                            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                                            transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: "easeOut" as const }}
                                            style={{
                                                position: "absolute",
                                                ...CARD_POSITIONS[card.position],
                                                width: "210px",
                                                background: s.bg,
                                                backdropFilter: "blur(10px)",
                                                WebkitBackdropFilter: "blur(10px)",
                                                border: s.border,
                                                borderRadius: "14px",
                                                padding: "14px 16px",
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "10px",
                                                boxShadow: s.shadow,
                                                zIndex: 5,
                                            }}
                                        >
                                            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <card.icon size={14} style={{ color: s.iconColor }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "12px", fontWeight: 600, color: s.titleColor, lineHeight: 1.3 }}>{t(`why.card.${i}.title`)}</div>
                                                <div style={{ fontSize: "10px", color: s.descColor, lineHeight: 1.4, marginTop: "2px" }}>{t(`why.card.${i}.desc`)}</div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>

                            {/* ── Mobile cards (clean 2×2 grid, no overlap) ── */}
                            <div className="lg:hidden w-full">
                                <div className="grid grid-cols-2 gap-3 px-1">
                                    {FLOATING_CARDS.map((card, i) => {
                                        const s = CARD_STYLES[card.variant];
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                                                style={{
                                                    background: s.bg,
                                                    border: s.border,
                                                    borderRadius: "14px",
                                                    padding: "16px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "10px",
                                                }}
                                            >
                                                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <card.icon size={15} style={{ color: s.iconColor }} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "13px", fontWeight: 600, color: s.titleColor, lineHeight: 1.3 }}>{t(`why.card.${i}.title`)}</div>
                                                    <div style={{ fontSize: "11px", color: s.descColor, lineHeight: 1.45, marginTop: "4px" }}>{t(`why.card.${i}.desc`)}</div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
