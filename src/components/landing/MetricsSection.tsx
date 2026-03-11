"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ── Animated counter hook ── */
function useAnimatedCounter(end: number, started: boolean, duration = 2) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!started) return;
        let frame: number;
        const t0 = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - t0) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
            setCount(Math.floor(eased * end));
            if (p < 1) frame = requestAnimationFrame(tick);
            else setCount(end);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [started, end, duration]);

    return count;
}

/* ── Single metric card ── */
function MetricCard({
    end,
    prefix,
    label,
    started,
}: {
    end: number;
    prefix: string;
    label: string;
    started: boolean;
}) {
    const count = useAnimatedCounter(end, started);

    return (
        <div
            className="metric-card flex flex-col items-center justify-center text-center"
            style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
            }}
        >
            <div
                className="text-4xl sm:text-5xl"
                style={{
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.02em",
                }}
            >
                <span style={{ color: "#1D4ED8" }}>{prefix}</span>
                <span style={{ color: "#0f172a" }}>{count}</span>
            </div>
            <p
                className="mt-2 text-sm"
                style={{ color: "#475569", fontWeight: 500 }}
            >
                {label}
            </p>
        </div>
    );
}

/* ── Metrics Section ── */
export default function MetricsSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section
            ref={ref}
            id="metrics"
            style={{ background: "#ffffff" }}
            className="py-20 px-4"
        >
            <div className="max-w-4xl mx-auto">
                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-sm text-center mb-10"
                    style={{ color: "#94a3b8" }}
                >
                    Conectando proveedores del mundo con negocios argentinos
                </motion.p>

                {/* 3 metric cards */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0, duration: 0.5 }}
                    >
                        <MetricCard
                            end={53}
                            prefix="+"
                            label="ciudades de origen"
                            started={isInView}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <MetricCard
                            end={12}
                            prefix="+"
                            label="países"
                            started={isInView}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <MetricCard
                            end={3}
                            prefix=""
                            label="continentes"
                            started={isInView}
                        />
                    </motion.div>
                </div>

                {/* Providers line */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-center text-base"
                    style={{ color: "#475569", fontWeight: 500, marginTop: "2rem" }}
                >
                    <span style={{ color: "#0f172a", fontWeight: 700 }}>+240</span>{" "}
                    proveedores conectados con negocios argentinos
                </motion.p>
            </div>
        </section>
    );
}
