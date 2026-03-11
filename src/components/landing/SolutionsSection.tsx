"use client";

import { motion } from "framer-motion";
import { Package, Boxes, Container, Zap, MapPin, BarChart3, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const solutions = [
    {
        icon: Package,
        title: "Courier importación",
        subtitle: "Traé productos desde todo el mundo",
        features: [
            { icon: Zap, text: "Envío rápido" },
            { icon: MapPin, text: "Seguimiento 24/7" },
            { icon: BarChart3, text: "Las mejores tarifas del mercado" },
        ],
        footer: "Ideal para importadores y e-commerce.",
        color: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-500/20 hover:border-blue-500/40",
    },
    {
        icon: Boxes,
        title: "Carga consolidada",
        subtitle: "Compartí contenedor con otros importadores",
        features: [
            { icon: Users, text: "Pagás solo por tu volumen y los impuestos correspondientes" },
            { icon: Clock, text: "Tiempo aproximado: 25 días" },
        ],
        footer: null,
        color: "from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-500/20 hover:border-purple-500/40",
    },
    {
        icon: Container,
        title: "Grandes envíos",
        subtitle: "Para importaciones de gran volumen",
        features: [
            { icon: Boxes, text: "LCL (contenedor compartido)" },
            { icon: Container, text: "FCL (contenedor completo)" },
        ],
        footer: null,
        cta: true,
        color: "from-amber-500/20 to-orange-500/20",
        borderColor: "border-amber-500/20 hover:border-amber-500/40",
    },
];

export default function SolutionsSection() {
    return (
        <section className="section-padding relative overflow-hidden" id="solutions">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        Nuestras <span className="gradient-text">soluciones</span>
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-text-secondary max-w-xl mx-auto">
                        Modalidades de envío para cada tipo de negocio
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {solutions.map((sol, i) => (
                        <motion.div
                            key={sol.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 * i }}
                            className={`glass-card p-6 md:p-8 card-hover flex flex-col border ${sol.borderColor} transition-colors`}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sol.color} flex items-center justify-center mb-5`}>
                                <sol.icon size={26} className="text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-2">{sol.title}</h3>
                            <p className="text-sm text-text-secondary mb-5 leading-relaxed">{sol.subtitle}</p>

                            {/* Features */}
                            <ul className="space-y-3 flex-1">
                                {sol.features.map((f, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-md bg-white/5 border border-border-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <f.icon size={14} className="text-accent" />
                                        </div>
                                        <span className="text-sm text-text-secondary leading-relaxed">
                                            {f.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Footer text or CTA */}
                            {sol.footer && (
                                <p className="mt-5 pt-4 border-t border-border-dark text-xs text-text-muted italic">
                                    {sol.footer}
                                </p>
                            )}
                            {sol.cta && (
                                <Link
                                    href="/contacto"
                                    className="mt-5 pt-4 border-t border-border-dark text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-2 transition-colors"
                                >
                                    Hablar con un asesor <ArrowRight size={14} />
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
