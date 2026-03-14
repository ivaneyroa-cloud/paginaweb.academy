"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/i18n";
import {
    ShieldCheck,
    FileText,
    Headset,
    Globe,
    BookOpenCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;

/* ── Trust items — icons are shared, text comes from i18n ── */
const TRUST_ICONS: LucideIcon[] = [ShieldCheck, FileText, BookOpenCheck, Headset, Globe];

/* ═══════════════════════════════════════════════════════
   SERVICE TRUST — Credibility block (same for all services)
   ═══════════════════════════════════════════════════════ */
export default function ServiceTrust() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });
    const { t } = useI18n();

    const TRUST_ITEMS = [
        {
            icon: TRUST_ICONS[0],
            title: t("trust.0.title", "Empresa registrada"),
            description: t("trust.0.desc", "Operamos como empresa formalmente inscripta ante AFIP y habilitada en aduana argentina."),
        },
        {
            icon: TRUST_ICONS[1],
            title: t("trust.1.title", "Operación documentada"),
            description: t("trust.1.desc", "Cada envío tiene trazabilidad completa, documentación respaldatoria y registros de punta a punta."),
        },
        {
            icon: TRUST_ICONS[2],
            title: t("trust.2.title", "Gestión integral"),
            description: t("trust.2.desc", "Coordinamos toda la cadena logística: recolección, tránsito, despacho y entrega, sin intermediarios desarticulados."),
        },
        {
            icon: TRUST_ICONS[3],
            title: t("trust.3.title", "Atención humana real"),
            description: t("trust.3.desc", "Soporte personalizado con un equipo que conoce tu operación. Sin bots, sin tickets genéricos."),
        },
        {
            icon: TRUST_ICONS[4],
            title: t("trust.4.title", "Conocimiento operativo"),
            description: t("trust.4.desc", "Experiencia concreta en el ingreso de mercadería a la Argentina: normativa, tiempos y particularidades del proceso."),
        },
    ];

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
            {/* Subtle divider at top */}
            <div
                className="absolute top-0 left-[10%] right-[10%]"
                style={{
                    height: "1px",
                    background:
                        "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)",
                }}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
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
                            {t("trust.eyebrow", "Respaldo")}
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
                        {t("trust.title", "Operación seria, documentada y acompañada")}
                    </motion.h2>
                </div>

                {/* Trust grid — responsive: 1→2→5 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {TRUST_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
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
                                className="text-center"
                                style={{
                                    padding: "clamp(1.15rem, 2vw, 1.5rem)",
                                    borderRadius: "16px",
                                    background: "rgba(255,255,255,0.015)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    cursor: "default",
                                }}
                            >
                                <div
                                    className="mx-auto"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "12px",
                                        background: "rgba(43,192,255,0.06)",
                                        border: "1px solid rgba(43,192,255,0.12)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "14px",
                                    }}
                                >
                                    <Icon
                                        size={18}
                                        style={{ color: "#2BC0FF" }}
                                    />
                                </div>
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        color: "#FFFFFF",
                                        marginBottom: "5px",
                                    }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "12px",
                                        lineHeight: 1.55,
                                        color: "rgba(255,255,255,0.58)",
                                    }}
                                >
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
