"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Package, MapPin, Plane, Ship } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   REGION DATA
   ══════════════════════════════════════════════════════════ */

const REGIONS = [
    {
        id: "china",
        tab: "🇨🇳 China",
        title: "Importá directo de China",
        description:
            "Warehouse propio y servicio de sourcing. Recibimos en Guangzhou y distribuimos a toda China. Vos pedís, nosotros buscamos.",
        metrics: [
            { icon: <Clock size={20} />, value: 5, prefix: "Desde ", suffix: " días", label: "Hábiles de entrega" },
            { icon: <Package size={20} />, value: 1200, prefix: "+", label: "Proveedores verificados" },
            { icon: <MapPin size={20} />, value: 3, label: "Ciudades hub" },
        ],
        cities: ["Guangzhou", "Shanghai", "Shenzhen"],
        hubNote: "Hub Guangzhou → Beijing, Chengdu, Wuhan, Hangzhou, Xiamen",
        accent: "#2BC0FF",
    },
    {
        id: "usa",
        tab: "🇺🇸 USA",
        title: "Express desde Estados Unidos",
        description:
            "Warehouse propio en Miami con conexión directa hacia Argentina. Ideal para tecnología, moda y productos premium.",
        metrics: [
            { icon: <Clock size={20} />, value: 3, suffix: " a 7 días", label: "Hábiles de entrega" },
            { icon: <Plane size={20} />, value: 4500, prefix: "+", label: "Envíos mensuales" },
            { icon: <MapPin size={20} />, value: 2, label: "Ciudades hub" },
        ],
        cities: ["Miami", "New York"],
        hubNote: "Hub Miami → Los Angeles, Chicago, Dallas, Atlanta, Houston",
        accent: "#2BC0FF",
    },
    {
        id: "europe",
        tab: "🇪🇺 Europa",
        title: "Envíos desde Europa",
        description:
            "Comprá en cualquier país de Europa y consolidá en nuestro depósito de España, sin costos ocultos. Acceso directo a las mejores tiendas de pádel y marcas premium.",
        metrics: [
            { icon: <Clock size={20} />, value: 7, suffix: " días", label: "Puerta a puerta" },
            { icon: <Ship size={20} />, value: 850, prefix: "+", label: "Marcas disponibles" },
            { icon: <MapPin size={20} />, value: 2, label: "Ciudades hub" },
        ],
        cities: ["Madrid", "Frankfurt"],
        hubNote: "Hub Madrid → London, Paris, Rome, Amsterdam, Berlin",
        accent: "#2BC0FF",
    },
];

const GLOBAL_STATS = [
    { value: 23500, prefix: "+", label: "envíos realizados" },
    { value: 12, prefix: "+", label: "países conectados" },
    { value: 98, suffix: ".7%", label: "entrega a tiempo" },
];

/* ── Animated counter ── */
function Counter({
    end,
    started,
    prefix = "",
    suffix = "",
    duration = 2,
}: {
    end: number;
    started: boolean;
    prefix?: string;
    suffix?: string;
    duration?: number;
}) {
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

    const formatted = count >= 1000 ? count.toLocaleString("es-AR") : String(count);
    return (
        <span>
            {prefix}
            {formatted}
            {suffix}
        </span>
    );
}

/* ══════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════ */

export default function NetworkSection() {
    const [activeTab, setActiveTab] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const region = REGIONS[activeTab];

    return (
        <section
            ref={ref}
            id="network"
            className="py-10 px-4 md:px-8 dot-grid"
            style={{
                background: "#050b1f",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient glow — top right (blue) */}
            <div className="ambient-glow" style={{
                width: "700px", height: "700px",
                top: "-200px", right: "-150px",
                background: "rgba(43,192,255,0.06)",
            }} />
            {/* Ambient glow — bottom left (navy) */}
            <div className="ambient-glow" style={{
                width: "600px", height: "600px",
                bottom: "-200px", left: "-150px",
                background: "rgba(15,40,80,0.15)",
            }} />
            <div className="max-w-5xl mx-auto relative z-10">
                {/* ── Section header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <p
                        className="text-sm uppercase tracking-widest mb-3"
                        style={{ color: "#2BC0FF", fontWeight: 600 }}
                    >
                        Red Global
                    </p>
                    <h2
                        className="text-3xl sm:text-4xl font-bold text-white"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Conectamos tu negocio con{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            3 continentes
                        </span>
                    </h2>
                    <p
                        className="mt-3 text-base mx-auto"
                        style={{ color: "#8b9dc3", maxWidth: "520px" }}
                    >
                        Recibimos en nuestros hubs regionales y distribuimos a todo el país
                        de destino
                    </p>
                </motion.div>

                {/* ── Tabs ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="flex justify-center gap-2 sm:gap-3 mb-6"
                >
                    {REGIONS.map((r, i) => (
                        <button
                            key={r.id}
                            onClick={() => setActiveTab(i)}
                            className="relative px-5 sm:px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer"
                            style={{
                                background:
                                    activeTab === i
                                        ? "rgba(47,180,255,0.15)"
                                        : "rgba(255,255,255,0.03)",
                                border: `1px solid ${activeTab === i
                                    ? "rgba(47,180,255,0.35)"
                                    : "rgba(255,255,255,0.06)"
                                    }`,
                                color: activeTab === i ? "#fff" : "#6b7fa3",
                                boxShadow:
                                    activeTab === i
                                        ? "0 0 20px rgba(47,180,255,0.08)"
                                        : "none",
                            }}
                        >
                            {r.tab}
                        </button>
                    ))}
                </motion.div>

                {/* ── Active region content ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={region.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className="rounded-2xl p-5 sm:p-8"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                            }}
                        >
                            {/* Title + description */}
                            <h3
                                className="text-xl sm:text-2xl font-bold text-white mb-2"
                                style={{ letterSpacing: "-0.01em" }}
                            >
                                {region.title}
                            </h3>
                            <p
                                className="text-sm sm:text-base mb-8"
                                style={{ color: "#8b9dc3", maxWidth: "600px" }}
                            >
                                {region.description}
                            </p>

                            {/* Metrics — inline with dividers */}
                            <div className="flex items-center justify-start gap-0 mb-6 flex-wrap">
                                {region.metrics.map((m, i) => (
                                    <div key={i} className="flex items-center">
                                        {i > 0 && (
                                            <div
                                                className="hidden sm:block mx-5 sm:mx-6"
                                                style={{
                                                    width: "1px",
                                                    height: "36px",
                                                    background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent)",
                                                }}
                                            />
                                        )}
                                        <div className="flex items-center gap-3 py-2 px-1">
                                            <div style={{ color: region.accent, opacity: 0.7 }}>
                                                {m.icon}
                                            </div>
                                            <div>
                                                <div
                                                    className="text-lg sm:text-xl font-bold text-white"
                                                    style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
                                                >
                                                    <Counter
                                                        end={m.value}
                                                        started={inView}
                                                        prefix={m.prefix}
                                                        suffix={m.suffix}
                                                    />
                                                </div>
                                                <div
                                                    className="text-xs mt-0.5"
                                                    style={{ color: "#6b7fa3" }}
                                                >
                                                    {m.label}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cities + hub note */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {region.cities.map((city) => (
                                        <span
                                            key={city}
                                            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium"
                                            style={{
                                                background: "rgba(0,230,255,0.07)",
                                                border: "1px solid rgba(0,230,255,0.12)",
                                                color: "#00e6ff",
                                            }}
                                        >
                                            {city}
                                        </span>
                                    ))}
                                </div>
                                <p
                                    className="text-xs"
                                    style={{ color: "#4a5b78" }}
                                >
                                    {region.hubNote}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* ── Global consolidated stats ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-6 grid grid-cols-3 gap-4"
                >
                    {GLOBAL_STATS.map((stat, i) => (
                        <div
                            key={i}
                            className="network-stat-card text-center py-5 rounded-xl"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <div
                                className="text-2xl sm:text-3xl font-bold text-white"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                <Counter
                                    end={stat.value}
                                    started={inView}
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                />
                            </div>
                            <div
                                className="text-xs mt-1 tracking-wide"
                                style={{ color: "#4a5b78" }}
                            >
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
