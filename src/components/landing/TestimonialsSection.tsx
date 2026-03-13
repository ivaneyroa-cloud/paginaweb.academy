"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n";

/* ══════════════════════════════════════════════════════════
   TESTIMONIALS — Premium social proof
   ──────────────────────────────────────────────────────────
   3 cards visible on desktop. Curated excerpts, balanced
   lengths. Dark elevated cards. Compact, confident layout.
   ══════════════════════════════════════════════════════════ */

type Review = {
    id: number;
    quote: string;
    name: string;
    role: string;
    stars: number;
};

/* ── Curated reviews — balanced length, selling phrases ── */
const REVIEWS: Review[] = [
    {
        id: 1,
        quote: "Excelente atención de todo el equipo. Se comunicaron conmigo constantemente y me ayudaron con todo. Fue rápido y me facilitaron muchas cosas que yo no sabía cómo resolver. 10/10.",
        name: "Lucila Kosaruk",
        role: "Local Guide · Google",
        stars: 5,
    },
    {
        id: 2,
        quote: "Excelente servicio. Iván, Alan y Dolo son súper atentos y responsables. Hice mi primera importación con ellos y ya va a ser un año que los sigo eligiendo. Las cargas llegan en tiempo y forma.",
        name: "Sofía Condoleo",
        role: "Cliente verificada · Google",
        stars: 5,
    },
    {
        id: 3,
        quote: "Súper atentos y atienden fuera de horario. Eso se valora mucho cuando necesitás cotizaciones para cerrar ventas. Los paquetes llegan muy bien a destino.",
        name: "INT Sonido e Iluminación",
        role: "Local Guide · Google",
        stars: 5,
    },
    {
        id: 4,
        quote: "Muy buena atención, siempre atentos y solucionando problemas. 100% recomendable. Los productos de electrónica llegaron en perfectas condiciones.",
        name: "Javier Bravo",
        role: "Local Guide · Google",
        stars: 5,
    },
    {
        id: 5,
        quote: "Fue mi primer pedido y todo perfecto y claro. Destaco la atención de Iván, respondió a todas mis inquietudes sin excepción.",
        name: "Yamila Algañaraz",
        role: "Cliente verificada · Google",
        stars: 5,
    },
    {
        id: 6,
        quote: "Nos ayudó con toda la gestión y dudas de nuestra primera importación. Ya llegó toda la mercadería y estamos felices. Muy atentos en todo el proceso.",
        name: "Matilda Canal",
        role: "Cliente verificada · Google",
        stars: 5,
    },
    {
        id: 7,
        quote: "Hice mi primera importación con Shippar y llegó todo bien. Me asesoraron con la compra y me ayudaron con todas las dudas. Recomiendo importar con ellos.",
        name: "Hellste",
        role: "Cliente verificado · Google",
        stars: 5,
    },
    {
        id: 8,
        quote: "Vengo trabajando con la empresa y me parecen muy confiables. Brindan un buen servicio. Los recomiendo si quieren traer productos de afuera.",
        name: "Edgar Ospina",
        role: "Cliente verificado · Google",
        stars: 5,
    },
    {
        id: 9,
        quote: "Impecable atención de todo el equipo. Me asesoraron de principio a fin. Realicé mi primera importación sin problemas. Súper recomendado.",
        name: "Erick Piña",
        role: "Local Guide · Google",
        stars: 5,
    },
    {
        id: 10,
        quote: "Desde que empecé a importar con Shippar me cambiaron la vida. Son lo mejor. Atención inmejorable. 1000% recomendables.",
        name: "VYM Straps",
        role: "Cliente verificado · Google",
        stars: 5,
    },
    {
        id: 11,
        quote: "Fue mi primera importación y no pensé que era tan fácil. Ellos se encargan de todo y te explican paso a paso. Te deja tranquilo. Muy recomendado.",
        name: "Marcos Lavanchy",
        role: "Cliente verificado · Google",
        stars: 5,
    },
    {
        id: 12,
        quote: "Eficiencia, confianza y transparencia durante todo el proceso de importación. Sin vueltas, sin sorpresas.",
        name: "Maximiliano López",
        role: "Cliente verificado · Google",
        stars: 5,
    },
];

/* ── Google G icon ── */
function GoogleG({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

/* ── Single review card ── */
function ReviewCard({ review }: { review: Review }) {
    return (
        <div
            className="flex flex-col h-full select-none"
            style={{
                background: "linear-gradient(165deg, rgba(15,28,55,0.95) 0%, rgba(10,22,45,0.9) 100%)",
                borderRadius: "16px",
                padding: "28px 26px 24px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
                transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                minHeight: "220px",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.06) inset";
                e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.04) inset";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} size={15} fill="#FBBC05" stroke="none" />
                ))}
            </div>

            {/* Quote — clamped to 5 lines */}
            <p
                className="flex-1"
                style={{
                    fontSize: "14.5px",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.78)",
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                    letterSpacing: "0.005em",
                }}
            >
                &ldquo;{review.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="mt-5 flex items-center justify-between">
                <div>
                    <p
                        style={{
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            letterSpacing: "0.01em",
                        }}
                    >
                        {review.name}
                    </p>
                    <p
                        className="mt-0.5"
                        style={{
                            fontSize: "11.5px",
                            color: "#a0afc8",
                        }}
                    >
                        {review.role}
                    </p>
                </div>
                <GoogleG size={14} />
            </div>
        </div>
    );
}

/* ════════ Main Section ════════ */
export default function TestimonialsSection() {
    const { t } = useI18n();
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollStart = useRef(0);

    const updateButtons = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
        // Calculate active card index for dot indicators
        if (el.clientWidth > 0) {
            const cardWidth = el.clientWidth * 0.85 + 20; // 85vw + gap
            const idx = Math.round(el.scrollLeft / cardWidth);
            setActiveIndex(Math.min(idx, REVIEWS.length - 1));
        }
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener("scroll", updateButtons, { passive: true });
        updateButtons();
        return () => el.removeEventListener("scroll", updateButtons);
    }, [updateButtons]);

    const scroll = (dir: "left" | "right") => {
        const el = trackRef.current;
        if (!el) return;
        // On mobile (<1024px), scroll by full card width; on desktop scroll ~1/3
        const isMobile = window.innerWidth < 1024;
        const amount = isMobile ? el.clientWidth : el.clientWidth / 3;
        el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.pageX;
        scrollStart.current = trackRef.current?.scrollLeft || 0;
        if (trackRef.current) trackRef.current.style.cursor = "grabbing";
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !trackRef.current) return;
        e.preventDefault();
        trackRef.current.scrollLeft = scrollStart.current - (e.pageX - startX.current);
    };
    const handleMouseUp = () => {
        isDragging.current = false;
        if (trackRef.current) trackRef.current.style.cursor = "grab";
    };

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-mid)",
                paddingTop: "4rem",
                paddingBottom: "3.5rem",
            }}
        >
            {/* Bottom fade → CTA */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
                style={{
                    height: "48px",
                    background: "linear-gradient(to bottom, transparent, var(--bg-deep))",
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-6 lg:px-8">
                {/* ── Header row: title + controls ── */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
                >
                    <div>
                        <h2
                            className="text-2xl md:text-3xl"
                            style={{
                                color: "#FFFFFF",
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                lineHeight: 1.2,
                            }}
                        >
                            {t("testimonials.title")}
                        </h2>

                    </div>

                    {/* Arrows — compact, next to title */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 cursor-pointer"
                            style={{
                                background: canScrollLeft ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${canScrollLeft ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
                                color: canScrollLeft ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
                            }}
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 cursor-pointer"
                            style={{
                                background: canScrollRight ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${canScrollRight ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
                                color: canScrollRight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
                            }}
                            aria-label="Siguiente"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </motion.div>

                {/* ── Carousel ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.15, duration: 0.5 }}
                >
                    <div
                        ref={trackRef}
                        className="flex gap-5 overflow-x-auto pb-2"
                        style={{
                            scrollSnapType: "x mandatory",
                            WebkitOverflowScrolling: "touch",
                            cursor: "grab",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <style>{`#testimonials .flex::-webkit-scrollbar { display: none; }`}</style>

                        {REVIEWS.map((review) => (
                            <div
                                key={review.id}
                                className="flex-shrink-0 w-[85vw] sm:w-[85vw] lg:w-[calc((100%-2*20px)/3)]"
                                style={{
                                    scrollSnapAlign: "start",
                                }}
                            >
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                    {/* Dot indicators (mobile only) */}
                    <div className="flex lg:hidden justify-center gap-1.5 mt-4">
                        {REVIEWS.map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: i === activeIndex ? 16 : 6,
                                    height: 6,
                                    borderRadius: 3,
                                    background: i === activeIndex ? "rgba(43,192,255,0.8)" : "rgba(255,255,255,0.15)",
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* ── Footer: Google link ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-6 flex justify-end"
                >
                    <a
                        href="https://maps.app.goo.gl/PMRMXJukjeDcTqJu7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
                        style={{
                            border: "1px solid rgba(255,255,255,0.07)",
                            background: "rgba(255,255,255,0.03)",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "12.5px",
                            fontWeight: 500,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        }}
                    >
                        <GoogleG size={13} />
                        <span>{t("testimonials.google")}</span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
