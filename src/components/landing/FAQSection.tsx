"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   FAQ Section — Public, SEO-optimized with FAQPage JSON-LD
   Shows as rich snippets (dropdowns) in Google results
   ══════════════════════════════════════════════════════════ */

const FAQS = [
    {
        q: "¿Qué se puede traer por courier a Argentina?",
        a: "Accesorios de celular, electrónica liviana, ropa, herramientas de mano, artículos de librería, y productos de hasta USD 3.000 por envío. Productos como fundas de silicona, auriculares bluetooth, smartwatches, power banks, luces LED, y organizadores de escritorio son ideales para courier.",
    },
    {
        q: "¿Cuánto tarda un envío courier internacional a Argentina?",
        a: "Por courier aéreo generalmente tarda entre 7 y 15 días hábiles desde que el proveedor despacha hasta que lo tenés en tu casa. Con Shippar el promedio es de 10 días. Depende del país de origen, la aduana y la temporada.",
    },
    {
        q: "¿Qué es el valor FOB y cómo calculo el costo total de importar?",
        a: "FOB (Free On Board) es el precio del producto puesto en el puerto de origen. El costo total incluye: precio FOB + flete internacional + seguro = CIF. Sobre el CIF se calculan los derechos de importación (50%) e IVA (21%). Usá nuestra calculadora para estimar el costo total puesto en Argentina.",
    },
    {
        q: "¿Necesito CUIT de importador o despachante de aduana?",
        a: "Para courier simplificado NO necesitás despachante ni estar inscripto como importador/exportador. Podés importar como persona física con CUIT. El courier se encarga del despacho simplificado. Solo necesitás despachante para importaciones formales de mayor valor.",
    },
    {
        q: "¿Cuánto puedo importar por courier simplificado?",
        a: "El límite por envío es de USD 3.000. Hay también límites anuales que AFIP monitorea según tu perfil fiscal. El régimen courier simplificado permite importar con menos trámites, ideal para emprendedores que están arrancando.",
    },
    {
        q: "¿Qué documentos necesito para importar desde China?",
        a: "Para courier simplificado necesitás: factura comercial del proveedor, descripción detallada del producto (nombre específico, material, uso, cantidad, valor unitario y total), y tu CUIT. Evitá descripciones genéricas como 'accesorios' — cuanto más detallado, menos chances de retención.",
    },
    {
        q: "¿Cómo busco proveedores confiables en Alibaba?",
        a: "Filtrá por proveedores con Trade Assurance, más de 3 años en la plataforma y buenos ratings. Siempre pedí muestras antes de hacer un pedido grande. Verificá si son fábrica (Manufacturer) o intermediario (Trading Company). Y lo más importante: NUNCA pagues fuera de la plataforma.",
    },
    {
        q: "¿Qué impuestos pago al importar por courier?",
        a: "Por courier simplificado pagás: derecho de importación (50% sobre el valor CIF para la mayoría de productos) + IVA (21%). Si sos Responsable Inscripto, podés tomar el crédito fiscal del IVA pagado en la importación.",
    },
    {
        q: "¿Qué productos NO conviene importar por courier?",
        a: "Evitá productos que superen USD 3.000, mercadería que requiera certificaciones especiales (ANMAT para suplementos, INTI/ENACOM para electrónica con componentes eléctricos), artículos prohibidos, y productos muy pesados o voluminosos que pierden margen por flete.",
    },
    {
        q: "¿Qué es el peso volumétrico y cómo se calcula?",
        a: "El courier cobra por el peso mayor entre el real y el volumétrico. El peso volumétrico se calcula: largo × ancho × alto (en cm) / 5.000. Si tu producto es voluminoso pero liviano, el volumétrico será mayor. Siempre calculalo antes de comprar para evitar sorpresas en el flete.",
    },
];

export default function FAQSection() {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    /* ── FAQPage JSON-LD schema ── */
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
            },
        })),
    };

    return (
        <section
            id="faq"
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-mid)",
                padding: "5rem 1.5rem",
            }}
        >
            {/* JSON-LD for Google rich snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Ambient glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 600,
                    height: 600,
                    bottom: "-10%",
                    left: "20%",
                    background:
                        "radial-gradient(circle, rgba(43,192,255,0.02) 0%, transparent 70%)",
                    filter: "blur(80px)",
                }}
            />

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <p
                        className="text-xs uppercase tracking-widest mb-3"
                        style={{
                            color: "rgba(255,255,255,0.35)",
                            fontWeight: 600,
                        }}
                    >
                        Preguntas frecuentes
                    </p>
                    <h2
                        className="text-3xl md:text-4xl font-bold text-white"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Todo lo que necesitás saber para importar
                    </h2>
                    <p
                        className="mt-3 text-base max-w-lg mx-auto"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                        Las dudas más comunes sobre courier internacional,
                        aduana, costos y proveedores.
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="space-y-2">
                    {FAQS.map((faq, i) => {
                        const isOpen = openIdx === i;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    delay: i * 0.04,
                                }}
                            >
                                <button
                                    onClick={() =>
                                        setOpenIdx(isOpen ? null : i)
                                    }
                                    className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 rounded-xl transition-all duration-300"
                                    style={{
                                        background: isOpen
                                            ? "rgba(43,192,255,0.04)"
                                            : "rgba(255,255,255,0.02)",
                                        border: `1px solid ${
                                            isOpen
                                                ? "rgba(43,192,255,0.15)"
                                                : "rgba(255,255,255,0.05)"
                                        }`,
                                        cursor: "pointer",
                                    }}
                                >
                                    <span
                                        className="text-sm font-semibold"
                                        style={{
                                            color: isOpen
                                                ? "#FFFFFF"
                                                : "rgba(255,255,255,0.7)",
                                        }}
                                    >
                                        {faq.q}
                                    </span>
                                    <motion.span
                                        animate={{
                                            rotate: isOpen ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.25 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown
                                            size={18}
                                            style={{
                                                color: isOpen
                                                    ? "#2BC0FF"
                                                    : "rgba(255,255,255,0.25)",
                                            }}
                                        />
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeInOut",
                                            }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <p
                                                className="text-sm leading-relaxed px-5 py-3"
                                                style={{
                                                    color: "rgba(255,255,255,0.55)",
                                                    lineHeight: 1.7,
                                                }}
                                            >
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
