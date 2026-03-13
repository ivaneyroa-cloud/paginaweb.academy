"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Headset, Activity } from "lucide-react";
import type { ServiceLandingData, FlowNode } from "./types";

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;
const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

/* ── Hero Flow Visual ── */
function HeroFlow({ nodes }: { nodes: FlowNode[] }) {
    return (
        <div className="flex flex-col w-full max-w-[300px] mx-auto lg:mx-0">
            {nodes.map((node, i) => {
                const Icon = node.icon;
                return (
                    <div key={i}>
                        <motion.div
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.35,
                                delay: 0.3 + i * 0.08,
                                ease: EASE_SMOOTH,
                            }}
                            className="flex items-center gap-4"
                            style={{
                                padding: "12px 16px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div
                                style={{
                                    width: "20px",
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    color: "rgba(43,192,255,0.4)",
                                    fontVariantNumeric: "tabular-nums",
                                    flexShrink: 0,
                                    textAlign: "center",
                                }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <div
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "9px",
                                    background: "rgba(43,192,255,0.07)",
                                    border: "1px solid rgba(43,192,255,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Icon size={15} style={{ color: "#2BC0FF" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div
                                    style={{
                                        fontSize: "13px",
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
                                            fontSize: "10px",
                                            fontWeight: 500,
                                            color: "rgba(255,255,255,0.3)",
                                            marginTop: "1px",
                                        }}
                                    >
                                        {node.sublabel}
                                    </div>
                                )}
                            </div>
                            <div
                                className="flow-dot-pulse"
                                style={{
                                    width: "5px",
                                    height: "5px",
                                    borderRadius: "50%",
                                    background: "#2BC0FF",
                                    flexShrink: 0,
                                }}
                            />
                        </motion.div>
                        {i < nodes.length - 1 && (
                            <div
                                className="flex justify-center"
                                style={{ height: "10px" }}
                            >
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: 0.35 + i * 0.08,
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

/* ── Stats Bar — mini dashboard metrics ── */
function StatsBar({
    stats,
    isInView,
}: {
    stats: { value: string; label: string }[];
    isInView: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.25, ease: EASE_OUT }}
            className="grid"
            style={{
                gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
                gap: "0",
                marginBottom: "16px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.015)",
            }}
        >
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                        duration: 0.3,
                        delay: 0.3 + i * 0.06,
                        ease: EASE_OUT,
                    }}
                    className="text-center"
                    style={{
                        padding: "14px 8px",
                        borderRight:
                            i < stats.length - 1
                                ? "1px solid rgba(255,255,255,0.05)"
                                : "none",
                    }}
                >
                    <div
                        style={{
                            fontSize: "18px",
                            fontWeight: 800,
                            background:
                                "linear-gradient(135deg, #FFFFFF, #2BC0FF)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {stat.value}
                    </div>
                    <div
                        style={{
                            fontSize: "9px",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.3)",
                            marginTop: "4px",
                        }}
                    >
                        {stat.label}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════
   SERVICE HERO
   ═══════════════════════════════════════════════════════ */
export default function ServiceHero({
    data,
}: {
    data: ServiceLandingData["hero"];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });
    const hasStats = data.stats && data.stats.length > 0;

    return (
        <section
            ref={ref}
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-deep)",
                paddingTop: "clamp(4rem, 8vw, 8rem)",
                paddingBottom: "clamp(3rem, 6vw, 6rem)",
            }}
        >
            {/* Ambient glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 800,
                    height: 800,
                    top: "-10%",
                    right: "-15%",
                    background:
                        "radial-gradient(ellipse 60% 50%, rgba(43,192,255,0.02) 0%, transparent 60%)",
                    filter: "blur(100px)",
                }}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* LEFT — Content */}
                    <div>
                        {/* Eyebrow */}
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

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                ease: EASE_OUT,
                            }}
                            style={{
                                fontSize: "clamp(28px, 5vw, 48px)",
                                fontWeight: 800,
                                letterSpacing: "-0.025em",
                                lineHeight: 1.1,
                                color: "#FFFFFF",
                                marginTop: "16px",
                            }}
                        >
                            {data.title}{" "}
                            <span
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                {data.titleAccent}
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.5,
                                delay: 0.2,
                                ease: EASE_OUT,
                            }}
                            style={{
                                fontSize: "clamp(15px, 2vw, 17px)",
                                lineHeight: 1.7,
                                color: "#adb9cf",
                                maxWidth: "520px",
                                marginTop: "20px",
                            }}
                        >
                            {data.subtitle}
                        </motion.p>

                        {/* Badges */}
                        {data.badges && data.badges.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.25,
                                    ease: EASE_OUT,
                                }}
                                className="flex flex-wrap gap-2 mt-5"
                            >
                                {data.badges.map((badge, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            color: "#2BC0FF",
                                            background: "rgba(43,192,255,0.08)",
                                            border: "1px solid rgba(43,192,255,0.15)",
                                            borderRadius: "20px",
                                            padding: "6px 14px",
                                            letterSpacing: "0.02em",
                                        }}
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </motion.div>
                        )}

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.5,
                                delay: 0.35,
                                ease: EASE_OUT,
                            }}
                            className="flex flex-col sm:flex-row gap-3 mt-8"
                        >
                            <motion.a
                                href={data.ctaPrimary.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{
                                    y: -2,
                                    boxShadow:
                                        "0 6px 28px rgba(43,192,255,0.3)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    padding: "14px 28px",
                                    minHeight: "48px",
                                    boxShadow:
                                        "0 4px 20px rgba(43,192,255,0.2)",
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
                                    {data.ctaPrimary.label}
                                    <ArrowRight size={15} />
                                </span>
                            </motion.a>

                            <motion.a
                                href={data.ctaSecondary.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{
                                    y: -1,
                                    borderColor: "rgba(255,255,255,0.18)",
                                    backgroundColor:
                                        "rgba(255,255,255,0.06)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: "rgba(255,255,255,0.03)",
                                    color: "rgba(255,255,255,0.65)",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    padding: "14px 24px",
                                    minHeight: "48px",
                                }}
                            >
                                <Headset size={15} />
                                {data.ctaSecondary.label}
                            </motion.a>
                        </motion.div>
                    </div>

                    {/* RIGHT — Dashboard Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={
                            isInView ? { opacity: 1, scale: 1 } : {}
                        }
                        transition={{
                            duration: 0.6,
                            delay: 0.2,
                            ease: EASE_SMOOTH,
                        }}
                        className="flex items-center justify-center lg:justify-end"
                    >
                        <div
                            className="w-full max-w-md"
                            style={{
                                padding: "clamp(1.25rem, 2.5vw, 2rem)",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(165deg, rgba(11,31,58,0.65) 0%, rgba(8,20,42,0.85) 100%)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                boxShadow:
                                    "0 8px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Inner atmosphere */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(43,192,255,0.02) 0%, transparent 65%)",
                                }}
                            />

                            <div className="relative z-10">
                                {/* Dashboard header */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={
                                        isInView ? { opacity: 1 } : {}
                                    }
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.2,
                                    }}
                                    className="flex items-center justify-between mb-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            style={{
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "8px",
                                                background:
                                                    "rgba(43,192,255,0.08)",
                                                border: "1px solid rgba(43,192,255,0.15)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Activity
                                                size={13}
                                                style={{ color: "#2BC0FF" }}
                                            />
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                color: "rgba(255,255,255,0.5)",
                                                letterSpacing: "0.02em",
                                            }}
                                        >
                                            Panel operativo
                                        </span>
                                    </div>

                                    {/* Status badge */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={
                                            isInView
                                                ? { scale: 1, opacity: 1 }
                                                : {}
                                        }
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.4,
                                            ease: EASE_OUT,
                                        }}
                                        className="flex items-center gap-1.5"
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "8px",
                                            background:
                                                "rgba(34,197,94,0.08)",
                                            border: "1px solid rgba(34,197,94,0.18)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "5px",
                                                height: "5px",
                                                borderRadius: "50%",
                                                background: "#22C55E",
                                                boxShadow:
                                                    "0 0 6px rgba(34,197,94,0.4)",
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "10px",
                                                fontWeight: 600,
                                                color: "#22C55E",
                                                letterSpacing: "0.03em",
                                            }}
                                        >
                                            Operativo
                                        </span>
                                    </motion.div>
                                </motion.div>

                                {/* Stats bar (if provided) */}
                                {hasStats && (
                                    <StatsBar
                                        stats={data.stats!}
                                        isInView={isInView}
                                    />
                                )}

                                {/* Divider / label */}
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <div
                                        style={{
                                            height: "1px",
                                            width: "28px",
                                            background:
                                                "linear-gradient(to right, transparent, rgba(255,255,255,0.06))",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "9px",
                                            fontWeight: 600,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase",
                                            color: "rgba(255,255,255,0.2)",
                                        }}
                                    >
                                        Flujo operativo
                                    </span>
                                    <div
                                        style={{
                                            height: "1px",
                                            width: "28px",
                                            background:
                                                "linear-gradient(to left, transparent, rgba(255,255,255,0.06))",
                                        }}
                                    />
                                </div>

                                {/* Flow nodes */}
                                <HeroFlow nodes={data.flowNodes} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
