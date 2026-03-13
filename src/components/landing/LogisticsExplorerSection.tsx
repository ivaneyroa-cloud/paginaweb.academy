"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe,
    Warehouse,
    Plane,
    Settings,
    Truck,
    ArrowRight,
    Package,
    MapPin,
    ShieldCheck,
    Store,
    CircleCheckBig,
    Box,
    Scan,
    Tag,
    Weight,
    BarChart3,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   LOGISTICS EXPLORER — GitHub-style interactive section
   ══════════════════════════════════════════════════════════ */

const STAGES = [
    {
        id: 0, icon: Globe, title: "Origen internacional",
        description: "Gestionamos cargas desde origen con apoyo local, una red internacional de agentes y coordinación operativa en cada etapa. Desde la compra, tu envío entra en una red preparada para moverlo con rapidez, control y visibilidad.",
        cta: "Conocer orígenes",
    },
    {
        id: 1, icon: Warehouse, title: "Recepción y consolidado",
        description: "Coordinamos la recepción o recolección de tu carga en origen y, si lo necesitás, consolidamos mercadería de distintos proveedores para optimizar el envío.",
        cta: "Ver proceso",
    },
    {
        id: 2, icon: Plane, title: "Transporte internacional",
        description: "Seleccionamos la ruta adecuada para tu envío, según el tipo de carga y la modalidad que necesites: aérea, marítima o terrestre. Además, te damos tracking para que puedas seguir tu carga en todo momento.",
        cta: "Ver carriers",
    },
    {
        id: 3, icon: Settings, title: "Operación en Argentina",
        description: "Recibimos tu carga, gestionamos la liberación aduanera y preparamos los envíos desde nuestro centro operativo.",
        cta: "Ver operación",
    },
    {
        id: 4, icon: Truck, title: "Distribución final",
        description: "Coordinamos la distribución final de tu carga en todo el país, con entregas a depósito, ecommerce, fulfillment o destino definido.",
        cta: "Ver cobertura",
    },
];

const AR_CAPS = [
    { icon: Warehouse, title: "Almacén propio", metric: "1.200 m²" },
    { icon: Package, title: "Preparación", metric: "24/48 hs" },
    { icon: Store, title: "Mercado Libre Full", metric: "Integrado" },
    { icon: ShieldCheck, title: "Gestión aduanera", metric: "ARCA" },
];

/* ── Shared panel styling ── */
const PANEL_BG = "linear-gradient(145deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)";
const CARD_STYLE: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10,
};
const LABEL_STYLE: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase" as const, color: "#adb9cf",
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function LogisticsExplorerSection() {
    const [active, setActive] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setActive((p) => (p + 1) % STAGES.length);
        }, 5000);
    }, []);

    useEffect(() => {
        resetTimer();
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [active, resetTimer]);

    const onSelect = (i: number) => setActive(i);

    return (
        <section id="logistics-explorer" style={{ background: "var(--bg-deep)", position: "relative", overflow: "hidden" }}>
            <div className="absolute pointer-events-none" style={{ width: 700, height: 700, top: "10%", right: "5%", background: "radial-gradient(circle, rgba(43,192,255,0.025) 0%, transparent 70%)", filter: "blur(80px)" }} />
            <div className="section-padding">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-12 lg:mb-16">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold text-white" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                            Logística sin letra chica.
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
                            className="mt-4 text-base lg:text-lg" style={{ color: "rgba(255,255,255,0.62)" }}>
                            5 etapas, una operación integrada, visibilidad total.
                        </motion.p>
                    </div>
                    <div className="hidden lg:grid" style={{ gridTemplateColumns: "38% 1fr", gap: "2.5rem", minHeight: 520, alignItems: "stretch" }}>
                        <StageList active={active} onSelect={onSelect} />
                        <VisualPanel active={active} />
                    </div>
                    <div className="lg:hidden">
                        <MobileAccordion active={active} onSelect={onSelect} />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   STAGE LIST — left column (GitHub-style)
   ══════════════════════════════════════════════ */
function StageList({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
    return (
        <div className="flex flex-col justify-center">
            {STAGES.map((stage, i) => {
                const isActive = i === active;
                const Icon = stage.icon;
                return (
                    <button key={stage.id} onClick={() => onSelect(i)} className="group text-left w-full"
                        style={{ padding: "1.25rem 1.5rem", position: "relative", cursor: "pointer", transition: "all 0.3s ease", border: "none", borderLeft: `2px solid ${isActive ? "#2BC0FF" : "rgba(255,255,255,0.06)"}`, background: isActive ? "linear-gradient(90deg, rgba(43,192,255,0.04) 0%, transparent 100%)" : "transparent" }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "rgba(43,192,255,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${isActive ? "rgba(43,192,255,0.2)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.3s ease" }}>
                                    <Icon size={16} style={{ color: isActive ? "#2BC0FF" : "rgba(255,255,255,0.3)", transition: "color 0.3s" }} />
                                </div>
                                <span className="text-sm font-semibold" style={{ color: isActive ? "#FFFFFF" : "#a0afc8", transition: "color 0.3s" }}>{stage.title}</span>
                            </div>
                            <motion.span animate={{ rotate: isActive ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ color: isActive ? "#2BC0FF" : "rgba(255,255,255,0.15)", fontSize: 18, fontWeight: 300, lineHeight: 1 }}>+</motion.span>
                        </div>
                        <AnimatePresence>
                            {isActive && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
                                    <p className="text-sm mt-3 leading-relaxed" style={{ color: "#adb9cf", paddingLeft: 44 }}>{stage.description}</p>
                                    <div style={{ paddingLeft: 44 }} className="mt-3">
                                        <span className="text-xs font-semibold inline-flex items-center gap-1.5" style={{ color: "#2BC0FF" }}>{stage.cta} <ArrowRight size={12} /></span>
                                    </div>
                                    <div className="mt-3" style={{ height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1, marginLeft: 44, overflow: "hidden" }}>
                                        <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} key={`progress-${active}`} style={{ height: "100%", background: "linear-gradient(90deg, #2BC0FF, rgba(43,192,255,0.3))", borderRadius: 1 }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                );
            })}
        </div>
    );
}

/* ══════════════════════════════════════════════
   VISUAL PANEL — switches between 5 unique scenes
   ══════════════════════════════════════════════ */
function VisualPanel({ active }: { active: number }) {
    return (
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: PANEL_BG, border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)", minHeight: 480 }}>
            {/* Glow behind panel */}
            <div className="absolute pointer-events-none" style={{ inset: -60, background: "radial-gradient(ellipse at 60% 50%, rgba(43,192,255,0.06) 0%, transparent 60%)", filter: "blur(40px)", zIndex: 0 }} />
            <div className="relative w-full h-full" style={{ zIndex: 1, minHeight: 480 }}>
                <AnimatePresence mode="wait">
                    {active === 0 && <Scene_Origin key="s0" />}
                    {active === 1 && <Scene_Consolidation key="s1" />}
                    {active === 2 && <Scene_Transport key="s2" />}
                    {active === 3 && <Scene_Operations key="s3" />}
                    {active === 4 && <Scene_Distribution key="s4" />}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   SCENE 1 — Origen Internacional (Mapbox fly-to)
   ═══════════════════════════════════════ */

/* Data constants kept for Scene_Transport */
const ORIGIN_NODES = [
    { id: "cn", x: 810, y: 200, label: "Guangzhou", flag: "🇨🇳" },
    { id: "us", x: 240, y: 190, label: "Miami", flag: "🇺🇸" },
    { id: "es", x: 475, y: 165, label: "Madrid", flag: "🇪🇸" },
];
const HUB = { x: 305, y: 350 };
const DOTS_RAW = [130, 120, 160, 130, 190, 140, 170, 160, 200, 160, 220, 170, 230, 190, 250, 200, 160, 100, 195, 115, 225, 145, 140, 150, 175, 185, 205, 195, 220, 230, 230, 250, 240, 240, 280, 270, 300, 280, 310, 300, 320, 320, 310, 340, 300, 360, 290, 380, 270, 370, 330, 290, 335, 310, 325, 350, 280, 390, 295, 400, 260, 360, 470, 130, 490, 135, 480, 150, 500, 150, 510, 140, 520, 160, 460, 160, 540, 145, 530, 130, 495, 170, 490, 210, 510, 230, 520, 260, 510, 290, 500, 310, 520, 330, 530, 300, 505, 250, 480, 200, 495, 340, 560, 120, 590, 130, 620, 140, 650, 130, 680, 140, 710, 150, 740, 160, 770, 180, 800, 200, 820, 210, 780, 140, 830, 230, 700, 190, 750, 210, 640, 180, 600, 170, 670, 200, 720, 170, 850, 220, 830, 340, 850, 350, 870, 340, 860, 360, 840, 370];
const DOTS = (() => { const r: { x: number; y: number }[] = []; for (let i = 0; i < DOTS_RAW.length; i += 2) r.push({ x: DOTS_RAW[i], y: DOTS_RAW[i + 1] }); return r; })();

function getArc(x1: number, y1: number, x2: number, y2: number) {
    const mx = (x1 + x2) / 2, d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return `M${x1},${y1} Q${mx},${Math.min(y1, y2) - Math.max(d * 0.22, 25)} ${x2},${y2}`;
}
const INT_ROUTES = ORIGIN_NODES.map(n => getArc(n.x, n.y, HUB.x, HUB.y));

/* ── Mapbox origin regions & points ── */
const MAPBOX_REGIONS = [
    { name: "China", center: [113.2644, 23.1291] as [number, number], zoom: 4.2, pitch: 50, bearing: 25 },
    { name: "España", center: [-3.7038, 40.4168] as [number, number], zoom: 4.5, pitch: 42, bearing: -12 },
    { name: "Pakistán", center: [67.0011, 24.8607] as [number, number], zoom: 4.5, pitch: 48, bearing: 18 },
    { name: "Estados Unidos", center: [-80.1918, 25.7617] as [number, number], zoom: 3.8, pitch: 40, bearing: -25 },
];

const MAPBOX_POINTS: { coords: [number, number]; hub: boolean }[] = [
    /* China */
    { coords: [113.2644, 23.1291], hub: true },   // Guangzhou
    { coords: [114.0579, 22.5431], hub: false },   // Shenzhen
    { coords: [120.1551, 30.2741], hub: false },   // Ningbo
    { coords: [121.4737, 31.2304], hub: false },   // Shanghai
    { coords: [118.0894, 24.4798], hub: false },   // Xiamen
    { coords: [120.0037, 29.3054], hub: false },   // Yiwu
    /* España / Europa */
    { coords: [-3.7038, 40.4168], hub: true },     // Madrid
    { coords: [2.1734, 41.3851], hub: false },      // Barcelona
    { coords: [-0.3763, 39.4699], hub: false },     // Valencia
    /* Pakistán */
    { coords: [67.0011, 24.8607], hub: true },     // Karachi
    { coords: [74.3587, 31.5204], hub: false },     // Lahore
    { coords: [73.0479, 33.6844], hub: false },     // Islamabad
    /* Estados Unidos */
    { coords: [-80.1918, 25.7617], hub: true },     // Miami
    { coords: [-118.2437, 34.0522], hub: false },   // Los Angeles
    { coords: [-74.006, 40.7128], hub: false },     // New York
    { coords: [-95.3698, 29.7604], hub: false },    // Houston
];

function Scene_Origin() {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const animRef = useRef<number>(0);
    const [activeIdx, setActiveIdx] = useState(0);

    /* ── Timing constants ── */
    const VISIBLE_MS = 1600;   // region visible duration
    const FADE_MS = 400;       // crossfade overlay duration
    const CYCLE_MS = VISIBLE_MS + FADE_MS * 2; // total per region

    useEffect(() => {
        if (!containerRef.current) return;
        let cancelled = false;

        const init = async () => {
            const maplibregl = (await import("maplibre-gl")).default;
            // @ts-ignore — CSS side-effect import
            await import("maplibre-gl/dist/maplibre-gl.css");
            if (cancelled || !containerRef.current) return;

            const map = new maplibregl.Map({
                container: containerRef.current,
                style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                center: MAPBOX_REGIONS[0].center,
                zoom: MAPBOX_REGIONS[0].zoom,
                pitch: MAPBOX_REGIONS[0].pitch,
                bearing: MAPBOX_REGIONS[0].bearing,
                interactive: false,
                attributionControl: false,
            });

            mapRef.current = map;

            map.on("load", () => {
                if (cancelled) return;

                /* ── GeoJSON source with all origin points ── */
                map.addSource("origin-pts", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: MAPBOX_POINTS.map((p) => ({
                            type: "Feature" as const,
                            geometry: { type: "Point" as const, coordinates: p.coords },
                            properties: { hub: p.hub },
                        })),
                    },
                });

                /* Layer 1 — large outer glow */
                map.addLayer({
                    id: "pts-glow-outer",
                    type: "circle",
                    source: "origin-pts",
                    paint: {
                        "circle-radius": ["case", ["get", "hub"], 32, 18],
                        "circle-color": "#2BC0FF",
                        "circle-opacity": 0.07,
                        "circle-blur": 1,
                    },
                });

                /* Layer 2 — mid glow */
                map.addLayer({
                    id: "pts-glow-mid",
                    type: "circle",
                    source: "origin-pts",
                    paint: {
                        "circle-radius": ["case", ["get", "hub"], 14, 8],
                        "circle-color": "#2BC0FF",
                        "circle-opacity": 0.35,
                        "circle-blur": 0.6,
                    },
                });

                /* Layer 3 — bright core */
                map.addLayer({
                    id: "pts-core",
                    type: "circle",
                    source: "origin-pts",
                    paint: {
                        "circle-radius": ["case", ["get", "hub"], 5, 3],
                        "circle-color": "#FFFFFF",
                        "circle-opacity": 0.92,
                    },
                });

                /* ── Pulse animation on outer glow ── */
                let phase = 0;
                const pulse = () => {
                    if (cancelled) return;
                    phase += 0.025;
                    const s = Math.sin(phase);
                    try {
                        map.setPaintProperty("pts-glow-outer", "circle-radius",
                            ["case", ["get", "hub"], 30 + s * 10, 16 + s * 6]);
                        map.setPaintProperty("pts-glow-outer", "circle-opacity",
                            0.05 + s * 0.04);
                    } catch { /* map removed */ }
                    animRef.current = requestAnimationFrame(pulse);
                };
                animRef.current = requestAnimationFrame(pulse);

                /* ── Crossfade region cycle ── */
                let idx = 0;
                const cycleRegion = () => {
                    if (cancelled) return;
                    const overlay = overlayRef.current;

                    /* 1 — fade overlay to opaque */
                    if (overlay) overlay.style.opacity = "1";

                    /* 2 — after fade-out, jump camera & update label */
                    timeoutsRef.current.push(setTimeout(() => {
                        if (cancelled) return;
                        idx = (idx + 1) % MAPBOX_REGIONS.length;
                        const r = MAPBOX_REGIONS[idx];
                        setActiveIdx(idx);
                        map.jumpTo({
                            center: r.center,
                            zoom: r.zoom,
                            pitch: r.pitch,
                            bearing: r.bearing,
                        });

                        /* 3 — fade overlay back to transparent */
                        requestAnimationFrame(() => {
                            if (overlay) overlay.style.opacity = "0";
                        });
                    }, FADE_MS));

                    /* 4 — schedule next cycle */
                    timeoutsRef.current.push(setTimeout(cycleRegion, CYCLE_MS));
                };

                /* Start first cycle after initial view */
                timeoutsRef.current.push(setTimeout(cycleRegion, VISIBLE_MS + 800));
            });
        };

        init();

        return () => {
            cancelled = true;
            timeoutsRef.current.forEach((t) => clearTimeout(t));
            timeoutsRef.current = [];
            if (animRef.current) cancelAnimationFrame(animRef.current);
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className="absolute inset-0"
            style={{ borderRadius: 16, overflow: "hidden" }}>
            {/* Map canvas */}
            <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 480 }} />

            {/* Crossfade overlay — sits on top of map, fades in/out to mask camera jumps */}
            <div ref={overlayRef} className="absolute inset-0 pointer-events-none"
                style={{
                    background: "linear-gradient(145deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)",
                    opacity: 0,
                    transition: `opacity ${FADE_MS}ms ease-in-out`,
                    zIndex: 2,
                }} />

            {/* Region label — top-left */}
            <motion.div
                key={MAPBOX_REGIONS[activeIdx].name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute top-5 left-5 flex items-center gap-2"
                style={{ pointerEvents: "none", zIndex: 3 }}>
                <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#2BC0FF", boxShadow: "0 0 6px #2BC0FF" }} />
                <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
                    fontFamily: "monospace",
                }}>{MAPBOX_REGIONS[activeIdx].name}</span>
            </motion.div>

            {/* Region indicator — bottom bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-5 py-2.5 px-4 rounded-lg"
                style={{
                    background: "rgba(5,11,31,0.85)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(16px)",
                    pointerEvents: "none",
                    zIndex: 3,
                }}>
                {MAPBOX_REGIONS.map((r, i) => {
                    const isActive = i === activeIdx;
                    return (
                        <div key={r.name} className="flex items-center gap-1.5"
                            style={{ transition: "all 0.35s ease" }}>
                            <div className="rounded-full"
                                style={{
                                    width: isActive ? 6 : 4,
                                    height: isActive ? 6 : 4,
                                    background: isActive ? "#2BC0FF" : "rgba(255,255,255,0.15)",
                                    boxShadow: isActive ? "0 0 8px rgba(43,192,255,0.6)" : "none",
                                    transition: "all 0.35s ease",
                                }} />
                            <span style={{
                                fontSize: 10,
                                fontWeight: isActive ? 700 : 500,
                                color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)",
                                fontFamily: "monospace",
                                letterSpacing: "0.05em",
                                transition: "all 0.35s ease",
                            }}>{r.name}</span>
                        </div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════
   SCENE 2 — Recepción y Consolidado (Warehouse)
   ═══════════════════════════════════════ */
function Scene_Consolidation() {
    const items = [
        { icon: Scan, label: "Escaneo de ingreso", status: "Completado", done: true },
        { icon: Tag, label: "Etiquetado SKU", status: "Completado", done: true },
        { icon: Weight, label: "Control de peso", status: "En proceso", done: false },
        { icon: Box, label: "Consolidación", status: "Pendiente", done: false },
    ];
    const packages = [
        { ref: "PKG-001", origin: "Guangzhou", weight: "45 kg", status: "Verificado" },
        { ref: "PKG-002", origin: "Miami", weight: "120 kg", status: "Etiquetado" },
        { ref: "PKG-003", origin: "Madrid", weight: "82 kg", status: "En control" },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Warehouse size={16} style={{ color: "#2BC0FF" }} />
                    <span style={LABEL_STYLE}>Warehouse — Recepción activa</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: "#fbbf24" }} />
                    <span className="text-[10px] font-semibold" style={{ color: "#fbbf24" }}>En proceso</span>
                </div>
            </div>

            {/* Pipeline */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {items.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
                        className="p-3 rounded-lg text-center" style={{ ...CARD_STYLE, borderColor: item.done ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)" }}>
                        <item.icon size={18} style={{ color: item.done ? "#22c55e" : "#2BC0FF", margin: "0 auto 6px" }} />
                        <div className="text-[10px] font-semibold text-white mb-1">{item.label}</div>
                        <div className="text-[9px] font-mono" style={{ color: item.done ? "#22c55e" : "rgba(255,255,255,0.4)" }}>{item.status}</div>
                    </motion.div>
                ))}
            </div>

            {/* Package list */}
            <div className="flex-1 rounded-lg overflow-hidden" style={CARD_STYLE}>
                <div className="grid grid-cols-4 gap-0 px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Referencia", "Origen", "Peso", "Estado"].map(h => (
                        <span key={h} style={LABEL_STYLE}>{h}</span>
                    ))}
                </div>
                {packages.map((pkg, i) => (
                    <motion.div key={pkg.ref} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.15 }}
                        className="grid grid-cols-4 gap-0 px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <span className="text-xs font-mono font-bold" style={{ color: "#2BC0FF" }}>{pkg.ref}</span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{pkg.origin}</span>
                        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{pkg.weight}</span>
                        <span className="text-[10px] font-semibold" style={{ color: "#22c55e" }}>{pkg.status}</span>
                    </motion.div>
                ))}
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-3 gap-3 mt-3">
                {[{ label: "Bultos recibidos", val: "24" }, { label: "Peso total", val: "347 kg" }, { label: "Listo para envío", val: "68%" }].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }}
                        className="rounded-lg p-2.5 text-center" style={CARD_STYLE}>
                        <div className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.42)" }}>{s.label}</div>
                        <div className="text-lg font-bold font-mono" style={{ color: "#2BC0FF" }}>{s.val}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════
   SCENE 3 — Transporte Internacional (Focused route + tracking)
   ═══════════════════════════════════════ */
function Scene_Transport() {
    const route = getArc(810, 200, 305, 350);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
            <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="tGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {/* Dim dots */}
                {DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={1} fill="rgba(255,255,255,0.03)" />)}
                {/* Dim other routes */}
                {INT_ROUTES.slice(1).map((p, i) => <path key={i} d={p} fill="none" stroke="rgba(43,192,255,0.05)" strokeWidth={0.5} strokeDasharray="3 8" />)}
                {/* Main route */}
                <path d={route} fill="none" stroke="rgba(43,192,255,0.08)" strokeWidth={1.5} />
                <motion.path d={route} fill="none" stroke="rgba(43,192,255,0.6)" strokeWidth={2} strokeLinecap="round" filter="url(#tGlow)"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
                {/* Traveling dot */}
                <motion.path d={route} fill="none" stroke="#2BC0FF" strokeWidth={3} strokeLinecap="round" filter="url(#tGlow)"
                    strokeDasharray="0.02 0.98" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -1 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                {/* Origin - Guangzhou */}
                <circle cx={810} cy={200} r={5} fill="#2BC0FF" filter="url(#tGlow)" />
                <text x={810} y={188} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={10} fontWeight={600}>Guangzhou</text>
                {/* Destination - BA */}
                <motion.circle cx={305} cy={350} r={10} fill="none" stroke="rgba(43,192,255,0.3)" strokeWidth={1} animate={{ r: [10, 18, 10], opacity: [0.3, 0, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                <circle cx={305} cy={350} r={6} fill="#2BC0FF" filter="url(#tGlow)" />
                <text x={305} y={375} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={11} fontWeight={700}>Buenos Aires</text>
                {/* Plane icon at midpoint */}
                <motion.text x={560} y={110} textAnchor="middle" fontSize={18} animate={{ y: [110, 105, 110] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>✈️</motion.text>
            </svg>
            {/* Tracking card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="absolute top-6 right-6"
                style={{ width: 240, padding: 16, borderRadius: 12, background: "rgba(10,22,40,0.92)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
                <div className="flex items-center justify-between mb-3">
                    <span style={LABEL_STYLE}>Tracking activo</span>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                </div>
                <div className="text-sm font-mono font-bold text-white mb-1">SHP-28419</div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>Guangzhou</span>
                    <ArrowRight size={10} style={{ color: "rgba(43,192,255,0.4)" }} />
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>Buenos Aires</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-lg p-2" style={CARD_STYLE}><div className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.42)" }}>ETA</div><div className="text-sm font-bold font-mono" style={{ color: "#2BC0FF" }}>12 días</div></div>
                    <div className="rounded-lg p-2" style={CARD_STYLE}><div className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.42)" }}>Carrier</div><div className="text-sm font-bold font-mono text-white">UPS</div></div>
                </div>
                {/* Progress steps */}
                {[{ l: "Recolección", s: true }, { l: "En tránsito", s: true }, { l: "Arribo Argentina", s: false }, { l: "Liberación", s: false }].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 py-1" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <CircleCheckBig size={11} style={{ color: step.s ? "#22c55e" : "rgba(255,255,255,0.15)" }} />
                        <span className="text-[10px]" style={{ color: step.s ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)" }}>{step.l}</span>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════
   SCENE 4 — Operación en Argentina (Dashboard)
   ═══════════════════════════════════════ */
function Scene_Operations() {
    const ops = [
        { label: "En despacho", val: "8", color: "#2BC0FF" },
        { label: "En preparación", val: "14", color: "#fbbf24" },
        { label: "Entregados hoy", val: "23", color: "#22c55e" },
        { label: "Pendientes", val: "5", color: "rgba(255,255,255,0.4)" },
    ];
    const recent = [
        { ref: "SHP-28419", dest: "CABA", status: "Preparando", statusColor: "#fbbf24" },
        { ref: "SHP-28420", dest: "Córdoba", status: "En despacho", statusColor: "#2BC0FF" },
        { ref: "SHP-28421", dest: "Rosario", status: "Entregado", statusColor: "#22c55e" },
        { ref: "SHP-28422", dest: "Mendoza", status: "Preparando", statusColor: "#fbbf24" },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <MapPin size={14} style={{ color: "#2BC0FF" }} />
                    <span style={LABEL_STYLE}>Centro operativo Argentina</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                    <span className="text-[10px] font-semibold" style={{ color: "#22c55e" }}>Operativo</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {ops.map((o, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="rounded-lg p-3 text-center" style={CARD_STYLE}>
                        <div className="text-2xl font-bold font-mono" style={{ color: o.color }}>{o.val}</div>
                        <div className="text-[9px] font-semibold mt-1" style={{ color: "rgba(255,255,255,0.42)" }}>{o.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Capabilities */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {AR_CAPS.map((cap, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="rounded-lg p-3" style={CARD_STYLE}>
                        <cap.icon size={16} style={{ color: "#2BC0FF", marginBottom: 6 }} />
                        <div className="text-[11px] font-semibold text-white">{cap.title}</div>
                        <div className="text-[9px] font-mono mt-0.5" style={{ color: "rgba(43,192,255,0.7)" }}>{cap.metric}</div>
                    </motion.div>
                ))}
            </div>

            {/* Recent operations */}
            <div className="flex-1 rounded-lg overflow-hidden" style={CARD_STYLE}>
                <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={LABEL_STYLE}>Operaciones recientes</span>
                    <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>Hoy</span>
                </div>
                {recent.map((r, i) => (
                    <motion.div key={r.ref} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <span className="text-xs font-mono font-bold" style={{ color: "#2BC0FF" }}>{r.ref}</span>
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{r.dest}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ color: r.statusColor, background: `${r.statusColor}15`, border: `1px solid ${r.statusColor}30` }}>{r.status}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════
   SCENE 5 — Distribución Final (Argentina Map)
   ═══════════════════════════════════════ */
const AR_CITIES = [
    { id: "cba", x: 420, y: 200, label: "Córdoba" },
    { id: "ros", x: 440, y: 250, label: "Rosario" },
    { id: "mdz", x: 320, y: 230, label: "Mendoza" },
    { id: "nqn", x: 330, y: 320, label: "Neuquén" },
    { id: "sal", x: 410, y: 100, label: "Salta" },
    { id: "tuc", x: 420, y: 140, label: "Tucumán" },
];
const BA_HUB = { x: 500, y: 290 };

function Scene_Distribution() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
            <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="dGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {/* Argentina silhouette (simplified) */}
                <motion.path
                    d="M410,50 L440,70 L460,100 L470,150 L480,200 L490,240 L500,280 L510,320 L490,360 L470,400 L440,430 L400,450 L370,460 L350,440 L340,420 L330,400 L310,380 L300,350 L290,320 L300,280 L310,250 L320,210 L340,170 L360,130 L380,90 L400,60 Z"
                    fill="rgba(43,192,255,0.03)" stroke="rgba(43,192,255,0.1)" strokeWidth={1}
                    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5 }}
                />
                {/* Routes from BA to cities */}
                {AR_CITIES.map((city, i) => {
                    const p = `M${BA_HUB.x},${BA_HUB.y} Q${(BA_HUB.x + city.x) / 2 - 20},${(BA_HUB.y + city.y) / 2 - 15} ${city.x},${city.y}`;
                    return (
                        <React.Fragment key={city.id}>
                            <path d={p} fill="none" stroke="rgba(43,192,255,0.06)" strokeWidth={1} />
                            <motion.path d={p} fill="none" stroke="rgba(43,192,255,0.4)" strokeWidth={1.5} strokeLinecap="round" filter="url(#dGlow)"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: "easeOut" }} />
                            {/* Traveling package */}
                            <motion.path d={p} fill="none" stroke="#2BC0FF" strokeWidth={2} strokeLinecap="round" filter="url(#dGlow)"
                                strokeDasharray="0.04 0.96" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -1 }}
                                transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "linear", delay: 0.8 + i * 0.15 }} />
                        </React.Fragment>
                    );
                })}
                {/* Buenos Aires hub */}
                <motion.circle cx={BA_HUB.x} cy={BA_HUB.y} r={12} fill="none" stroke="rgba(43,192,255,0.3)" strokeWidth={1} animate={{ r: [12, 20, 12], opacity: [0.2, 0, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
                <circle cx={BA_HUB.x} cy={BA_HUB.y} r={7} fill="#2BC0FF" filter="url(#dGlow)" />
                <text x={BA_HUB.x + 15} y={BA_HUB.y + 5} fill="rgba(255,255,255,0.7)" fontSize={11} fontWeight={700}>Buenos Aires</text>
                {/* City nodes */}
                {AR_CITIES.map((city, i) => (
                    <motion.g key={city.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.12 }}>
                        <circle cx={city.x} cy={city.y} r={4} fill="#2BC0FF" opacity={0.7} />
                        <text x={city.x - 5} y={city.y - 10} fill="rgba(255,255,255,0.55)" fontSize={9} fontWeight={500}>{city.label}</text>
                    </motion.g>
                ))}
            </svg>
            {/* Bottom bar */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-lg"
                style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
                <div className="flex items-center gap-2">
                    <Truck size={14} style={{ color: "#2BC0FF" }} />
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Cobertura nacional</span>
                </div>
                <div className="flex gap-2">
                    {["Ecommerce", "Depósitos", "Puerta a puerta"].map(t => (
                        <span key={t} className="text-[9px] font-semibold px-2 py-1 rounded"
                            style={{ background: "rgba(43,192,255,0.08)", color: "rgba(43,192,255,0.8)", border: "1px solid rgba(43,192,255,0.15)" }}>{t}</span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ══════════════════════════════════════════════
   MOBILE ACCORDION
   ══════════════════════════════════════════════ */
function MobileAccordion({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
    return (
        <div className="space-y-2">
            {STAGES.map((stage, i) => {
                const isActive = i === active;
                const Icon = stage.icon;
                return (
                    <div key={stage.id} style={{ borderRadius: 12, overflow: "hidden", background: isActive ? "rgba(43,192,255,0.03)" : "rgba(255,255,255,0.02)", border: `1px solid ${isActive ? "rgba(43,192,255,0.15)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.3s ease" }}>
                        <button onClick={() => onSelect(i)} className="w-full flex items-center justify-between p-4" style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <div className="flex items-center gap-3">
                                <Icon size={18} style={{ color: isActive ? "#2BC0FF" : "rgba(255,255,255,0.3)" }} />
                                <span className="text-sm font-semibold" style={{ color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.5)" }}>{stage.title}</span>
                            </div>
                            <motion.span animate={{ rotate: isActive ? 45 : 0 }} style={{ color: isActive ? "#2BC0FF" : "rgba(255,255,255,0.15)", fontSize: 20, fontWeight: 300 }}>+</motion.span>
                        </button>
                        <AnimatePresence>
                            {isActive && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                                    <div className="px-4 pb-4">
                                        <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>{stage.description}</p>
                                        <span className="text-xs font-semibold inline-flex items-center gap-1.5 mb-3" style={{ color: "#2BC0FF" }}>{stage.cta} <ArrowRight size={12} /></span>
                                        <div className="rounded-lg overflow-hidden mt-2" style={{ height: 220, background: PANEL_BG, border: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
                                            <MobileScene stage={i} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

function MobileScene({ stage }: { stage: number }) {
    const scenes = [
        { icon: Globe, items: [{ l: "China", c: "#2BC0FF" }, { l: "España", c: "#2BC0FF" }, { l: "Pakistán", c: "#2BC0FF" }, { l: "USA", c: "#2BC0FF" }], sub: "4 regiones · 12+ hubs · Red activa" },
        { icon: Box, items: [{ l: "Verificado", c: "#22c55e" }, { l: "Etiquetado", c: "#22c55e" }, { l: "347 kg", c: "#2BC0FF" }], sub: "24 bultos · En proceso" },
        { icon: Plane, items: [{ l: "SHP-28419", c: "#2BC0FF" }, { l: "ETA: 12 días", c: "#fbbf24" }, { l: "UPS", c: "white" }], sub: "En tránsito · Guangzhou → BA" },
        { icon: Settings, items: [{ l: "8 en despacho", c: "#2BC0FF" }, { l: "14 preparando", c: "#fbbf24" }, { l: "23 entregados", c: "#22c55e" }], sub: "Almacén · ARCA · MeLi Full" },
        { icon: Truck, items: [{ l: "Ecommerce", c: "#2BC0FF" }, { l: "Depósitos", c: "#2BC0FF" }, { l: "Puerta a puerta", c: "#2BC0FF" }], sub: "Cobertura nacional" },
    ];
    const s = scenes[stage];
    const Icon = s.icon;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}
                style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(43,192,255,0.1)", border: "1px solid rgba(43,192,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={24} style={{ color: "#2BC0FF" }} />
            </motion.div>
            <div className="flex gap-2 flex-wrap justify-center">
                {s.items.map((item, i) => (
                    <motion.span key={item.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                        className="text-[11px] font-semibold px-3 py-1.5 rounded-md font-mono" style={{ ...CARD_STYLE, color: item.c }}>{item.l}</motion.span>
                ))}
            </div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{s.sub}</motion.span>
        </div>
    );
}
