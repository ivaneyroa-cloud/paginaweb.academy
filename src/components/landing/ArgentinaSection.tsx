"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Warehouse, PackageCheck, Truck, Store } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   ARGENTINA — Consolidación local
   Continuidad lógica de infraestructura internacional.
   ══════════════════════════════════════════════════════════ */

const CAPABILITIES = [
    {
        icon: <Warehouse size={20} />,
        title: "Almacenamiento local",
        description: "Recibimos y resguardamos tu carga en depósito propio hasta que estés listo para distribuir.",
    },
    {
        icon: <PackageCheck size={20} />,
        title: "Preparación operativa de envíos",
        description: "Armamos, etiquetamos y preparamos cada pedido según los requisitos de tu operación.",
    },
    {
        icon: <Truck size={20} />,
        title: "Abastecimiento a depósitos",
        description: "Coordinamos entregas a tus depósitos o puntos de distribución en todo el país.",
    },
    {
        icon: <Store size={20} />,
        title: "Coordinación con Mercado Libre Full y operadores locales",
        description: "Integramos tu carga con los principales canales de venta y fulfillment del mercado.",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 + 0.15, duration: 0.5, ease: "easeOut" as const },
    }),
};

export default function ArgentinaSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

    return (
        <section
            ref={sectionRef}
            id="argentina"
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-surface)",
                padding: "4.5rem 1.5rem 3.5rem",
            }}
        >
            {/* Top fade from infrastructure */}
            <div
                className="absolute inset-x-0 top-0 pointer-events-none z-[1]"
                style={{
                    height: "48px",
                    background: "linear-gradient(to top, transparent, var(--bg-surface))",
                }}
            />

            {/* Bottom fade → testimonials */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
                style={{
                    height: "48px",
                    background: "linear-gradient(to bottom, transparent, var(--bg-mid))",
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* ── Section header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-10"
                >
                    <h2
                        className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-white leading-tight"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Argentina, donde se consolida la operación
                    </h2>
                    <p
                        className="mt-3 text-sm md:text-base max-w-2xl"
                        style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
                    >
                        No solo traemos tu carga. La recibimos, la ordenamos y coordinamos
                        la etapa final para que llegue donde tu negocio la necesita.
                    </p>
                </motion.div>

                {/* ── Capabilities grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CAPABILITIES.map((cap, i) => (
                        <motion.div
                            key={cap.title}
                            custom={i}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={fadeUp}
                            className="group flex items-start gap-4 p-5 rounded-xl transition-all duration-300"
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "rgba(43,192,255,0.08)",
                                    border: "1px solid rgba(43,192,255,0.15)",
                                    color: "var(--primary)",
                                }}
                            >
                                {cap.icon}
                            </div>

                            <div>
                                <h4
                                    className="text-sm font-semibold text-white mb-1"
                                    style={{ letterSpacing: "-0.01em" }}
                                >
                                    {cap.title}
                                </h4>
                                <p
                                    className="text-[13px] leading-relaxed"
                                    style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}
                                >
                                    {cap.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Callout de cierre ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-10 flex justify-center"
                >
                    <div
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                        style={{
                            background: "linear-gradient(135deg, rgba(43,192,255,0.06) 0%, rgba(43,192,255,0.02) 100%)",
                            border: "1px solid rgba(43,192,255,0.12)",
                        }}
                    >
                        <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{
                                background: "var(--primary)",
                                boxShadow: "0 0 8px rgba(43,192,255,0.4)",
                            }}
                        />
                        <p
                            className="text-sm font-medium"
                            style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}
                        >
                            Y recordá: todo esto en un único servicio y con una sola factura.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
