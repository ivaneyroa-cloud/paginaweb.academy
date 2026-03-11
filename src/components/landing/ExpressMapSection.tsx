"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Plane, Clock } from "lucide-react";

export default function ExpressMapSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section className="section-padding relative overflow-hidden" id="express" ref={ref}>
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/6 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-6">
                        <Plane size={14} className="text-accent" />
                        <span className="text-xs font-semibold text-accent tracking-wide uppercase">
                            Envíos express
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        De <span className="hero-gradient-text">China a Argentina</span>
                    </h2>
                </motion.div>

                {/* Map visual */}
                <div className="relative max-w-3xl mx-auto">
                    <svg
                        viewBox="0 0 800 350"
                        className="w-full"
                        style={{ height: "auto" }}
                    >
                        {/* Grid for tech feel */}
                        {Array.from({ length: 16 }).map((_, i) => (
                            <line
                                key={`vg${i}`}
                                x1={(800 / 16) * i}
                                y1={0}
                                x2={(800 / 16) * i}
                                y2={350}
                                stroke="rgba(255,255,255,0.02)"
                                strokeWidth={1}
                            />
                        ))}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <line
                                key={`hg${i}`}
                                x1={0}
                                y1={(350 / 8) * i}
                                x2={800}
                                y2={(350 / 8) * i}
                                stroke="rgba(255,255,255,0.02)"
                                strokeWidth={1}
                            />
                        ))}

                        {/* Defs */}
                        <defs>
                            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06B6D4" />
                                <stop offset="100%" stopColor="#1D4ED8" />
                            </linearGradient>
                            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* China dot + label */}
                        <g>
                            <circle cx={620} cy={100} r={12} fill="none" stroke="#06B6D4" strokeWidth={1.5} opacity={0.4}>
                                <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={620} cy={100} r={6} fill="#06B6D4" opacity={0.95} />
                            <text x={620} y={80} textAnchor="middle" fill="white" fontSize={13} fontWeight={700} fontFamily="var(--font-inter)">
                                🇨🇳 China
                            </text>
                        </g>

                        {/* Argentina dot + label */}
                        <g>
                            <circle cx={220} cy={260} r={12} fill="none" stroke="#06B6D4" strokeWidth={1.5} opacity={0.4}>
                                <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={220} cy={260} r={6} fill="#06B6D4" opacity={0.95} />
                            <text x={220} y={295} textAnchor="middle" fill="white" fontSize={13} fontWeight={700} fontFamily="var(--font-inter)">
                                🇦🇷 Argentina
                            </text>
                        </g>

                        {/* Animated route arc */}
                        <motion.path
                            d="M 620 100 Q 420 20 220 260"
                            fill="none"
                            stroke="url(#routeGrad)"
                            strokeWidth={2.5}
                            strokeDasharray="8 4"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        {/* Glow trail */}
                        <motion.path
                            d="M 620 100 Q 420 20 220 260"
                            fill="none"
                            stroke="url(#routeGrad)"
                            strokeWidth={8}
                            filter="url(#glowFilter)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={isInView ? { pathLength: 1, opacity: 0.25 } : {}}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />

                        {/* Plane icon moving along path */}
                        {isInView && (
                            <motion.g
                                initial={{ offsetDistance: "0%" }}
                                animate={{ offsetDistance: "100%" }}
                                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                                style={{ offsetPath: 'path("M 620 100 Q 420 20 220 260")' }}
                            >
                                <circle r={5} fill="#06B6D4" filter="url(#glowFilter)" />
                                {/* Trail dots */}
                                <circle r={3} fill="#06B6D4" opacity={0.4} cx={-8} />
                                <circle r={2} fill="#06B6D4" opacity={0.2} cx={-16} />
                            </motion.g>
                        )}
                    </svg>

                    {/* Center badge: 5 días */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 1.5, type: "spring" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="glass-card px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Clock size={16} className="text-accent" />
                                <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                                    Express
                                </span>
                            </div>
                            <span className="text-3xl md:text-4xl font-black hero-gradient-text">
                                5 días
                            </span>
                            <p className="text-xs text-text-muted mt-1">hábiles</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
