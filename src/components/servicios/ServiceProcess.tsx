"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ServiceLandingData } from "./types";

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;
const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

/* ═══════════════════════════════════════════════════════
   SERVICE PROCESS — "Cómo funciona" step flow
   Mobile: accordion (collapsed), Desktop: full timeline
   ═══════════════════════════════════════════════════════ */
export default function ServiceProcess({
    data,
}: {
    data: ServiceLandingData["process"];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });
    const [openStep, setOpenStep] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <section
            ref={ref}
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-deep)",
                paddingTop: "clamp(3rem, 5vw, 6rem)",
                paddingBottom: "clamp(3rem, 5vw, 6rem)",
            }}
        >
            {/* Ambient glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 600,
                    height: 600,
                    top: "20%",
                    left: "-10%",
                    background:
                        "radial-gradient(circle, rgba(43,192,255,0.012) 0%, transparent 60%)",
                    filter: "blur(40px)",
                }}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                    >
                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "#2BC0FF",
                            }}
                        >
                            {data.eyebrow}
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 14 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                            duration: 0.6,
                            delay: 0.1,
                            ease: EASE_OUT,
                        }}
                        className="mt-4"
                        style={{
                            fontSize: "clamp(24px, 4vw, 36px)",
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                            color: "#FFFFFF",
                        }}
                    >
                        {data.title}
                    </motion.h2>
                </div>

                {/* Steps */}
                <div className="max-w-2xl mx-auto">
                    {data.steps.map((step, i) => (
                        <div key={i} className="relative">
                            {isMobile ? (
                                /* ── MOBILE: Accordion ── */
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05, ease: EASE_OUT }}
                                    style={{
                                        marginBottom: "8px",
                                        borderRadius: "12px",
                                        border: openStep === i
                                            ? "1px solid rgba(43,192,255,0.15)"
                                            : "1px solid rgba(255,255,255,0.06)",
                                        background: openStep === i
                                            ? "rgba(43,192,255,0.04)"
                                            : "rgba(255,255,255,0.02)",
                                        overflow: "hidden",
                                        transition: "border-color 0.2s, background 0.2s",
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenStep(openStep === i ? null : i)}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "14px 16px",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "8px",
                                                background: "rgba(43,192,255,0.07)",
                                                border: "1px solid rgba(43,192,255,0.15)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                color: "#2BC0FF",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span
                                            style={{
                                                flex: 1,
                                                fontSize: "15px",
                                                fontWeight: 600,
                                                color: "#FFFFFF",
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            {step.title}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            style={{
                                                color: "rgba(255,255,255,0.4)",
                                                transform: openStep === i ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s ease",
                                                flexShrink: 0,
                                            }}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {openStep === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: EASE_SMOOTH }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                <p
                                                    style={{
                                                        padding: "0 16px 16px 60px",
                                                        fontSize: "14px",
                                                        lineHeight: 1.65,
                                                        color: "rgba(255,255,255,0.60)",
                                                    }}
                                                >
                                                    {step.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                /* ── DESKTOP: Original timeline ── */
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={
                                        isInView
                                            ? { opacity: 1, x: 0 }
                                            : {}
                                    }
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.15 + i * 0.08,
                                        ease: EASE_OUT,
                                    }}
                                    className="flex gap-5 md:gap-6"
                                >
                                    {/* Left: number + line */}
                                    <div className="flex flex-col items-center flex-shrink-0">
                                        <motion.div
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={
                                                isInView
                                                    ? { scale: 1, opacity: 1 }
                                                    : {}
                                            }
                                            transition={{
                                                duration: 0.35,
                                                delay: 0.2 + i * 0.08,
                                                ease: EASE_OUT,
                                            }}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "12px",
                                                background: "rgba(43,192,255,0.07)",
                                                border: "1px solid rgba(43,192,255,0.15)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "14px",
                                                fontWeight: 700,
                                                color: "#2BC0FF",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </motion.div>

                                        {i < data.steps.length - 1 && (
                                            <motion.div
                                                initial={{ scaleY: 0 }}
                                                animate={isInView ? { scaleY: 1 } : {}}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.3 + i * 0.08,
                                                    ease: EASE_SMOOTH,
                                                }}
                                                style={{
                                                    width: "1px",
                                                    flex: 1,
                                                    minHeight: "32px",
                                                    background:
                                                        "linear-gradient(to bottom, rgba(43,192,255,0.15), rgba(43,192,255,0.04))",
                                                    transformOrigin: "top",
                                                    marginTop: "8px",
                                                    marginBottom: "8px",
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Right: content */}
                                    <div
                                        style={{
                                            paddingTop: "6px",
                                            paddingBottom:
                                                i < data.steps.length - 1
                                                    ? "28px"
                                                    : "0",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "17px",
                                                fontWeight: 700,
                                                color: "#FFFFFF",
                                                marginBottom: "6px",
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            {step.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                lineHeight: 1.65,
                                                color: "rgba(255,255,255,0.60)",
                                                maxWidth: "440px",
                                            }}
                                        >
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
