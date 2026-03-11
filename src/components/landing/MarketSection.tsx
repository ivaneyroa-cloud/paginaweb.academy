"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/* ── Animated counter with thousands separator ── */
function useCounter(end: number, started: boolean, duration = 2.5) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!started) return;
        let frame: number;
        const t0 = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - t0) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * end));
            if (p < 1) frame = requestAnimationFrame(tick);
            else setCount(end);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [started, end, duration]);

    return count.toLocaleString("es-AR");
}

export default function MarketSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const formatted = useCounter(20000, isInView);

    return (
        <section
            ref={ref}
            id="market"
            className="py-20 px-4 text-center relative overflow-hidden dot-grid"
            style={{ background: "#050b1f" }}
        >
            {/* Ambient glow — top left */}
            <div className="ambient-glow" style={{
                width: "600px", height: "600px",
                top: "-200px", left: "-100px",
                background: "rgba(43,192,255,0.04)",
            }} />
            {/* Ambient glow — bottom right */}
            <div className="ambient-glow" style={{
                width: "500px", height: "500px",
                bottom: "-150px", right: "-100px",
                background: "rgba(15,40,80,0.12)",
            }} />
            {/* Glow orb behind the number */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background: "rgba(29,161,255,0.05)",
                    filter: "blur(160px)",
                }}
            />

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-3xl sm:text-4xl mx-auto leading-tight"
                    style={{
                        color: "#FFFFFF",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        maxWidth: 600,
                    }}
                >
                    Miles de empresas argentinas ya importan desde{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        China
                    </span>
                </motion.h2>

                {/* Big number */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.7, type: "spring", stiffness: 80 }}
                    className="mt-10"
                    style={{
                        textShadow: "0 0 60px rgba(0,102,255,0.2)",
                    }}
                >
                    <span
                        className="text-3xl sm:text-4xl mr-2 align-baseline"
                        style={{ color: "rgba(255,255,255,0.6)", fontWeight: 400 }}
                    >
                        +
                    </span>
                    <span
                        className="text-5xl sm:text-7xl lg:text-8xl"
                        style={{
                            fontWeight: 900,
                            fontVariantNumeric: "tabular-nums",
                            letterSpacing: "-0.02em",
                            background: "linear-gradient(180deg, #FFFFFF, #C7D6F0)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        {formatted}
                    </span>
                </motion.div>

                {/* Sub — empresas */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-3 text-xl sm:text-2xl"
                    style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}
                >
                    empresas lo hacen cada año
                </motion.p>

                {/* Body text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 text-lg mx-auto"
                    style={{ color: "#8b9dc3", maxWidth: 520 }}
                >
                    El comercio global ya forma parte de los negocios argentinos.
                </motion.p>
            </div>
        </section>
    );
}
