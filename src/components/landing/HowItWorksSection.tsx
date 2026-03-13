"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n";
import {
    Package,
    Warehouse,
    FileCheck,
    Truck,
    Ship,
    FileText,
    ShieldCheck,
    CircleCheckBig,
    ArrowRight,
    Container,
    ClipboardCheck,
    ChevronDown,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   "CÓMO FUNCIONA" — Premium scrollytelling section
   Desktop: Sticky scroll-driven animation
   Mobile:  Tab-based click navigation (fast & clean)
   ══════════════════════════════════════════════════════════ */

/* ── Step data ── */
const STEPS = [
    {
        id: 0,
        number: "01",
        label: "Origen",
        title: "Comprás a tu proveedor o trabajás con agentes Shippar",
        description:
            "Podés comprar directamente a tu proveedor de confianza o apoyarte en nuestro equipo para buscar, coordinar y preparar la operación desde origen.",
        bullets: [
            "Compra con proveedor propio o sourcing asistido",
            "Envío a warehouse en China o USA",
            "Validación inicial de datos y mercadería",
        ],
        panel: {
            origin: "Guangzhou",
            destination: "Buenos Aires",
            status: "Compra confirmada",
            statusColor: "#2BC0FF",
            badges: [
                { text: "Proveedor confirmado", done: true },
                { text: "Warehouse asignado", done: true },
                { text: "Carga en preparación", done: false },
            ],
            nodes: ["supplier", "warehouse"] as const,
            activeConnection: 0,
        },
    },
    {
        id: 1,
        number: "02",
        label: "Tránsito y envío",
        title: "Coordinamos la recolección y todo el proceso de salida",
        description:
            "Cuando tu compra está lista, gestionamos la recolección, coordinamos con el proveedor y preparamos la documentación necesaria para exportar la carga con seguimiento preciso hasta su arribo a Argentina.",
        bullets: [
            "Coordinación con proveedor y retiro de mercadería",
            "Preparación documental para exportación",
            "Seguimiento del envío durante todo el trayecto",
        ],
        panel: {
            origin: "Guangzhou",
            destination: "Buenos Aires",
            status: "En tránsito",
            statusColor: "#f59e0b",
            badges: [
                { text: "Recolección coordinada", done: true },
                { text: "Documentación emitida", done: true },
                { text: "Tracking activo", done: false },
            ],
            nodes: ["warehouse", "transit", "docs"] as const,
            activeConnection: 1,
        },
    },
    {
        id: 2,
        number: "03",
        label: "Liberación aduanera",
        labelShort: "Aduana",
        title: "Gestionamos la liberación de tu carga en Argentina",
        description:
            "Nos ocupamos de la documentación ante ARCA y del proceso de liberación aduanera, revisando que la clasificación de la mercadería sea la correcta para resguardar la operación y el beneficio del cliente.",
        bullets: [
            "Presentación documental en Argentina",
            "Control de clasificación y posiciones arancelarias",
            "Seguimiento hasta la liberación de la carga",
        ],
        panel: {
            origin: "Guangzhou",
            destination: "Buenos Aires",
            status: "Carga en liberación",
            statusColor: "#a78bfa",
            badges: [
                { text: "Documentación presentada", done: true },
                { text: "Clasificación validada", done: true },
                { text: "Carga liberada", done: false },
            ],
            nodes: ["arrival", "customs", "validation"] as const,
            activeConnection: 2,
        },
    },
    {
        id: 3,
        number: "04",
        label: "Entrega",
        title: "Recibís tu carga en domicilio o retirás por depósito",
        description:
            "Una vez liberada, coordinamos la entrega final según la modalidad más conveniente para vos: envío a domicilio, retiro por depósito o entrega programada para tu operación.",
        bullets: [
            "Entrega en domicilio o retiro por depósito",
            "Coordinación final con el cliente",
            "Cierre completo de la operación",
        ],
        panel: {
            origin: "Guangzhou",
            destination: "Buenos Aires",
            status: "Lista para entrega",
            statusColor: "#22c55e",
            badges: [
                { text: "Liberación completa", done: true },
                { text: "Entrega coordinada", done: true },
                { text: "Operación cerrada", done: true },
            ],
            nodes: ["release", "delivery", "complete"] as const,
            activeConnection: 3,
        },
    },
];

/* ── Node icon map ── */
const NODE_ICONS: Record<string, React.ReactNode> = {
    supplier: <Package size={18} />,
    warehouse: <Warehouse size={18} />,
    transit: <Ship size={18} />,
    docs: <FileText size={18} />,
    arrival: <Container size={18} />,
    customs: <ShieldCheck size={18} />,
    validation: <ClipboardCheck size={18} />,
    release: <FileCheck size={18} />,
    delivery: <Truck size={18} />,
    complete: <CircleCheckBig size={18} />,
};

const NODE_LABELS: Record<string, string> = {
    supplier: "Proveedor",
    warehouse: "Warehouse Shippar",
    transit: "En tránsito",
    docs: "Documentación",
    arrival: "Arribo Argentina",
    customs: "Gestión aduanera",
    validation: "Validación ARCA",
    release: "Liberación",
    delivery: "Entrega final",
    complete: "Operación cerrada",
};

/* ── Animation variants ── */
const fadeSlideUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.08 } },
};

/* ── Hook: detect mobile ── */
function useIsMobile(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < breakpoint);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpoint]);
    return isMobile;
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════ */
export default function HowItWorksSection() {
    const isMobile = useIsMobile();
    return isMobile ? <MobileHowItWorks /> : <DesktopHowItWorks />;
}

/* ══════════════════════════════════════════════════════════
   MOBILE VERSION — Tab-based, no scroll tracking
   ══════════════════════════════════════════════════════════ */
function MobileHowItWorks() {
    const { t } = useI18n();
    const [activeStep, setActiveStep] = useState(0);
    const step = STEPS[activeStep];

    return (
        <section
            id="how-it-works"
            className="relative overflow-hidden"
            style={{ background: "#050b1f" }}
        >
            {/* Ambient glows */}
            <div
                className="ambient-glow"
                style={{
                    width: 400, height: 400,
                    top: "-8%", left: "5%",
                    background: "rgba(43, 192, 255, 0.015)",
                }}
            />

            <div className="relative z-10 px-4 py-16 max-w-xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2
                        className="text-2xl sm:text-3xl font-bold text-white leading-tight"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        {t("how.title")}
                    </h2>
                    <p
                        className="mt-2 text-sm sm:text-base"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                        {t("how.subtitle")}
                    </p>
                </div>

                {/* ── Tab bar ── */}
                <div
                    className="flex rounded-xl p-1 mb-5"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    {STEPS.map((s, i) => {
                        const isActive = i === activeStep;
                        return (
                            <button
                                key={s.id}
                                onClick={() => setActiveStep(i)}
                                className="flex-1 py-2.5 rounded-lg text-center transition-all duration-300"
                                style={{
                                    background: isActive
                                        ? "rgba(43,192,255,0.12)"
                                        : "transparent",
                                    border: isActive
                                        ? "1px solid rgba(43,192,255,0.25)"
                                        : "1px solid transparent",
                                    cursor: "pointer",
                                }}
                            >
                                <span
                                    className="text-[11px] sm:text-xs font-bold block"
                                    style={{
                                        color: isActive
                                            ? "var(--primary)"
                                            : "rgba(255,255,255,0.35)",
                                    }}
                                >
                                    {s.number}
                                </span>
                                <span
                                    className="text-[9px] sm:text-[10px] font-medium block mt-0.5"
                                    style={{
                                        color: isActive
                                            ? "rgba(255,255,255,0.7)"
                                            : "rgba(255,255,255,0.2)",
                                    }}
                                >
                                    {t(`how.step.${s.id}.labelShort`, t(`how.step.${s.id}.label`))}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Content card ── */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: "linear-gradient(145deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Text content */}
                            <div style={{ padding: "1.5rem 1.25rem 1.25rem" }}>
                                {/* Step label */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="text-2xl font-bold"
                                        style={{
                                            color: "var(--primary)",
                                            opacity: 0.25,
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {step.number}
                                    </span>
                                    <span
                                        className="text-[10px] uppercase tracking-[0.15em] font-semibold"
                                        style={{ color: "var(--primary)" }}
                                    >
                                        {t(`how.step.${step.id}.label`)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-lg font-bold text-white leading-snug mb-3"
                                    style={{ letterSpacing: "-0.01em" }}
                                >
                                    {t(`how.step.${step.id}.title`)}
                                </h3>

                                {/* Description */}
                                <p
                                    className="text-sm leading-relaxed mb-4"
                                    style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}
                                >
                                    {t(`how.step.${step.id}.desc`)}
                                </p>

                                {/* Bullets */}
                                <ul className="space-y-2 mb-0">
                                    {step.bullets.map((_bullet, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2.5 text-sm"
                                            style={{ color: "rgba(255,255,255,0.6)" }}
                                        >
                                            <span
                                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{ background: "var(--primary)", opacity: 0.7 }}
                                            />
                                            {t(`how.step.${step.id}.bullet.${i}`)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

                            {/* Operational panel — compact */}
                            <div style={{ padding: "1.25rem" }}>
                                <MobileOperationalPanel step={step} />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Swipe hint ── */}
                {activeStep < 3 && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setActiveStep(prev => Math.min(3, prev + 1))}
                            className="flex items-center gap-2 text-xs font-medium transition-all"
                            style={{
                                color: "rgba(255,255,255,0.3)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "8px 16px",
                            }}
                        >
                            {t("how.next_step", "Siguiente paso")}
                            <ArrowRight size={14} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

/* ── Mobile Operational Panel (compact) ── */
function MobileOperationalPanel({ step }: { step: (typeof STEPS)[number] }) {
    const { t } = useI18n();
    return (
        <div>
            {/* Status + Route row */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {step.panel.origin}
                    </span>
                    <ArrowRight size={12} style={{ color: "var(--primary)", opacity: 0.4 }} />
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {step.panel.destination}
                    </span>
                </div>
                <StatusBadge text={t(`how.step.${step.id}.status`)} color={step.panel.statusColor} />
            </div>

            {/* Process nodes — compact horizontal */}
            <div className="flex items-center gap-0 mb-3">
                {step.panel.nodes.map((nodeKey, i) => (
                    <div key={nodeKey} className="flex items-center" style={{ flex: 1 }}>
                        <div className="flex flex-col items-center" style={{ minWidth: 0, flex: "0 0 auto" }}>
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center mb-1"
                                style={{
                                    background: i <= step.panel.activeConnection
                                        ? "rgba(43,192,255,0.1)"
                                        : "rgba(255,255,255,0.03)",
                                    border: `1px solid ${i <= step.panel.activeConnection
                                        ? "rgba(43,192,255,0.25)"
                                        : "rgba(255,255,255,0.06)"
                                        }`,
                                    color: i <= step.panel.activeConnection
                                        ? "var(--primary)"
                                        : "rgba(255,255,255,0.25)",
                                }}
                            >
                                {React.cloneElement(NODE_ICONS[nodeKey] as React.ReactElement<{ size: number }>, { size: 14 })}
                            </div>
                            <span
                                className="text-[8px] text-center font-medium leading-tight"
                                style={{
                                    color: i <= step.panel.activeConnection
                                        ? "rgba(255,255,255,0.55)"
                                        : "rgba(255,255,255,0.2)",
                                    maxWidth: 60,
                                }}
                            >
                                {t(`how.node.${nodeKey}`)}
                            </span>
                        </div>
                        {i < step.panel.nodes.length - 1 && (
                            <div className="flex-1 mx-1.5">
                                <div
                                    className="h-px"
                                    style={{
                                        background: i < step.panel.activeConnection
                                            ? "linear-gradient(to right, rgba(43,192,255,0.4), rgba(43,192,255,0.15))"
                                            : "rgba(255,255,255,0.06)",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Badges — compact */}
            <div className="space-y-1.5">
                {step.panel.badges.map((badge) => (
                    <div
                        key={badge.text}
                        className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg"
                        style={{
                            background: badge.done
                                ? "rgba(255,255,255,0.025)"
                                : "rgba(43,192,255,0.04)",
                            border: `1px solid ${badge.done
                                ? "rgba(255,255,255,0.04)"
                                : "rgba(43,192,255,0.12)"
                                }`,
                        }}
                    >
                        <div
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                                background: badge.done
                                    ? "rgba(34,197,94,0.15)"
                                    : "rgba(43,192,255,0.1)",
                            }}
                        >
                            {badge.done ? (
                                <CircleCheckBig size={10} style={{ color: "#22c55e" }} />
                            ) : (
                                <div
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{ background: "var(--primary)" }}
                                />
                            )}
                        </div>
                        <span
                            className="text-[11px] font-medium"
                            style={{
                                color: badge.done
                                    ? "rgba(255,255,255,0.5)"
                                    : "rgba(255,255,255,0.75)",
                            }}
                        >
                            {t(`how.step.${step.id}.badge.${step.panel.badges.indexOf(badge)}`)}
                        </span>
                        {!badge.done && (
                            <span
                                className="ml-auto text-[9px] uppercase tracking-wider font-semibold"
                                style={{ color: "var(--primary)", opacity: 0.7 }}
                            >
                                {t("how.in_progress", "En curso")}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   DESKTOP VERSION — Scroll-driven sticky (original)
   ══════════════════════════════════════════════════════════ */
function DesktopHowItWorks() {
    const { t } = useI18n();
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const stepRaw = useTransform(scrollYProgress, [0, 1], [0, 3.99]);

    const handleStepClick = (stepIndex: number) => {
        if (!sectionRef.current) return;
        const sectionTop = sectionRef.current.offsetTop;
        const sectionHeight = sectionRef.current.scrollHeight - window.innerHeight;
        const targetScroll = sectionTop + (stepIndex / 3.99) * sectionHeight;
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
    };

    return (
        <section
            ref={sectionRef}
            id="how-it-works"
            style={{ height: "350vh" }}
            className="relative"
        >
            {/* Sticky container */}
            <div
                className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
                style={{ background: "#050b1f" }}
            >
                {/* Ambient glows */}
                <div
                    className="ambient-glow"
                    style={{
                        width: 600, height: 600,
                        top: "-10%", left: "5%",
                        background: "rgba(43, 192, 255, 0.015)",
                    }}
                />
                <div
                    className="ambient-glow"
                    style={{
                        width: 400, height: 400,
                        bottom: "5%", right: "10%",
                        background: "rgba(43, 192, 255, 0.01)",
                    }}
                />

                {/* Scroll hint */}
                <motion.div
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <span
                        className="text-[10px] uppercase tracking-[0.15em] font-semibold"
                        style={{
                            color: "rgba(255,255,255,0.25)",
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                        }}
                    >
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.2)" }} />
                    </motion.div>
                    <div
                        style={{
                            width: "1px",
                            height: "40px",
                            background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)",
                        }}
                    />
                </motion.div>

                <div
                    className="relative z-10 max-w-7xl mx-auto w-full"
                    style={{ padding: "3.5rem 1.5rem 1.5rem" }}
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2
                            className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight"
                            style={{ letterSpacing: "-0.02em" }}
                        >
                            {t("how.title")}
                        </h2>
                        <p
                            className="mt-3 text-base"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                            {t("how.subtitle")}
                        </p>
                    </div>

                    {/* Main panel */}
                    <DesktopStepContent stepProgress={stepRaw} onStepClick={handleStepClick} />
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   Desktop Step Content — reads motion value
   ═══════════════════════════════════════════════ */
function DesktopStepContent({
    stepProgress,
    onStepClick,
}: {
    stepProgress: ReturnType<typeof useTransform<number, number>>;
    onStepClick: (stepIndex: number) => void;
}) {
    const { t } = useI18n();
    const activeStep = useRoundedMotionValue(stepProgress);
    const step = STEPS[activeStep] ?? STEPS[0];

    return (
        <>
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(145deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow:
                        "0 4px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 60px rgba(0,0,0,0.15)",
                    minHeight: "min(60vh, 480px)",
                }}
            >
                <div className="flex flex-col lg:flex-row h-full" style={{ minHeight: "min(60vh, 480px)" }}>
                    {/* Left: text */}
                    <div
                        className="lg:w-[45%] flex flex-col justify-center"
                        style={{
                            padding: "2rem 2rem",
                            borderRight: "1px solid rgba(255,255,255,0.04)",
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step.id}
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <motion.div
                                    variants={fadeSlideUp}
                                    transition={{ duration: 0.4 }}
                                    className="flex items-center gap-3 mb-6"
                                >
                                    <span
                                        className="text-4xl font-bold"
                                        style={{
                                            color: "var(--primary)",
                                            opacity: 0.25,
                                            fontVariantNumeric: "tabular-nums",
                                            letterSpacing: "-0.04em",
                                        }}
                                    >
                                        {step.number}
                                    </span>
                                    <span
                                        className="text-xs uppercase tracking-[0.15em] font-semibold"
                                        style={{ color: "var(--primary)" }}
                                    >
                                        {t(`how.step.${step.id}.label`)}
                                    </span>
                                </motion.div>

                                <motion.h3
                                    variants={fadeSlideUp}
                                    transition={{ duration: 0.4, delay: 0.05 }}
                                    className="text-xl lg:text-2xl font-bold text-white leading-snug mb-4"
                                    style={{ letterSpacing: "-0.01em" }}
                                >
                                    {t(`how.step.${step.id}.title`)}
                                </motion.h3>

                                <motion.p
                                    variants={fadeSlideUp}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="text-sm leading-relaxed mb-6"
                                    style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
                                >
                                    {t(`how.step.${step.id}.desc`)}
                                </motion.p>

                                <motion.ul className="space-y-3" variants={staggerContainer}>
                                    {step.bullets.map((_bullet, i) => (
                                        <motion.li
                                            key={i}
                                            variants={fadeSlideUp}
                                            transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                                            className="flex items-start gap-3 text-sm"
                                            style={{ color: "rgba(255,255,255,0.6)" }}
                                        >
                                            <span
                                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{ background: "var(--primary)", opacity: 0.7 }}
                                            />
                                            {t(`how.step.${step.id}.bullet.${i}`)}
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: operational panel */}
                    <div
                        className="lg:w-[55%] flex items-center justify-center"
                        style={{ padding: "2rem 2rem" }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.45 }}
                                className="w-full"
                            >
                                <DesktopOperationalPanel step={step} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Stepper */}
            <DesktopStepper activeStep={activeStep} onStepClick={onStepClick} />
        </>
    );
}

/* ═══════════════════════════════════════════════
   Desktop Operational Panel
   ═══════════════════════════════════════════════ */
function DesktopOperationalPanel({ step }: { step: (typeof STEPS)[number] }) {
    const { t } = useI18n();
    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Header */}
            <div
                className="flex items-center justify-end mb-5 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
                <StatusBadge text={t(`how.step.${step.id}.status`)} color={step.panel.statusColor} />
            </div>

            {/* Route info */}
            <div
                className="rounded-xl p-4 mb-5"
                style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {t("how.panel.origin")}
                        </p>
                        <p className="text-sm font-semibold text-white">{step.panel.origin}</p>
                    </div>
                    <div className="flex items-center gap-2 px-4">
                        <div className="h-px flex-1" style={{ width: 40, background: "linear-gradient(to right, rgba(255,255,255,0.1), rgba(43,192,255,0.3), rgba(255,255,255,0.1))" }} />
                        <ArrowRight size={14} style={{ color: "var(--primary)", opacity: 0.5 }} />
                        <div className="h-px flex-1" style={{ width: 40, background: "linear-gradient(to right, rgba(255,255,255,0.1), rgba(43,192,255,0.3), rgba(255,255,255,0.1))" }} />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {t("how.panel.destination")}
                        </p>
                        <p className="text-sm font-semibold text-white">{step.panel.destination}</p>
                    </div>
                </div>
            </div>

            {/* Process nodes */}
            <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {t("how.panel.status_label")}
                </p>
                <div className="flex items-center gap-0">
                    {step.panel.nodes.map((nodeKey, i) => (
                        <div key={nodeKey} className="flex items-center" style={{ flex: 1 }}>
                            <ProcessNode
                                icon={NODE_ICONS[nodeKey]}
                                label={t(`how.node.${nodeKey}`)}
                                isActive={i <= step.panel.activeConnection}
                                isLast={i === step.panel.nodes.length - 1}
                                delay={i * 0.12}
                            />
                            {i < step.panel.nodes.length - 1 && (
                                <div className="flex-1 mx-1">
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                                        className="h-px origin-left"
                                        style={{
                                            background: i < step.panel.activeConnection
                                                ? "linear-gradient(to right, rgba(43,192,255,0.4), rgba(43,192,255,0.15))"
                                                : "rgba(255,255,255,0.06)",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Badges */}
            <div className="space-y-2">
                {step.panel.badges.map((badge, i) => (
                    <motion.div
                        key={badge.text}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-2.5 py-2 px-3 rounded-lg"
                        style={{
                            background: badge.done ? "rgba(255,255,255,0.025)" : "rgba(43,192,255,0.04)",
                            border: `1px solid ${badge.done ? "rgba(255,255,255,0.04)" : "rgba(43,192,255,0.12)"}`,
                        }}
                    >
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                                background: badge.done ? "rgba(34,197,94,0.15)" : "rgba(43,192,255,0.1)",
                            }}
                        >
                            {badge.done ? (
                                <CircleCheckBig size={12} style={{ color: "#22c55e" }} />
                            ) : (
                                <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: "var(--primary)" }}
                                />
                            )}
                        </div>
                        <span
                            className="text-xs font-medium"
                            style={{ color: badge.done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.75)" }}
                        >
                            {t(`how.step.${step.id}.badge.${i}`)}
                        </span>
                        {!badge.done && (
                            <span
                                className="ml-auto text-[10px] uppercase tracking-wider font-semibold"
                                style={{ color: "var(--primary)", opacity: 0.7 }}
                            >
                                {t("how.in_progress", "En curso")}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   Process Node
   ═══════════════════════════════════════════════ */
function ProcessNode({
    icon,
    label,
    isActive,
    isLast,
    delay,
}: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isLast: boolean;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="flex flex-col items-center"
            style={{ minWidth: isLast ? "auto" : undefined }}
        >
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-500"
                style={{
                    background: isActive ? "rgba(43,192,255,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(43,192,255,0.25)" : "rgba(255,255,255,0.06)"}`,
                    color: isActive ? "var(--primary)" : "rgba(255,255,255,0.25)",
                    boxShadow: isActive ? "0 0 20px rgba(43,192,255,0.08)" : "none",
                }}
            >
                {icon}
            </div>
            <span
                className="text-[10px] text-center font-medium leading-tight transition-colors duration-500"
                style={{
                    color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
                    maxWidth: 72,
                }}
            >
                {label}
            </span>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════
   Status Badge
   ═══════════════════════════════════════════════ */
function StatusBadge({ text, color }: { text: string; color: string }) {
    return (
        <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
                background: `${color}10`,
                border: `1px solid ${color}25`,
            }}
        >
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: color }}
            />
            <span className="text-xs font-semibold" style={{ color }}>
                {text}
            </span>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   Desktop Stepper
   ═══════════════════════════════════════════════ */
function DesktopStepper({ activeStep, onStepClick }: { activeStep: number; onStepClick: (stepIndex: number) => void }) {
    const { t } = useI18n();
    return (
        <div className="mt-4 mx-auto max-w-3xl">
            <div className="flex items-center">
                {STEPS.map((step, i) => {
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;

                    return (
                        <div key={step.id} className="flex items-center" style={{ flex: 1 }}>
                            <button
                                onClick={() => onStepClick(i)}
                                className="flex flex-col items-center group"
                                style={{ minWidth: 80, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                aria-label={`Ir al paso ${step.number}: ${step.label}`}
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-500 group-hover:scale-110"
                                    style={{
                                        background: isActive
                                            ? "rgba(43,192,255,0.15)"
                                            : isDone
                                                ? "rgba(34,197,94,0.1)"
                                                : "rgba(255,255,255,0.03)",
                                        border: `1.5px solid ${isActive
                                            ? "rgba(43,192,255,0.4)"
                                            : isDone
                                                ? "rgba(34,197,94,0.25)"
                                                : "rgba(255,255,255,0.06)"
                                            }`,
                                        boxShadow: isActive ? "0 0 16px rgba(43,192,255,0.15)" : "none",
                                    }}
                                >
                                    {isDone ? (
                                        <CircleCheckBig size={14} style={{ color: "#22c55e" }} />
                                    ) : (
                                        <span
                                            className="text-[11px] font-bold"
                                            style={{
                                                color: isActive ? "var(--primary)" : "rgba(255,255,255,0.2)",
                                                fontVariantNumeric: "tabular-nums",
                                            }}
                                        >
                                            {step.number}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className="text-[11px] font-semibold transition-colors duration-500 text-center group-hover:text-[rgba(255,255,255,0.7)]"
                                    style={{
                                        color: isActive
                                            ? "var(--primary)"
                                            : isDone
                                                ? "rgba(255,255,255,0.45)"
                                                : "rgba(255,255,255,0.2)",
                                    }}
                                >
                                    {t(`how.step.${step.id}.label`)}
                                </span>
                            </button>

                            {i < STEPS.length - 1 && (
                                <div className="flex-1 mx-2 mb-6">
                                    <div
                                        className="h-px w-full relative overflow-hidden rounded"
                                        style={{ background: "rgba(255,255,255,0.06)" }}
                                    >
                                        <motion.div
                                            className="absolute inset-y-0 left-0 rounded"
                                            style={{
                                                background: isDone
                                                    ? "rgba(34,197,94,0.4)"
                                                    : isActive
                                                        ? "linear-gradient(to right, rgba(43,192,255,0.5), rgba(43,192,255,0.1))"
                                                        : "transparent",
                                            }}
                                            initial={{ width: "0%" }}
                                            animate={{
                                                width: isDone ? "100%" : isActive ? "50%" : "0%",
                                            }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   Hook: useRoundedMotionValue
   ═══════════════════════════════════════════════ */
function useRoundedMotionValue(
    mv: ReturnType<typeof useTransform<number, number>>
): number {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
        const unsubscribe = mv.on("change", (latest: number) => {
            setValue(Math.min(3, Math.max(0, Math.round(latest))));
        });
        return unsubscribe;
    }, [mv]);
    return value;
}
