"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence, LayoutGroup } from "framer-motion";
import {
    Package,
    Plane,
    ShieldCheck,
    Truck,
    Upload,
    Globe,
    FileText,
    Container,
    Warehouse,
    Layers,
    Search,
    UserCheck,
    Handshake,
    ClipboardCheck,
    PackageCheck,
    CheckCircle,
    ArrowRight,
    Headset,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   SERVICIOS — Animated dynamic panel with service selector
   ──────────────────────────────────────────────────────────
   Premium micro-interactions. Restrained, never flashy.
   ══════════════════════════════════════════════════════════ */

/* ── Easing presets ── */
const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;
const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

/* ── Types ── */
type FlowNode = {
    icon: LucideIcon;
    label: string;
    sublabel?: string;
    active: boolean;
};

type Service = {
    id: string;
    label: string;
    tag: string;
    title: string;
    description: string;
    benefits: string[];
    ctaPrimary: string;
    landingUrl: string;
    flowNodes: FlowNode[];
};

/* ── Service definitions ── */
const SERVICES: Service[] = [
    {
        id: "courier",
        label: "Courier comercial",
        tag: "Puerta a puerta",
        title: "Importaciones puerta a puerta para empresas, pymes y emprendedores",
        description:
            "Coordinamos operaciones bajo régimen simplificado para clientes que necesitan traer mercadería del exterior con una solución ágil, clara y rentable. Gestionamos el proceso desde origen hasta la entrega final en Argentina, con seguimiento y soporte en cada etapa.",
        benefits: [
            "Operación comercial integral puerta a puerta",
            "Cotización con impuestos detallados",
            "Seguimiento de punta a punta",
            "Atención personalizada durante toda la operación",
        ],
        ctaPrimary: "Ver servicio",
        landingUrl: "/servicios/courier",
        flowNodes: [
            { icon: Package, label: "Origen", sublabel: "Recolección", active: true },
            { icon: Plane, label: "Tránsito", sublabel: "Internacional", active: true },
            { icon: ShieldCheck, label: "Validación", sublabel: "Aduana AR", active: true },
            { icon: Truck, label: "Entrega", sublabel: "Puerta a puerta", active: true },
        ],
    },
    {
        id: "exportacion",
        label: "Exportación courier",
        tag: "Internacional",
        title: "Envíos internacionales para empresas que venden al exterior",
        description:
            "Acompañamos operaciones de exportación con una solución práctica y ordenada para que empresas y marcas puedan enviar mercadería fuera del país con gestión integral y seguimiento durante todo el proceso.",
        benefits: [
            "Operación ágil para exportaciones courier",
            "Soporte documental y operativo",
            "Seguimiento durante todo el envío",
        ],
        ctaPrimary: "Ver servicio",
        landingUrl: "/servicios/exportacion",
        flowNodes: [
            { icon: Package, label: "Preparación", sublabel: "Argentina", active: true },
            { icon: Upload, label: "Salida", sublabel: "Internacional", active: true },
            { icon: Globe, label: "Tránsito", sublabel: "Global", active: true },
            { icon: CheckCircle, label: "Entrega", sublabel: "Destino", active: true },
        ],
    },
    {
        id: "maritima",
        label: "Carga marítima",
        tag: "LCL / FCL",
        title: "Soluciones marítimas según el volumen de tu operación",
        description:
            "Ofrecemos alternativas de carga consolidada o contenedor completo para empresas que necesitan una solución marítima adaptada al tipo de mercadería, el volumen y los tiempos de la operación.",
        benefits: [
            "Opción consolidada o contenedor completo",
            "Coordinación internacional de punta a punta",
            "Alternativas según volumen y necesidad operativa",
        ],
        ctaPrimary: "Ver servicio",
        landingUrl: "/servicios/maritima",
        flowNodes: [
            { icon: Container, label: "Carga", sublabel: "LCL o FCL", active: true },
            { icon: FileText, label: "Documentación", sublabel: "Exportación", active: true },
            { icon: Globe, label: "Tránsito", sublabel: "Marítimo", active: true },
            { icon: ShieldCheck, label: "Liberación", sublabel: "Aduana AR", active: true },
        ],
    },
    {
        id: "warehouse",
        label: "Warehouse",
        tag: "Consolidación",
        title: "Recepción, organización y preparación de carga en origen",
        description:
            "Recibimos mercadería de distintos proveedores, organizamos la operación y consolidamos bultos para optimizar el envío internacional antes de la salida.",
        benefits: [
            "Recepción de mercadería en origen",
            "Consolidación de carga",
            "Mejor organización previa al envío internacional",
        ],
        ctaPrimary: "Ver servicio",
        landingUrl: "/servicios/warehouse",
        flowNodes: [
            { icon: Package, label: "Recepción", sublabel: "Múltiples proveedores", active: true },
            { icon: Warehouse, label: "Warehouse", sublabel: "Organización", active: true },
            { icon: Layers, label: "Consolidación", sublabel: "Agrupamiento", active: true },
            { icon: Plane, label: "Salida", sublabel: "Internacional", active: true },
        ],
    },
    {
        id: "sourcing",
        label: "Sourcing",
        tag: "China",
        title: "Apoyo comercial y operativo desde origen",
        description:
            "Acompañamos a empresas que necesitan buscar, validar o coordinar proveedores en China, ordenando la operación desde el inicio para reducir fricción y preparar correctamente la compra.",
        benefits: [
            "Coordinación con proveedores",
            "Apoyo en origen",
            "Validación inicial de operación y mercadería",
        ],
        ctaPrimary: "Ver servicio",
        landingUrl: "/servicios/sourcing",
        flowNodes: [
            { icon: Search, label: "Búsqueda", sublabel: "Proveedores", active: true },
            { icon: UserCheck, label: "Validación", sublabel: "Comercial", active: true },
            { icon: Handshake, label: "Coordinación", sublabel: "Operativa", active: true },
            { icon: Package, label: "Despacho", sublabel: "Listo para envío", active: true },
        ],
    },
    {
        id: "fulfillment",
        label: "Fulfillment",
        tag: "Preparación",
        title: "Preparación operativa de mercadería para distribución",
        description:
            "Preparamos la mercadería según requerimientos operativos previos al despacho, facilitando su integración en circuitos logísticos y centros de distribución de forma ordenada y eficiente.",
        benefits: [
            "Acondicionamiento operativo de mercadería",
            "Preparación previa al despacho",
            "Orden y cumplimiento de requerimientos logísticos",
        ],
        ctaPrimary: "Ver servicio",
        landingUrl: "/servicios/fulfillment",
        flowNodes: [
            { icon: Package, label: "Ingreso", sublabel: "Mercadería", active: true },
            { icon: ClipboardCheck, label: "Control", sublabel: "Calidad y orden", active: true },
            { icon: PackageCheck, label: "Preparación", sublabel: "Acondicionamiento", active: true },
            { icon: Truck, label: "Despacho", sublabel: "Distribución", active: true },
        ],
    },
];

/* ── Scoped styles ── */
const SCOPED_STYLES = `
    .servicios-scroll::-webkit-scrollbar { display: none; }
    .servicios-scroll { scrollbar-width: none; -ms-overflow-style: none; }

    .servicios-selector-wrap { position: relative; }
    .servicios-selector-wrap::after {
        content: '';
        position: absolute;
        right: 0; top: 0; bottom: 0;
        width: 48px;
        background: linear-gradient(to right, transparent, var(--bg-deep));
        pointer-events: none;
        z-index: 2;
    }

    @keyframes servicios-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    .servicios-shimmer { animation: servicios-shimmer 3s ease-in-out infinite; }

    /* Dot pulse — subtle, slow */
    @keyframes dot-pulse {
        0%, 100% { box-shadow: 0 0 4px rgba(43,192,255,0.2); }
        50% { box-shadow: 0 0 10px rgba(43,192,255,0.45); }
    }
    .flow-dot-pulse { animation: dot-pulse 2.5s ease-in-out infinite; }

    /* Connector line draw */
    @keyframes line-draw {
        from { transform: scaleY(0); }
        to { transform: scaleY(1); }
    }
`;

/* ── Flow Visual — animated node system ── */
function FlowVisual({
    nodes,
    compact,
    serviceId,
}: {
    nodes: FlowNode[];
    compact?: boolean;
    serviceId: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                width: "100%",
                maxWidth: compact ? "100%" : "260px",
                margin: "0 auto",
            }}
        >
            {nodes.map((node, i) => {
                const Icon = node.icon;
                return (
                    <div key={`${serviceId}-${i}`}>
                        {/* Node */}
                        <motion.div
                            initial={{ opacity: 0, x: compact ? 6 : 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: compact ? 0.25 : 0.35,
                                delay: 0.06 + i * 0.07,
                                ease: EASE_SMOOTH,
                            }}
                            whileHover={
                                compact
                                    ? undefined
                                    : {
                                          y: -2,
                                          borderColor: "rgba(43,192,255,0.2)",
                                          backgroundColor: "rgba(43,192,255,0.03)",
                                          transition: { duration: 0.2 },
                                      }
                            }
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: compact ? "10px" : "12px",
                                padding: compact ? "10px 14px" : "10px 14px",
                                borderRadius: compact ? "12px" : "12px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                cursor: "default",
                            }}
                        >
                            {/* Step number */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.15 + i * 0.07,
                                }}
                                style={{
                                    width: compact ? "18px" : "20px",
                                    fontSize: compact ? "10px" : "10px",
                                    fontWeight: 700,
                                    color: "rgba(43,192,255,0.4)",
                                    fontVariantNumeric: "tabular-nums",
                                    flexShrink: 0,
                                    textAlign: "center",
                                }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </motion.div>

                            {/* Icon container */}
                            <motion.div
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.1 + i * 0.07,
                                    ease: EASE_OUT,
                                }}
                                whileHover={
                                    compact
                                        ? undefined
                                        : {
                                              rotate: 4,
                                              transition: { duration: 0.2 },
                                          }
                                }
                                style={{
                                    width: compact ? "32px" : "30px",
                                    height: compact ? "32px" : "30px",
                                    borderRadius: compact ? "8px" : "8px",
                                    background: "rgba(43,192,255,0.07)",
                                    border: "1px solid rgba(43,192,255,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Icon
                                    size={compact ? 14 : 14}
                                    style={{ color: "#2BC0FF" }}
                                />
                            </motion.div>

                            {/* Label + sublabel */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontSize: compact ? "13px" : "12.5px",
                                        fontWeight: 600,
                                        color: "#FFFFFF",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {node.label}
                                </div>
                                {node.sublabel && (
                                    <div
                                        style={{
                                            fontSize: compact ? "10px" : "10px",
                                            fontWeight: 500,
                                            color: "rgba(255,255,255,0.4)",
                                            marginTop: "1px",
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        {node.sublabel}
                                    </div>
                                )}
                            </div>

                            {/* Active dot with pulse */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.2 + i * 0.07,
                                    ease: EASE_OUT,
                                }}
                                className="flow-dot-pulse"
                                style={{
                                    width: compact ? "5px" : "5px",
                                    height: compact ? "5px" : "5px",
                                    borderRadius: "50%",
                                    background: "#2BC0FF",
                                    flexShrink: 0,
                                }}
                            />
                        </motion.div>

                        {/* Connector line — draws itself */}
                        {i < nodes.length - 1 && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                     height: compact ? "8px" : "8px",
                                    overflow: "hidden",
                                }}
                            >
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: 0.15 + i * 0.07,
                                        ease: EASE_SMOOTH,
                                    }}
                                    style={{
                                        width: "1px",
                                        height: "100%",
                                        background:
                                            "linear-gradient(to bottom, rgba(43,192,255,0.2), rgba(43,192,255,0.08))",
                                        transformOrigin: "top",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ── Mobile detect hook ── */
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);
    const check = useCallback(() => {
        setIsMobile(window.innerWidth < breakpoint);
    }, [breakpoint]);
    useEffect(() => {
        check();
        window.addEventListener("resize", check, { passive: true });
        return () => window.removeEventListener("resize", check);
    }, [check]);
    return isMobile;
}

/* ═══════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════ */
export default function ServiciosSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const selectorRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 left, 1 right
    const isMobile = useIsMobile();

    const activeService = SERVICES[activeIndex];

    const handleServiceChange = (newIndex: number) => {
        setDirection(newIndex > activeIndex ? 1 : -1);
        setActiveIndex(newIndex);
    };

    /* Scroll active pill into view on mobile */
    useEffect(() => {
        if (!isMobile || !selectorRef.current) return;
        const container = selectorRef.current;
        const activeBtn = container.children[activeIndex] as HTMLElement;
        if (!activeBtn) return;
        const scrollLeft =
            activeBtn.offsetLeft -
            container.offsetWidth / 2 +
            activeBtn.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }, [activeIndex, isMobile]);

    /* ── Animation variants ── */
    const panelContentVariants = {
        enter: (dir: number) => ({
            opacity: 0,
            x: isMobile ? 0 : dir * 10,
            filter: isMobile ? "none" : "blur(1.5px)",
        }),
        center: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
        },
        exit: (dir: number) => ({
            opacity: 0,
            x: isMobile ? 0 : dir * -6,
            filter: isMobile ? "none" : "blur(1px)",
        }),
    };

    return (
        <section
            id="servicios"
            ref={sectionRef}
            className="relative overflow-hidden"
            style={{ background: "var(--bg-deep)" }}
        >
            <style>{SCOPED_STYLES}</style>

            {/* ── Ambient depth glows ── */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 700,
                    height: 700,
                    top: "10%",
                    left: "-5%",
                    background:
                        "radial-gradient(ellipse 70% 60%, rgba(43,192,255,0.015) 0%, transparent 65%)",
                    filter: "blur(120px)",
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 500,
                    height: 500,
                    bottom: "5%",
                    right: "-3%",
                    background:
                        "radial-gradient(circle, rgba(29,161,255,0.01) 0%, transparent 60%)",
                    filter: "blur(100px)",
                }}
            />

            {/* ── Main content ── */}
            <div
                style={{
                    paddingTop: "clamp(2rem, 3vw, 4rem)",
                    paddingBottom: "clamp(3rem, 5vw, 7rem)",
                }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    {/* ═══ HEADER — staggered entry ═══ */}
                    <div
                        className="text-center mx-auto"
                        style={{
                            maxWidth: "720px",
                            marginBottom: "clamp(1.25rem, 2vw, 2rem)",
                        }}
                    >
                        {/* Eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.5,
                                ease: EASE_OUT,
                            }}
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
                                Servicios
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 14 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.6,
                                delay: 0.12,
                                ease: EASE_OUT,
                            }}
                            className="mt-2"
                            style={{
                                fontSize: "clamp(24px, 5.5vw, 44px)",
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                lineHeight: 1.15,
                                color: "#FFFFFF",
                            }}
                        >
                            Soluciones logísticas para operaciones comerciales{" "}
                            <span
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                internacionales
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.5,
                                delay: 0.24,
                                ease: EASE_OUT,
                            }}
                            style={{
                                fontSize: "clamp(14px, 2.5vw, 16px)",
                                lineHeight: 1.7,
                                color: "#adb9cf",
                                maxWidth: "600px",
                                margin: "clamp(8px, 1vw, 12px) auto 0",
                            }}
                        >
                            Trabajamos con empresas, pymes y emprendedores que
                            necesitan importar o exportar con una operación
                            clara, acompañada y eficiente.
                        </motion.p>
                    </div>

                    {/* ═══ SERVICE SELECTOR — staggered pills + sliding indicator ═══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                            duration: 0.5,
                            delay: 0.35,
                            ease: EASE_OUT,
                        }}
                        style={{ marginBottom: "clamp(0.75rem, 1vw, 1.25rem)" }}
                    >
                        {/* Desktop: pill row with sliding active indicator */}
                        <LayoutGroup>
                            <div className="hidden md:grid justify-center gap-3" style={{ gridTemplateColumns: "repeat(3, auto)", justifyItems: "center" }}>
                                {SERVICES.map((service, i) => {
                                    const isActive = i === activeIndex;
                                    return (
                                        <motion.button
                                            key={service.id}
                                            onClick={() => handleServiceChange(i)}
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={
                                                isInView
                                                    ? { opacity: 1, y: 0 }
                                                    : {}
                                            }
                                            transition={{
                                                duration: 0.35,
                                                delay: 0.4 + i * 0.04,
                                                ease: EASE_OUT,
                                            }}
                                            whileHover={
                                                isActive
                                                    ? undefined
                                                    : {
                                                          y: -1,
                                                          transition: {
                                                              duration: 0.2,
                                                          },
                                                      }
                                            }
                                            className="relative flex items-center gap-3 cursor-pointer"
                                            style={{
                                                padding: "14px 22px",
                                                borderRadius: "12px",
                                                background: "transparent",
                                                border: `1px solid ${
                                                    isActive
                                                        ? "rgba(43,192,255,0.2)"
                                                        : "rgba(255,255,255,0.06)"
                                                }`,
                                                transition:
                                                    "border-color 0.3s ease",
                                            }}
                                        >
                                            {/* Sliding active background */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill-bg"
                                                    className="absolute inset-0"
                                                    style={{
                                                        borderRadius: "12px",
                                                        background:
                                                            "rgba(43,192,255,0.08)",
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 380,
                                                        damping: 32,
                                                    }}
                                                />
                                            )}
                                            <span
                                                className="relative z-10"
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    color: isActive
                                                        ? "#FFFFFF"
                                                        : "rgba(255,255,255,0.55)",
                                                    letterSpacing: "0.005em",
                                                    transition: "color 0.3s",
                                                }}
                                            >
                                                {service.label}
                                            </span>
                                            <span
                                                className="relative z-10"
                                                style={{
                                                    fontSize: "10px",
                                                    fontWeight: 600,
                                                    letterSpacing: "0.06em",
                                                    textTransform: "uppercase",
                                                    color: isActive
                                                        ? "#2BC0FF"
                                                        : "rgba(255,255,255,0.25)",
                                                    background: isActive
                                                        ? "rgba(43,192,255,0.1)"
                                                        : "rgba(255,255,255,0.04)",
                                                    padding: "3px 8px",
                                                    borderRadius: "6px",
                                                    transition: "all 0.3s",
                                                }}
                                            >
                                                {service.tag}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </LayoutGroup>

                        {/* Mobile: horizontal scroll */}
                        <div className="md:hidden servicios-selector-wrap">
                            <div
                                ref={selectorRef}
                                className="flex gap-2 overflow-x-auto servicios-scroll"
                                style={{
                                    scrollSnapType: "x mandatory",
                                    WebkitOverflowScrolling: "touch",
                                    paddingBottom: "4px",
                                    paddingRight: "48px",
                                }}
                            >
                                {SERVICES.map((service, i) => {
                                    const isActive = i === activeIndex;
                                    return (
                                        <button
                                            key={service.id}
                                            onClick={() =>
                                                handleServiceChange(i)
                                            }
                                            className="flex-shrink-0 flex items-center gap-2"
                                            style={{
                                                padding: "12px 18px",
                                                minHeight: "48px",
                                                borderRadius: "12px",
                                                background: isActive
                                                    ? "rgba(43,192,255,0.08)"
                                                    : "rgba(255,255,255,0.025)",
                                                border: `1px solid ${
                                                    isActive
                                                        ? "rgba(43,192,255,0.25)"
                                                        : "rgba(255,255,255,0.06)"
                                                }`,
                                                scrollSnapAlign: "center",
                                                transition:
                                                    "background 0.25s, border-color 0.25s",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    color: isActive
                                                        ? "#FFFFFF"
                                                        : "rgba(255,255,255,0.45)",
                                                    whiteSpace: "nowrap",
                                                    transition: "color 0.25s",
                                                }}
                                            >
                                                {service.label}
                                            </span>
                                            {isActive && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: EASE_OUT,
                                                    }}
                                                    style={{
                                                        width: "5px",
                                                        height: "5px",
                                                        borderRadius: "50%",
                                                        background: "#2BC0FF",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* ═══ MAIN PANEL — reveal + directional crossfade ═══ */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: isMobile ? 12 : 20,
                            scale: isMobile ? 1 : 0.985,
                        }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0, scale: 1 }
                                : {}
                        }
                        transition={{
                            duration: 0.6,
                            delay: 0.45,
                            ease: EASE_SMOOTH,
                        }}
                    >
                        <div
                            style={{
                                background:
                                    "linear-gradient(165deg, rgba(11,31,58,0.7) 0%, rgba(8,20,42,0.85) 50%, rgba(6,15,35,0.9) 100%)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: isMobile ? "16px" : "20px",
                                boxShadow: isMobile
                                    ? "0 4px 40px rgba(0,0,0,0.4)"
                                    : "0 8px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 80px rgba(0,0,0,0.1)",
                                overflow: "hidden",
                            }}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={activeService.id}
                                    custom={direction}
                                    variants={panelContentVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: isMobile ? 0.14 : 0.14,
                                        ease: EASE_SMOOTH,
                                    }}
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2">
                                        {/* ── LEFT: Content ── */}
                                        <div
                                            className="flex flex-col justify-center"
                                            style={{
                                                padding: isMobile
                                                    ? "1.75rem 1.25rem 1.5rem"
                                                    : "clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 3rem)",
                                            }}
                                        >
                                            {/* Active service indicator */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    marginBottom: isMobile
                                                        ? "14px"
                                                        : "20px",
                                                }}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        ease: EASE_OUT,
                                                    }}
                                                    className="flow-dot-pulse"
                                                    style={{
                                                        width: "7px",
                                                        height: "7px",
                                                        borderRadius: "50%",
                                                        background: "#2BC0FF",
                                                    }}
                                                />
                                                <motion.span
                                                    initial={{ opacity: 0, x: 6 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: 0.05,
                                                    }}
                                                    style={{
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                        letterSpacing: "0.1em",
                                                        textTransform:
                                                            "uppercase",
                                                        color: "#2BC0FF",
                                                    }}
                                                >
                                                    {activeService.label}
                                                </motion.span>
                                            </div>

                                            {/* Title */}
                                            <h2
                                                style={{
                                                    fontSize: isMobile
                                                        ? "clamp(20px, 5vw, 24px)"
                                                        : "clamp(22px, 2.8vw, 28px)",
                                                    fontWeight: 800,
                                                    letterSpacing: "-0.02em",
                                                    lineHeight: 1.2,
                                                    color: "#FFFFFF",
                                                    marginBottom: isMobile
                                                        ? "12px"
                                                        : "16px",
                                                }}
                                            >
                                                {activeService.title}
                                            </h2>

                                            {/* Description */}
                                            <p
                                                style={{
                                                    fontSize: isMobile
                                                        ? "14px"
                                                        : "15px",
                                                    lineHeight: isMobile
                                                        ? 1.65
                                                        : 1.7,
                                                    color: "rgba(255,255,255,0.5)",
                                                    marginBottom: isMobile
                                                        ? "20px"
                                                        : "28px",
                                                    maxWidth: "480px",
                                                }}
                                            >
                                                {activeService.description}
                                            </p>

                                            {/* Benefits — staggered checks */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: isMobile
                                                        ? "10px"
                                                        : "12px",
                                                    marginBottom: isMobile
                                                        ? "24px"
                                                        : "32px",
                                                }}
                                            >
                                                {activeService.benefits.map(
                                                    (item, i) => (
                                                        <motion.div
                                                            key={`${activeService.id}-b-${i}`}
                                                            initial={{
                                                                opacity: 0,
                                                                x: isMobile
                                                                    ? 0
                                                                    : 8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                                delay:
                                                                    0.08 +
                                                                    i * 0.05,
                                                                ease: EASE_OUT,
                                                            }}
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "flex-start",
                                                                gap: isMobile
                                                                    ? "8px"
                                                                    : "10px",
                                                            }}
                                                        >
                                                            {/* Check icon with entrance */}
                                                            <motion.div
                                                                initial={{
                                                                    scale: 0.5,
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    scale: 1,
                                                                    opacity: 1,
                                                                }}
                                                                transition={{
                                                                    duration: 0.25,
                                                                    delay:
                                                                        0.15 +
                                                                        i *
                                                                            0.05,
                                                                    ease: EASE_OUT,
                                                                }}
                                                                style={{
                                                                    width: isMobile
                                                                        ? "18px"
                                                                        : "20px",
                                                                    height: isMobile
                                                                        ? "18px"
                                                                        : "20px",
                                                                    borderRadius:
                                                                        "5px",
                                                                    background:
                                                                        "rgba(43,192,255,0.08)",
                                                                    border: "1px solid rgba(43,192,255,0.15)",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    flexShrink: 0,
                                                                    marginTop:
                                                                        "2px",
                                                                }}
                                                            >
                                                                <svg
                                                                    width={
                                                                        isMobile
                                                                            ? "9"
                                                                            : "10"
                                                                    }
                                                                    height={
                                                                        isMobile
                                                                            ? "9"
                                                                            : "10"
                                                                    }
                                                                    viewBox="0 0 10 10"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M2 5L4.2 7L8 3"
                                                                        stroke="#2BC0FF"
                                                                        strokeWidth="1.5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </motion.div>
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        isMobile
                                                                            ? "13.5px"
                                                                            : "14px",
                                                                    color: "rgba(255,255,255,0.6)",
                                                                    fontWeight: 500,
                                                                    lineHeight: 1.4,
                                                                }}
                                                            >
                                                                {item}
                                                            </span>
                                                        </motion.div>
                                                    )
                                                )}
                                            </div>

                                            {/* CTAs */}
                                            <div
                                                className="flex flex-col sm:flex-row gap-3"
                                                style={{
                                                    alignItems: isMobile
                                                        ? "stretch"
                                                        : "flex-start",
                                                }}
                                            >
                                                {/* Primary CTA */}
                                                <motion.a
                                                    href={activeService.landingUrl}
                                                    whileHover={
                                                        isMobile
                                                            ? undefined
                                                            : {
                                                                  y: -2,
                                                                  boxShadow:
                                                                      "0 6px 28px rgba(43,192,255,0.3)",
                                                                  transition: {
                                                                      duration: 0.2,
                                                                  },
                                                              }
                                                    }
                                                    whileTap={{ scale: 0.98 }}
                                                    className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl text-white"
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                                        fontWeight: 600,
                                                        boxShadow:
                                                            "0 4px 20px rgba(43,192,255,0.2)",
                                                        fontSize: "14px",
                                                        padding: isMobile
                                                            ? "14px 24px"
                                                            : "12px 28px",
                                                        minHeight: "48px",
                                                    }}
                                                >
                                                    <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                                                        <span
                                                            className="servicios-shimmer absolute inset-0"
                                                            style={{
                                                                background:
                                                                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                                                            }}
                                                        />
                                                    </span>
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        {
                                                            activeService.ctaPrimary
                                                        }
                                                        <ArrowRight
                                                            size={15}
                                                        />
                                                    </span>
                                                </motion.a>

                                                {/* Secondary CTA */}
                                                <motion.a
                                                    href="https://wa.me/5491155955269"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={
                                                        isMobile
                                                            ? undefined
                                                            : {
                                                                  y: -1,
                                                                  borderColor:
                                                                      "rgba(255,255,255,0.18)",
                                                                  backgroundColor:
                                                                      "rgba(255,255,255,0.06)",
                                                                  color: "rgba(255,255,255,0.9)",
                                                                  transition: {
                                                                      duration: 0.2,
                                                                  },
                                                              }
                                                    }
                                                    whileTap={{ scale: 0.98 }}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl"
                                                    style={{
                                                        border: "1px solid rgba(255,255,255,0.1)",
                                                        background:
                                                            "rgba(255,255,255,0.03)",
                                                        color: "rgba(255,255,255,0.65)",
                                                        fontWeight: 600,
                                                        fontSize: "14px",
                                                        padding: isMobile
                                                            ? "14px 24px"
                                                            : "12px 24px",
                                                        minHeight: "48px",
                                                    }}
                                                >
                                                    <Headset size={15} />
                                                    Hablar con un asesor
                                                </motion.a>
                                            </div>
                                        </div>

                                        {/* ── RIGHT / BOTTOM: Flow Visual ── */}
                                        <div
                                            className="flex items-center justify-center relative"
                                            style={{
                                                padding: isMobile
                                                    ? "0 1.25rem 1.75rem"
                                                    : "clamp(2rem, 3vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)",
                                            }}
                                        >
                                            {/* Desktop: left gradient separator */}
                                            {!isMobile && (
                                                <div
                                                    className="hidden lg:block absolute left-0 top-0 bottom-0"
                                                    style={{
                                                        width: "1px",
                                                        background:
                                                            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06), transparent)",
                                                    }}
                                                />
                                            )}

                                            {/* Mobile separator */}
                                            {isMobile && (
                                                <div
                                                    className="absolute left-[10%] right-[10%] top-0"
                                                    style={{
                                                        height: "1px",
                                                        background:
                                                            "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)",
                                                    }}
                                                />
                                            )}

                                            {/* Subtle inner atmosphere */}
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{
                                                    background:
                                                        "radial-gradient(ellipse 70% 60% at 60% 50%, rgba(43,192,255,0.015) 0%, transparent 65%)",
                                                }}
                                            />

                                            <div
                                                className="relative z-10 w-full"
                                                style={{
                                                    paddingTop: isMobile
                                                        ? "1.25rem"
                                                        : "0",
                                                }}
                                            >
                                                {/* Flow header */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        gap: "8px",
                                                        marginBottom: isMobile
                                                            ? "16px"
                                                            : "24px",
                                                    }}
                                                >
                                                    <motion.div
                                                        initial={{
                                                            scaleX: 0,
                                                        }}
                                                        animate={{
                                                            scaleX: 1,
                                                        }}
                                                        transition={{
                                                            duration: 0.4,
                                                            delay: 0.1,
                                                            ease: EASE_SMOOTH,
                                                        }}
                                                        style={{
                                                            height: "1px",
                                                            width: isMobile
                                                                ? "28px"
                                                                : "40px",
                                                            background:
                                                                "linear-gradient(to right, transparent, rgba(255,255,255,0.08))",
                                                            transformOrigin:
                                                                "right",
                                                        }}
                                                    />
                                                    <motion.span
                                                        initial={{
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: 0.15,
                                                        }}
                                                        style={{
                                                            fontSize: isMobile
                                                                ? "9px"
                                                                : "10px",
                                                            fontWeight: 600,
                                                            letterSpacing:
                                                                "0.12em",
                                                            textTransform:
                                                                "uppercase",
                                                            color: "rgba(255,255,255,0.25)",
                                                        }}
                                                    >
                                                        Flujo operativo
                                                    </motion.span>
                                                    <motion.div
                                                        initial={{
                                                            scaleX: 0,
                                                        }}
                                                        animate={{
                                                            scaleX: 1,
                                                        }}
                                                        transition={{
                                                            duration: 0.4,
                                                            delay: 0.1,
                                                            ease: EASE_SMOOTH,
                                                        }}
                                                        style={{
                                                            height: "1px",
                                                            width: isMobile
                                                                ? "28px"
                                                                : "40px",
                                                            background:
                                                                "linear-gradient(to left, transparent, rgba(255,255,255,0.08))",
                                                            transformOrigin:
                                                                "left",
                                                        }}
                                                    />
                                                </div>

                                                <FlowVisual
                                                    nodes={
                                                        activeService.flowNodes
                                                    }
                                                    compact={isMobile}
                                                    serviceId={
                                                        activeService.id
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
