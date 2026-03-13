"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ServiceLandingData } from "./types";

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;

/* Scoped CSS for the tech grid — only this section */
const BENEFITS_STYLES = `
    .benefits-grid-bg {
        background-image:
            repeating-linear-gradient(
                0deg,
                transparent,
                transparent 63px,
                rgba(43, 192, 255, 0.04) 63px,
                rgba(43, 192, 255, 0.04) 64px
            ),
            repeating-linear-gradient(
                90deg,
                transparent,
                transparent 63px,
                rgba(43, 192, 255, 0.04) 63px,
                rgba(43, 192, 255, 0.04) 64px
            );
        mask-image: radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0.55) 0%, transparent 75%);
        -webkit-mask-image: radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0.55) 0%, transparent 75%);
    }
`;

/* ═══════════════════════════════════════════════════════
   SERVICE BENEFITS — Special visual treatment section
   Grid tech + radial glows + staggered scroll reveal
   ═══════════════════════════════════════════════════════ */
export default function ServiceBenefits({
    data,
}: {
    data: ServiceLandingData["benefits"];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <section
            ref={ref}
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-deep)",
                paddingTop: "clamp(3.5rem, 6vw, 7rem)",
                paddingBottom: "clamp(3.5rem, 6vw, 7rem)",
            }}
        >
            <style>{BENEFITS_STYLES}</style>

            {/* ── Layer 2: Tech grid overlay ── */}
            <div
                className="absolute inset-0 pointer-events-none benefits-grid-bg"
                style={{ zIndex: 0 }}
            />

            {/* ── Layer 3: Radial glows ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 0,
                    background: [
                        "radial-gradient(ellipse 55% 45% at 50% 20%, rgba(0,150,255,0.06) 0%, transparent 65%)",
                        "radial-gradient(ellipse 40% 50% at 10% 70%, rgba(29,161,255,0.035) 0%, transparent 55%)",
                        "radial-gradient(ellipse 35% 40% at 90% 60%, rgba(43,192,255,0.025) 0%, transparent 50%)",
                    ].join(", "),
                }}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative" style={{ zIndex: 1 }}>
                {/* Section header — staggered entry */}
                <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
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
                        initial={{ opacity: 0, y: 28 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                            duration: 0.45,
                            delay: 0.08,
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

                {/* Cards grid — staggered reveal with floating offsets */}
                <div
                    className="grid gap-4 md:gap-5"
                    style={{
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                    }}
                >
                    {data.items.map((item, i) => {
                        const Icon = item.icon;
                        const isHero = i === 0;
                        /* Slight vertical offsets for floating composition */
                        const floatOffsets = [0, -6, 4, -3, 8];
                        const yOffset = floatOffsets[i % floatOffsets.length];

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: yOffset }
                                        : {}
                                }
                                transition={{
                                    duration: 0.4,
                                    delay: 0.15 + i * 0.08,
                                    ease: EASE_OUT,
                                }}
                                whileHover={{
                                    y: yOffset - 4,
                                    borderColor: isHero
                                        ? "rgba(43,192,255,0.25)"
                                        : "rgba(43,192,255,0.15)",
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 20px rgba(43,192,255,0.06)",
                                    transition: { duration: 0.2 },
                                }}
                                className={isHero ? "md:col-span-2" : ""}
                                style={{
                                    padding: isHero
                                        ? "clamp(1.5rem, 2.5vw, 2rem)"
                                        : "clamp(1.25rem, 2vw, 1.75rem)",
                                    borderRadius: "16px",
                                    background: isHero
                                        ? "linear-gradient(165deg, rgba(14,38,68,0.6) 0%, rgba(8,20,42,0.75) 100%)"
                                        : "linear-gradient(165deg, rgba(11,31,58,0.5) 0%, rgba(8,20,42,0.7) 100%)",
                                    border: isHero
                                        ? "1px solid rgba(43,192,255,0.12)"
                                        : "1px solid rgba(255,255,255,0.06)",
                                    boxShadow: isHero
                                        ? "0 4px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(43,192,255,0.04)"
                                        : "0 2px 20px rgba(0,0,0,0.15)",
                                    cursor: "default",
                                    backdropFilter: "blur(8px)",
                                    WebkitBackdropFilter: "blur(8px)",
                                }}
                            >
                                {/* Icon */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{
                                        duration: 0.3,
                                        delay: 0.25 + i * 0.08,
                                        ease: EASE_OUT,
                                    }}
                                    style={{
                                        width: isHero ? "48px" : "44px",
                                        height: isHero ? "48px" : "44px",
                                        borderRadius: "12px",
                                        background: isHero
                                            ? "rgba(43,192,255,0.1)"
                                            : "rgba(43,192,255,0.07)",
                                        border: "1px solid rgba(43,192,255,0.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: isHero ? "18px" : "16px",
                                    }}
                                >
                                    <Icon
                                        size={isHero ? 22 : 20}
                                        style={{ color: "#2BC0FF" }}
                                    />
                                </motion.div>

                                {/* Title */}
                                <h3
                                    style={{
                                        fontSize: isHero ? "18px" : "16px",
                                        fontWeight: 700,
                                        color: "#FFFFFF",
                                        marginBottom: "8px",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: 1.65,
                                        color: isHero
                                            ? "rgba(255,255,255,0.5)"
                                            : "rgba(255,255,255,0.45)",
                                        maxWidth: isHero ? "540px" : undefined,
                                    }}
                                >
                                    {item.description}
                                </p>

                                {/* Optional link */}
                                {item.link && (
                                    <a
                                        href={item.link.href}
                                        style={{
                                            display: "inline-block",
                                            marginTop: "10px",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "#2BC0FF",
                                            textDecoration: "none",
                                            transition: "opacity 0.2s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                                    >
                                        {item.link.label}
                                    </a>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
