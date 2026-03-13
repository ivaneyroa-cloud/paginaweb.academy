"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ServiceLandingData } from "./types";

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;

/* ═══════════════════════════════════════════════════════
   SERVICE CTA — Final call-to-action block
   ═══════════════════════════════════════════════════════ */
export default function ServiceCTA({
    data,
}: {
    data: ServiceLandingData["cta"];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section
            ref={ref}
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-deep)",
                paddingTop: "clamp(2rem, 4vw, 4rem)",
                paddingBottom: "clamp(4rem, 6vw, 8rem)",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={
                        isInView
                            ? { opacity: 1, y: 0, scale: 1 }
                            : {}
                    }
                    transition={{
                        duration: 0.6,
                        ease: EASE_OUT,
                    }}
                    className="relative text-center"
                    style={{
                        padding:
                            "clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)",
                        borderRadius: "20px",
                        background:
                            "linear-gradient(165deg, rgba(11,31,58,0.7) 0%, rgba(8,20,42,0.85) 50%, rgba(6,15,35,0.9) 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow:
                            "0 8px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                        overflow: "hidden",
                    }}
                >
                    {/* Inner glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(43,192,255,0.025) 0%, transparent 70%)",
                        }}
                    />

                    {/* Gradient accent line at top */}
                    <div
                        className="absolute top-0 left-[20%] right-[20%]"
                        style={{
                            height: "1px",
                            background:
                                "linear-gradient(to right, transparent, rgba(43,192,255,0.2), transparent)",
                        }}
                    />

                    <div className="relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : {}
                            }
                            transition={{
                                duration: 0.5,
                                delay: 0.1,
                                ease: EASE_OUT,
                            }}
                            style={{
                                fontSize: "clamp(22px, 4vw, 34px)",
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                lineHeight: 1.2,
                                color: "#FFFFFF",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}
                        >
                            {data.title}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : {}
                            }
                            transition={{
                                duration: 0.5,
                                delay: 0.2,
                                ease: EASE_OUT,
                            }}
                            style={{
                                fontSize: "clamp(14px, 2vw, 16px)",
                                lineHeight: 1.7,
                                color: "rgba(255,255,255,0.5)",
                                maxWidth: "480px",
                                margin: "16px auto 0",
                            }}
                        >
                            {data.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : {}
                            }
                            transition={{
                                duration: 0.5,
                                delay: 0.3,
                                ease: EASE_OUT,
                            }}
                            className="mt-8"
                        >
                            <motion.a
                                href={data.ctaHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{
                                    y: -2,
                                    boxShadow:
                                        "0 8px 32px rgba(43,192,255,0.35)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                    fontWeight: 600,
                                    fontSize: "15px",
                                    padding: "16px 36px",
                                    minHeight: "52px",
                                    boxShadow:
                                        "0 4px 24px rgba(43,192,255,0.25)",
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
                                    {data.ctaLabel}
                                    <ArrowRight size={16} />
                                </span>
                            </motion.a>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
