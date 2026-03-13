"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ServiceLandingData } from "./types";

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;

/* ═══════════════════════════════════════════════════════
   SERVICE IDEAL FOR — Customer profiles
   ═══════════════════════════════════════════════════════ */
export default function ServiceIdealFor({
    data,
}: {
    data: ServiceLandingData["idealFor"];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });

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
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
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

                {/* Profiles grid — first row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {data.profiles.slice(0, 3).map((profile, i) => {
                        const Icon = profile.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 14 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0 }
                                        : {}
                                }
                                transition={{
                                    duration: 0.4,
                                    delay: 0.15 + i * 0.06,
                                    ease: EASE_OUT,
                                }}
                                whileHover={{
                                    y: -2,
                                    borderColor: "rgba(43,192,255,0.12)",
                                    transition: { duration: 0.2 },
                                }}
                                className="flex items-start gap-4"
                                style={{
                                    padding: "clamp(1rem, 2vw, 1.5rem)",
                                    borderRadius: "14px",
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    cursor: "default",
                                }}
                            >
                                <div
                                    style={{
                                        width: "38px",
                                        height: "38px",
                                        borderRadius: "10px",
                                        background: "rgba(43,192,255,0.07)",
                                        border: "1px solid rgba(43,192,255,0.12)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Icon
                                        size={17}
                                        style={{ color: "#2BC0FF" }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div
                                        style={{
                                            fontSize: "15px",
                                            fontWeight: 600,
                                            color: "#FFFFFF",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {profile.label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "13px",
                                            lineHeight: 1.6,
                                            color: "rgba(255,255,255,0.4)",
                                        }}
                                    >
                                        {profile.description}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Profiles — second row centered */}
                {data.profiles.length > 3 && (
                    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mt-4 justify-center">
                        {data.profiles.slice(3).map((profile, i) => {
                            const Icon = profile.icon;
                            return (
                                <motion.div
                                    key={i + 3}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={
                                        isInView
                                            ? { opacity: 1, y: 0 }
                                            : {}
                                    }
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.15 + (i + 3) * 0.06,
                                        ease: EASE_OUT,
                                    }}
                                    whileHover={{
                                        y: -2,
                                        borderColor: "rgba(43,192,255,0.12)",
                                        transition: { duration: 0.2 },
                                    }}
                                    className="flex items-start gap-4 flex-1"
                                    style={{
                                        padding: "clamp(1rem, 2vw, 1.5rem)",
                                        borderRadius: "14px",
                                        background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        cursor: "default",
                                        maxWidth: "380px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "38px",
                                            height: "38px",
                                            borderRadius: "10px",
                                            background: "rgba(43,192,255,0.07)",
                                            border: "1px solid rgba(43,192,255,0.12)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Icon
                                            size={17}
                                            style={{ color: "#2BC0FF" }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: 600,
                                                color: "#FFFFFF",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            {profile.label}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "13px",
                                                lineHeight: 1.6,
                                                color: "rgba(255,255,255,0.4)",
                                            }}
                                        >
                                            {profile.description}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
