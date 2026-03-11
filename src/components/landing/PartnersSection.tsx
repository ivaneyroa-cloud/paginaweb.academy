"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ══════════════════════════════════════════════════════════
   PROCESO — Visual pipeline showing how Shippar orchestrates
   Alibaba → SF Express → OpenAI → UPS → Shippar
   Connected by animated lines, each step reveals its role.
   ══════════════════════════════════════════════════════════ */

const STEPS = [
    {
        id: "alibaba",
        name: "Alibaba",
        logo: "/logos/alibaba_clean.png",
        title: "Proveedores verificados",
        desc: "Contacto directo con fábricas verificadas. Comprás en origen de manera 100% virtual.",
        accent: "#FF6A00",
    },
    {
        id: "sfexpress",
        name: "SF Express",
        logo: "/logos/sfexpress_clean.png",
        title: "Recolección en China",
        desc: "Recolección remota en cualquier ciudad de China. Gestionamos los envíos internos con tu proveedor.",
        accent: "#FF0000",
    },
    {
        id: "openai",
        name: "OpenAI",
        logo: "/logos/openai_white.png",
        title: "Logística con IA",
        desc: "Seguimiento 100% real, cotizaciones instantáneas, asistencia y traducción en nuestro panel. Todo potenciado por IA.",
        accent: "#10A37F",
    },
    {
        id: "ups",
        name: "UPS",
        logo: "/logos/ups_clean.png",
        title: "Red global de envíos",
        desc: "La red más grande del mundo, al servicio de tu envío. Cobertura internacional al mejor costo.",
        accent: "#FFB500",
    },
    {
        id: "shippar",
        name: "Shippar",
        logo: "/shippar-logo.png",
        title: "Tu solución integral",
        desc: "Tu aliado de confianza, centralizando todo lo anterior en una solución integral para vos.",
        accent: "#2BC0FF",
    },
];

const AUTO_INTERVAL = 4000;

export default function PartnersSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const [activeStep, setActiveStep] = useState(-1);
    const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    /* ── Auto-play when in view: reveal steps one by one ── */
    useEffect(() => {
        if (!isInView || hasAutoPlayed) return;
        setHasAutoPlayed(true);

        STEPS.forEach((_, i) => {
            const timer = setTimeout(() => setActiveStep(i), i * AUTO_INTERVAL);
            timersRef.current.push(timer);
        });

        return () => {
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
        };
    }, [isInView, hasAutoPlayed]);

    /* ── Handle manual click ── */
    const handleClick = (index: number) => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
        setActiveStep(index);
    };

    return (
        <section
            ref={ref}
            id="infrastructure"
            className="py-24 px-4 relative overflow-hidden"
            style={{ background: "#050b1f" }}
        >
            {/* Ambient glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: "800px", height: "800px",
                    top: "-300px", left: "50%", transform: "translateX(-50%)",
                    background: "radial-gradient(circle, rgba(43,192,255,0.03) 0%, transparent 70%)",
                    borderRadius: "50%",
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* ── Title ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p
                        className="text-xs uppercase tracking-widest mb-3"
                        style={{ color: "rgba(255,255,255,0.35)", fontWeight: 600 }}
                    >
                        Nuestro proceso
                    </p>
                    <h2
                        className="text-3xl sm:text-4xl mb-3"
                        style={{ color: "#FFFFFF", fontWeight: 800, letterSpacing: "-0.02em" }}
                    >
                        Infraestructura que hace posible cada envío
                    </h2>
                    <p
                        className="text-base max-w-lg mx-auto"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                        Cada eslabón de la cadena, conectado para que vos no tengas que preocuparte por nada.
                    </p>
                </motion.div>

                {/* ── Pipeline: horizontal on desktop, vertical on mobile ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {/* Desktop: horizontal pipeline */}
                    <div className="hidden lg:block">
                        <div className="flex items-start justify-between relative" style={{ padding: "0 20px" }}>
                            {/* Ultra-thin connecting line — well below logos */}
                            <div
                                className="absolute"
                                style={{
                                    top: "90px",
                                    left: "15%",
                                    right: "15%",
                                    height: "1px",
                                    background: "rgba(255,255,255,0.06)",
                                    zIndex: 0,
                                }}
                            >
                                {/* Animated progress line */}
                                <div
                                    style={{
                                        height: "100%",
                                        background: "linear-gradient(90deg, #2BC0FF, #10A37F, #FFB500, #2BC0FF)",
                                        borderRadius: "999px",
                                        width: activeStep >= 0
                                            ? `${Math.min(((activeStep) / (STEPS.length - 1)) * 100, 100)}%`
                                            : "0%",
                                        transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                        opacity: 0.6,
                                    }}
                                />
                            </div>

                            {STEPS.map((step, i) => {
                                const isReached = activeStep >= i;
                                const isCurrent = activeStep === i;

                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => handleClick(i)}
                                        className="relative z-10 flex flex-col items-center cursor-pointer group"
                                        style={{
                                            flex: 1,
                                            background: "none",
                                            border: "none",
                                            padding: "0 8px",
                                        }}
                                    >
                                        {/* Logo — no circle, clean display */}
                                        <div
                                            className="relative mb-4"
                                            style={{
                                                width: "72px",
                                                height: "72px",
                                                filter: isReached ? "grayscale(0%)" : "grayscale(100%)",
                                                opacity: isReached ? 1 : 0.25,
                                                transition: "all 0.6s ease",
                                                transform: isCurrent ? "scale(1.1)" : "scale(1)",
                                            }}
                                        >
                                            <Image
                                                src={step.logo}
                                                alt={step.name}
                                                fill
                                                className="object-contain"
                                                sizes="72px"
                                            />
                                        </div>

                                        {/* Step name */}
                                        <span
                                            className="text-xs font-semibold tracking-wide"
                                            style={{
                                                color: isCurrent
                                                    ? "#fff"
                                                    : isReached
                                                        ? "rgba(255,255,255,0.6)"
                                                        : "rgba(255,255,255,0.2)",
                                                transition: "color 0.6s",
                                            }}
                                        >
                                            {step.name}
                                        </span>

                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile: vertical pipeline */}
                    <div className="lg:hidden">
                        <div className="relative pl-12">
                            {/* Vertical line */}
                            <div
                                className="absolute left-[23px] top-0 bottom-0"
                                style={{
                                    width: "2px",
                                    background: "rgba(255,255,255,0.06)",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        background: "linear-gradient(180deg, #2BC0FF, #10A37F, #FFB500, #2BC0FF)",
                                        height: activeStep >= 0
                                            ? `${Math.min(((activeStep) / (STEPS.length - 1)) * 100, 100)}%`
                                            : "0%",
                                        transition: "height 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                        boxShadow: "0 0 12px rgba(43,192,255,0.3)",
                                    }}
                                />
                            </div>

                            {STEPS.map((step, i) => {
                                const isReached = activeStep >= i;
                                const isCurrent = activeStep === i;

                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => handleClick(i)}
                                        className="relative flex items-start gap-4 cursor-pointer text-left w-full"
                                        style={{
                                            background: "none",
                                            border: "none",
                                            padding: "0 0 2rem 0",
                                        }}
                                    >
                                        {/* Node dot */}
                                        <div
                                            className="absolute flex items-center justify-center rounded-full"
                                            style={{
                                                left: "-25px",
                                                top: "4px",
                                                width: "48px",
                                                height: "48px",
                                                background: isCurrent
                                                    ? "rgba(43,192,255,0.08)"
                                                    : "rgba(255,255,255,0.02)",
                                                border: `2px solid ${isCurrent
                                                    ? step.accent
                                                    : isReached
                                                        ? "rgba(255,255,255,0.12)"
                                                        : "rgba(255,255,255,0.06)"
                                                    }`,
                                                transition: "all 0.6s ease",
                                                boxShadow: isCurrent
                                                    ? `0 0 16px ${step.accent}22`
                                                    : "none",
                                            }}
                                        >
                                            <div
                                                className="relative"
                                                style={{
                                                    width: "28px",
                                                    height: "28px",
                                                    filter: isReached ? "grayscale(0%)" : "grayscale(100%)",
                                                    opacity: isReached ? 1 : 0.25,
                                                    transition: "all 0.6s ease",
                                                }}
                                            >
                                                <Image
                                                    src={step.logo}
                                                    alt={step.name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="28px"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <span
                                                className="text-sm font-semibold"
                                                style={{
                                                    color: isCurrent ? "#fff" : isReached ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                                                    transition: "color 0.6s",
                                                }}
                                            >
                                                {step.name}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* ── Description area ── */}
                <div className="mt-12 text-center" style={{ minHeight: "100px" }}>
                    <AnimatePresence mode="wait">
                        {activeStep >= 0 && (
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-lg mx-auto"
                            >

                                <p
                                    className="text-base sm:text-lg leading-relaxed"
                                    style={{ color: "rgba(255,255,255,0.6)" }}
                                >
                                    {STEPS[activeStep].desc}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
