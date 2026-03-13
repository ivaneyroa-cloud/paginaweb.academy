"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ══════════════════════════════════════════════════════════
   INFRAESTRUCTURA INTERNACIONAL
   Single premium section replacing NetworkSection,
   MarketSection, and PartnersSection.
   3-block asymmetric layout: A (origins) + B (carriers) + C (hubs)
   ══════════════════════════════════════════════════════════ */

/* ── Origin data ── */
const ORIGINS = [
    {
        name: "China",
        description:
            "Operación fuerte para fábrica, verificación, declaración de exportación y cargas sensibles como baterías e imanes.",
        tags: ["verificación", "baterías", "imanes"],
    },
    {
        name: "Estados Unidos",
        description:
            "Depósito para recepción, consolidado y exportación de compras múltiples con mayor flexibilidad operativa.",
        tags: ["depósito", "consolidado", "exportación"],
    },
    {
        name: "Europa vía España",
        description:
            "Recepción en España para centralizar carga europea y coordinar despacho cuando la operación lo requiere.",
        tags: ["recepción", "despacho", "hub europeo"],
    },
];

/* ── Carrier logos ── */
const CARRIERS = [
    { name: "UPS", subtitle: "Entregas express aéreas", logo: "/carriers/ups.webp", size: 28 },
    { name: "FedEx", subtitle: "Cobertura global", logo: "/carriers/fedex.webp", size: 30 },
    { name: "SF Express", subtitle: "Especialista en Asia", logo: "/carriers/sfexpress.webp", size: 28 },
];

/* ── Hub / reception points ── */
const HUBS = [
    {
        location: "China",
        labels: ["recepción", "control", "salida"],
    },
    {
        location: "USA",
        labels: ["depósito", "consolidado", "exportación"],
    },
    {
        location: "España",
        labels: ["recepción", "hub", "despacho"],
    },
];

/* ── Animation variants ── */
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 + 0.15, duration: 0.5, ease: "easeOut" as const },
    }),
};

export default function InfrastructureSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

    return (
        <section
            ref={sectionRef}
            id="infrastructure"
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-surface)",
                padding: "4.5rem 1.5rem",
            }}
        >
            {/* ── Isometric grid texture (infrastructure = technical) ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                    maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)",
                    opacity: 0.3,
                }}
            />

            {/* ── Decorative network nodes ── */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
                <line x1="15%" y1="20%" x2="40%" y2="30%" stroke="rgba(43,192,255,0.5)" strokeWidth="0.5" />
                <line x1="60%" y1="15%" x2="85%" y2="25%" stroke="rgba(43,192,255,0.4)" strokeWidth="0.5" />
                <line x1="55%" y1="75%" x2="80%" y2="65%" stroke="rgba(43,192,255,0.3)" strokeWidth="0.5" />
                <line x1="20%" y1="80%" x2="45%" y2="70%" stroke="rgba(43,192,255,0.4)" strokeWidth="0.5" />
                <circle cx="15%" cy="20%" r="2" fill="rgba(43,192,255,0.5)" />
                <circle cx="40%" cy="30%" r="1.5" fill="rgba(43,192,255,0.4)" />
                <circle cx="85%" cy="25%" r="2" fill="rgba(43,192,255,0.3)" />
                <circle cx="60%" cy="15%" r="1.5" fill="rgba(43,192,255,0.4)" />
                <circle cx="80%" cy="65%" r="1.5" fill="rgba(43,192,255,0.3)" />
                <circle cx="55%" cy="75%" r="2" fill="rgba(43,192,255,0.4)" />
            </svg>

            {/* ── Bottom fade → Testimonios (mid) ── */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
                style={{
                    height: "72px",
                    background: "linear-gradient(to bottom, transparent, var(--bg-surface))",
                }}
            />
            {/* Ambient */}
            <div
                className="ambient-glow"
                style={{
                    width: 500,
                    height: 500,
                    top: "-8%",
                    right: "5%",
                    background: "rgba(43, 192, 255, 0.025)",
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* ── Section header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Infraestructura internacional
                    </h2>
                    <p
                        className="mt-3 text-base max-w-2xl mx-auto"
                        style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
                    >
                        Operamos con orígenes estratégicos, carriers internacionales y puntos
                        de recepción que nos permiten mover cargas con más control y capacidad
                        de respuesta.
                    </p>
                </motion.div>

                {/* ── Main panel ── */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(145deg, #0b1830 0%, #0f223f 50%, #0b1830 100%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow:
                            "0 4px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                >
                    {/* ── A + B Row ── */}
                    <div className="flex flex-col lg:flex-row">
                        {/* ── Block A: Orígenes operativos (55%) ── */}
                        <div
                            className="lg:w-[55%]"
                            style={{
                                padding: "2.5rem",
                                borderRight: "1px solid rgba(255,255,255,0.04)",
                            }}
                        >
                            <h3
                                className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-6"
                                style={{ color: "rgba(255,255,255,0.3)" }}
                            >
                                Orígenes operativos
                            </h3>

                            <div className="space-y-0">
                                {ORIGINS.map((origin, i) => (
                                    <motion.div
                                        key={origin.name}
                                        custom={i}
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        variants={fadeUp}
                                        className="group"
                                        style={{
                                            padding: "1.25rem 0",
                                            borderBottom:
                                                i < ORIGINS.length - 1
                                                    ? "1px solid rgba(255,255,255,0.04)"
                                                    : "none",
                                        }}
                                    >
                                        {/* Origin name */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <div
                                                className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-500"
                                                style={{
                                                    background: "var(--primary)",
                                                    opacity: 0.6,
                                                    boxShadow:
                                                        "0 0 8px rgba(43,192,255,0.2)",
                                                }}
                                            />
                                            <h4
                                                className="text-lg font-semibold text-white transition-colors duration-300"
                                                style={{ letterSpacing: "-0.01em" }}
                                            >
                                                {origin.name}
                                            </h4>
                                        </div>

                                        {/* Description */}
                                        <p
                                            className="text-sm leading-relaxed mb-3 ml-5"
                                            style={{
                                                color: "rgba(255,255,255,0.48)",
                                                lineHeight: 1.65,
                                                maxWidth: 420,
                                            }}
                                        >
                                            {origin.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 ml-5">
                                            {origin.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[11px] font-medium px-2.5 py-1 rounded-md transition-all duration-300"
                                                    style={{
                                                        color: "rgba(255,255,255,0.5)",
                                                        background: "rgba(255,255,255,0.03)",
                                                        border:
                                                            "1px solid rgba(255,255,255,0.06)",
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* ── Block B: Red logística (45%) ── */}
                        <div
                            className="lg:w-[45%] flex flex-col justify-between"
                            style={{ padding: "2.5rem" }}
                        >
                            <div>
                                <h3
                                    className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-6"
                                    style={{ color: "rgba(255,255,255,0.3)" }}
                                >
                                    Red logística internacional
                                </h3>

                                <motion.p
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="text-sm leading-relaxed mb-8"
                                    style={{
                                        color: "rgba(255,255,255,0.45)",
                                        lineHeight: 1.7,
                                        maxWidth: 380,
                                    }}
                                >
                                    Seleccionamos la vía más conveniente según origen, tipo de
                                    carga y complejidad operativa, apoyándonos en carriers
                                    internacionales reconocidos.
                                </motion.p>

                                {/* ── Carrier logos ── */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: 0.45, duration: 0.6 }}
                                    className="space-y-4"
                                >
                                    {CARRIERS.map((carrier, i) => (
                                        <motion.div
                                            key={carrier.name}
                                            custom={i + 3}
                                            initial="hidden"
                                            animate={isInView ? "visible" : "hidden"}
                                            variants={fadeUp}
                                            className="group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300"
                                            style={{
                                                background: "rgba(255,255,255,0.02)",
                                                border:
                                                    "1px solid rgba(255,255,255,0.04)",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background =
                                                    "rgba(255,255,255,0.04)";
                                                e.currentTarget.style.borderColor =
                                                    "rgba(255,255,255,0.08)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background =
                                                    "rgba(255,255,255,0.02)";
                                                e.currentTarget.style.borderColor =
                                                    "rgba(255,255,255,0.04)";
                                            }}
                                        >
                                            <div
                                                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={carrier.logo}
                                                    alt={carrier.name}
                                                    width={carrier.size}
                                                    height={carrier.size}
                                                    loading="lazy"
                                                    className="transition-all duration-300"
                                                    style={{
                                                        objectFit: "contain",
                                                        filter: "brightness(0) invert(1)",
                                                        opacity: 0.7,
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p
                                                    className="text-sm font-semibold transition-colors duration-300"
                                                    style={{
                                                        color: "rgba(255,255,255,0.8)",
                                                    }}
                                                >
                                                    {carrier.name}
                                                </p>
                                                <p
                                                    className="text-[11px]"
                                                    style={{
                                                        color: "rgba(255,255,255,0.35)",
                                                    }}
                                                >
                                                    {carrier.subtitle}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Subtle visual accent */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="mt-8 pt-5"
                                style={{
                                    borderTop: "1px solid rgba(255,255,255,0.04)",
                                }}
                            >
                                <p
                                    className="text-[11px] uppercase tracking-[0.12em]"
                                    style={{ color: "rgba(255,255,255,0.2)" }}
                                >
                                    + Operadores locales y agentes de carga especializados
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Block C: Recepción y consolidado ── */}
                    <div
                        style={{
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                            background: "rgba(255,255,255,0.01)",
                        }}
                    >
                        <div
                            className="px-6 py-5"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            {/* Block C header */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-1">
                                <h3
                                    className="text-[11px] uppercase tracking-[0.15em] font-semibold"
                                    style={{ color: "rgba(255,255,255,0.3)" }}
                                >
                                    Recepción y consolidado
                                </h3>
                                <p
                                    className="text-[12px] lg:text-right"
                                    style={{
                                        color: "rgba(255,255,255,0.3)",
                                        maxWidth: 420,
                                    }}
                                >
                                    Puntos de recepción para ordenar carga, consolidar
                                    mercadería y coordinar salidas internacionales.
                                </p>
                            </div>

                            {/* Hub grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                {HUBS.map((hub, i) => (
                                    <motion.div
                                        key={hub.location}
                                        custom={i + 5}
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        variants={fadeUp}
                                        className="flex items-start gap-4 py-4 px-4"
                                        style={{
                                            borderRight:
                                                i < HUBS.length - 1
                                                    ? "1px solid rgba(255,255,255,0.04)"
                                                    : "none",
                                        }}
                                    >
                                        {/* Accent dot */}
                                        <div
                                            className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                                            style={{
                                                background: "var(--primary)",
                                                opacity: 0.5,
                                                boxShadow:
                                                    "0 0 6px rgba(43,192,255,0.15)",
                                            }}
                                        />

                                        <div>
                                            {/* Location name */}
                                            <p
                                                className="text-sm font-semibold text-white mb-2"
                                                style={{ letterSpacing: "-0.01em" }}
                                            >
                                                {hub.location}
                                            </p>

                                            {/* Labels */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {hub.labels.map((label, j) => (
                                                    <span key={label} className="flex items-center gap-1.5">
                                                        <span
                                                            className="text-[11px]"
                                                            style={{
                                                                color: "rgba(255,255,255,0.4)",
                                                            }}
                                                        >
                                                            {label}
                                                        </span>
                                                        {j < hub.labels.length - 1 && (
                                                            <span
                                                                className="text-[11px]"
                                                                style={{
                                                                    color: "rgba(255,255,255,0.15)",
                                                                }}
                                                            >
                                                                /
                                                            </span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
