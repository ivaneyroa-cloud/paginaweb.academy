"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, Headset, X, Check,
    Phone, Truck as TruckPickup, Warehouse, FileText, Layers, Receipt,
    Plane, Radar, FileCheck, ShieldCheck, ClipboardCheck, PackageCheck,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n";

const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay, duration: 0.6, ease: "easeOut" as const },
});

/* ══════════════════════════════════════════════════════════
   HERO SECTION — refined with brand line + visual hierarchy
   ══════════════════════════════════════════════════════════ */

/* ── Phase definitions ── */
const PHASES = [
    { title: "Gestión en Origen", range: [0, 5] as const },
    { title: "Tránsito y Aduana", range: [6, 9] as const },
    { title: "Entrega Local", range: [10, 11] as const },
];

const PIPELINE_STEPS = [
    { name: "Contacto con proveedor", tag: "Guangzhou · Origen", icon: Phone, milestone: true },
    { name: "Coordinación de recolección", tag: "Pickup programado", icon: TruckPickup, milestone: false },
    { name: "Recepción en depósito", tag: "Warehouse internacional", icon: Warehouse, milestone: true },
    { name: "Valuación y documentación", tag: "Factura + packing list", icon: FileText, milestone: false },
    { name: "Consolidación de carga", tag: "Agrupamiento de bultos", icon: Layers, milestone: false },
    { name: "Gestión de invoice y posición arancelaria", tag: "Clasificación NCM/SIM", icon: Receipt, milestone: true },
    { name: "Puesta en tránsito internacional", tag: "Vuelo / embarque asignado", icon: Plane, milestone: true },
    { name: "Seguimiento en tiempo real", tag: "Tracking activo", icon: Radar, milestone: false },
    { name: "DSI — Despacho simplificado", tag: "Gestión aduanera AR", icon: FileCheck, milestone: true },
    { name: "Liberación aduanera", tag: "Canal asignado · OK", icon: ShieldCheck, milestone: true },
    { name: "Control en depósito Argentina", tag: "QC + preparación", icon: ClipboardCheck, milestone: false },
    { name: "Entrega a domicilio", tag: "Último tramo", icon: PackageCheck, milestone: true },
];

function playDeliveryPing() {
    try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    } catch {
        // silent
    }
}

export default function HeroSection() {
    const { t } = useI18n();
    const [mounted, setMounted] = useState(false);
    const [negocioActivated, setNegocioActivated] = useState(false);

    const [showNotif, setShowNotif] = useState(false);
    const notifSentinelRef = useRef<HTMLDivElement>(null);
    const notifTriggeredRef = useRef(false);

    const [overlayOpen, setOverlayOpen] = useState(false);
    const [activeSteps, setActiveSteps] = useState<number[]>([]);
    const [flashStep, setFlashStep] = useState<number | null>(null);
    const [opsCount, setOpsCount] = useState(0);
    const [progressH, setProgressH] = useState(0);
    const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        const t = setTimeout(() => setNegocioActivated(true), 1200);
        return () => clearTimeout(t);
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;
        const el = notifSentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !notifTriggeredRef.current) {
                    notifTriggeredRef.current = true;
                    setShowNotif(true);
                    playDeliveryPing();
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [mounted]);

    const startPipeline = useCallback(() => {
        setActiveSteps([]); setFlashStep(null); setOpsCount(0); setProgressH(0);
        let i = 0;
        const next = () => {
            if (i >= PIPELINE_STEPS.length) return;
            const idx = i;
            setActiveSteps(prev => [...prev, idx]);
            setFlashStep(idx);
            setOpsCount(idx + 1);
            setTimeout(() => setFlashStep(prev => prev === idx ? null : prev), 220);
            if (timelineRef.current) {
                const items = timelineRef.current.querySelectorAll('.tl-item');
                if (items[idx]) setProgressH((items[idx] as HTMLElement).offsetTop + (items[idx] as HTMLElement).offsetHeight / 2);
            }
            i++;
            if (i < PIPELINE_STEPS.length) animTimerRef.current = setTimeout(next, 280);
        };
        setTimeout(next, 400);
    }, []);

    const openOverlay = () => { setOverlayOpen(true); document.body.style.overflow = "hidden"; };

    const closeOverlay = useCallback(() => {
        setOverlayOpen(false); document.body.style.overflow = "";
        if (animTimerRef.current) clearTimeout(animTimerRef.current);
        setTimeout(() => { setActiveSteps([]); setFlashStep(null); setOpsCount(0); setProgressH(0); }, 350);
    }, []);

    useEffect(() => {
        if (overlayOpen) { const t = setTimeout(startPipeline, 500); return () => clearTimeout(t); }
    }, [overlayOpen, startPipeline]);

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape" && overlayOpen) closeOverlay(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [overlayOpen, closeOverlay]);

    return (
        <>
            <section
                id="hero"
                className="relative min-h-[75vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-0"
                style={{ background: "radial-gradient(ellipse 120% 80% at 50% 40%, #0a1530 0%, #060d22 40%, #040916 100%)" }}
            >
                <style>{`
                @keyframes gridMove {
                    from { transform: translateY(0); }
                    to   { transform: translateY(-60px); }
                }
                .hero-shimmer { animation: shimmer 3s infinite; }
                @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }

                /* ── negocio progressive fill ── */
                @property --negFill {
                    syntax: '<percentage>';
                    initial-value: 0%;
                    inherits: false;
                }
                .negocio-word {
                    position: relative;
                    display: inline-block;
                    padding-bottom: 0.05em;
                }
                .negocio-word.activated {
                    background: linear-gradient(90deg, #2BC0FF var(--negFill), #ffffff var(--negFill));
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: negFillAnim 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
                    filter: drop-shadow(0 0 20px rgba(43,192,255,0.18));
                }
                @keyframes negFillAnim { to { --negFill: 100%; } }

                /* ── Background depth — multi-layer ── */
                .hero-depth-glow {
                    position: absolute;
                    top: 35%;
                    left: 50%;
                    width: 1200px;
                    height: 900px;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(ellipse,
                        rgba(20,80,180,0.09) 0%,
                        rgba(15,55,140,0.04) 35%,
                        transparent 65%);
                    pointer-events: none;
                }
                .hero-depth-glow-top {
                    position: absolute;
                    top: -5%;
                    right: -10%;
                    width: 900px;
                    height: 700px;
                    background: radial-gradient(ellipse 70% 60%,
                        rgba(18,70,160,0.07) 0%,
                        rgba(12,45,120,0.025) 40%,
                        transparent 70%);
                    pointer-events: none;
                }
                .hero-depth-glow-bottom {
                    position: absolute;
                    bottom: -10%;
                    left: -8%;
                    width: 800px;
                    height: 600px;
                    background: radial-gradient(ellipse 65% 55%,
                        rgba(10,50,130,0.06) 0%,
                        rgba(8,35,100,0.02) 45%,
                        transparent 70%);
                    pointer-events: none;
                }
                .hero-depth-glow-accent {
                    position: absolute;
                    top: 55%;
                    right: 15%;
                    width: 500px;
                    height: 500px;
                    transform: translate(0, -50%);
                    background: radial-gradient(circle,
                        rgba(43,192,255,0.025) 0%,
                        transparent 60%);
                    pointer-events: none;
                    filter: blur(40px);
                }
                .hero-dot-texture {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
                    background-size: 28px 28px;
                    opacity: 0.05;
                    pointer-events: none;
                    mask-image: radial-gradient(ellipse 60% 55% at 50% 42%, black 10%, transparent 60%);
                    -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 42%, black 10%, transparent 60%);
                }

                /* ── Notification card — iOS style ── */
                .push-notif {
                    width: 380px;
                    max-width: 90vw;
                    padding: 12px 14px;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.97);
                    border: 1px solid rgba(255,255,255,0.35);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    box-shadow:
                        0 8px 30px rgba(0,0,0,0.18),
                        0 1px 3px rgba(0,0,0,0.10);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    transition: all 0.2s ease;
                    position: relative;
                }
                .push-notif:hover {
                    transform: scale(1.015);
                    box-shadow:
                        0 12px 40px rgba(0,0,0,0.22),
                        0 2px 6px rgba(0,0,0,0.12);
                }
                .push-notif:active { transform: scale(0.98); }

                .push-notif-cta {
                    font-size: 11px;
                    color: #007AFF;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    margin-top: 2px;
                }
                .push-notif-cta-arrow {
                    display: inline-block;
                    transition: transform 0.2s ease;
                    font-size: 12px;
                }
                .push-notif:hover .push-notif-cta-arrow {
                    transform: translateX(2px);
                }

                /* ── Pipeline overlay ── */
                .pipeline-overlay {
                    position: fixed; inset: 0; z-index: 9999;
                    background: rgba(3,8,18,0.94);
                    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
                    display: flex; flex-direction: column;
                    align-items: center;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    padding: 80px 16px 100px;
                }
                @media (min-width: 768px) {
                    .pipeline-overlay {
                        justify-content: center;
                        padding: 40px 16px;
                    }
                }
                .tl-item { transition: all 0.25s ease; }
                .tl-item.active { opacity: 1 !important; }
                .tl-item.flash .tl-node-circle {
                    border-color: rgba(43,192,255,0.35) !important;
                    box-shadow: 0 0 16px rgba(43,192,255,0.1);
                }
            `}</style>

                {/* Background — multi-layer depth */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background:
                        "radial-gradient(circle at 75% 25%, rgba(30,120,220,0.10), transparent 55%), " +
                        "radial-gradient(ellipse 55% 45% at 25% 65%, rgba(20,100,200,0.05) 0%, transparent 55%), " +
                        "radial-gradient(circle at 50% 50%, rgba(15,60,160,0.04), transparent 70%)",
                }} />
                <div className="hero-depth-glow" />
                <div className="hero-depth-glow-top" />
                <div className="hero-depth-glow-bottom" />
                <div className="hero-depth-glow-accent" />
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), " +
                        "linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    opacity: 0.18,
                    animation: "gridMove 35s linear infinite",
                    maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 70%)",
                }} />
                <div className="hero-dot-texture" />
                <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-[2]"
                    style={{ background: "linear-gradient(0deg, #040916 0%, rgba(4,9,22,0.6) 50%, transparent 100%)" }} />

                {/* ── Hero content ── */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full relative z-10 pointer-events-none flex justify-center">
                    <div className="flex flex-col items-center text-center" style={{ maxWidth: 900 }}>



                        <motion.h1
                            {...fadeUp(0)}
                            className="mt-6"
                            style={{ fontWeight: 900, letterSpacing: "-0.035em", color: "#FFFFFF", lineHeight: 1.06 }}
                        >
                            {/* "Tu negocio" */}
                            <span style={{ fontSize: "clamp(2.8rem, 6.8vw, 4.9rem)", display: "block" }}>
                                {t("hero.conecta")}{" "}
                                <span
                                    className={`negocio-word ${negocioActivated ? "activated" : ""}`}
                                    style={{ fontWeight: 950 }}
                                >
                                    {t("hero.negocio")}
                                </span>
                            </span>
                            {/* "con el mundo" — 8% larger */}
                            <span style={{
                                fontSize: "clamp(3rem, 7.5vw, 5.35rem)",
                                display: "block",
                                marginTop: "0.04em",
                                fontWeight: 900,
                                letterSpacing: "-0.025em",
                            }}>
                                {t("hero.conectado")}
                            </span>
                        </motion.h1>

                        <motion.p
                            {...fadeUp(0.1)}
                            className="text-center"
                            style={{
                                marginTop: 36,
                                fontSize: "clamp(1.05rem, 2vw, 1.22rem)",
                                lineHeight: 1.78,
                                color: "rgba(255,255,255,0.62)",
                                maxWidth: 540,
                            }}
                        >
                            {t("hero.subtitle_pre")}{" "}
                            <strong style={{ color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>
                                {t("hero.subtitle_bold")}
                            </strong>{" "}
                            {t("hero.subtitle_post")}
                        </motion.p>



                        <motion.div
                            {...fadeUp(0.2)}
                            className="flex flex-col sm:flex-row items-center gap-5"
                            style={{ marginTop: 48 }}
                        >
                            <a href="https://shippar-app.vercel.app/" target="_blank" rel="noopener noreferrer"
                                className="pointer-events-auto group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl text-white transition-all duration-300 hover:-translate-y-0.5"
                                style={{
                                    padding: "15px 38px",
                                    fontSize: "1.06rem",
                                    background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                    fontWeight: 600,
                                    boxShadow: "0 4px 24px rgba(43,192,255,0.28)",
                                }}>
                                <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                                    <span className="hero-shimmer absolute inset-0 -translate-x-full"
                                        style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)" }} />
                                </span>
                                <span className="relative z-10 flex items-center gap-2.5">
                                    {t("hero.cta_primary")} <ArrowRight size={19} />
                                </span>
                            </a>

                            <a href="https://wa.me/5491155955269" target="_blank" rel="noopener noreferrer"
                                className="pointer-events-auto group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                                style={{
                                    padding: "14px 32px",
                                    fontSize: "1.02rem",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: "rgba(255,255,255,0.04)",
                                    color: "rgba(255,255,255,0.8)",
                                    fontWeight: 600,
                                }}>
                                <span className="relative z-10 flex items-center gap-2.5">
                                    <Headset size={19} /> {t("hero.cta_secondary")}
                                </span>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ IN-FLOW NOTIFICATION ═══ */}
            <div
                ref={notifSentinelRef}
                style={{
                    background: "#050b1f",
                    display: "flex",
                    justifyContent: "center",
                    padding: "24px 16px 40px",
                    position: "relative",
                    zIndex: 10,
                }}
            >
                <AnimatePresence>
                    {showNotif && (
                        <motion.div
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="push-notif" onClick={openOverlay}>
                                {/* App icon — iOS style */}
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: "linear-gradient(135deg, #1DA1FF, #0d7fe8)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e", letterSpacing: "0.01em", marginRight: "auto" }}>SHIPPAR</span>
                                        <span style={{ fontSize: 10, color: "rgba(0,0,0,0.25)", fontWeight: 400 }}>{t("hero.notif_now")}</span>
                                    </div>
                                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1c1c1e", lineHeight: 1.35 }}>
                                        {t("hero.notif_delivered").replace("{code}", "")} <span style={{ color: "#007AFF", fontWeight: 700 }}>SHP-9399</span> ✓
                                    </div>
                                    <div className="push-notif-cta">
                                        {t("hero.notif_cta")} <span className="push-notif-cta-arrow">→</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ═══ PIPELINE OVERLAY ═══ */}
            <AnimatePresence>
                {overlayOpen && (
                    <motion.div
                        className="pipeline-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
                    >
                        <motion.button
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            onClick={closeOverlay}
                            style={{
                                position: "fixed", top: 20, right: 20,
                                width: 44, height: 44, borderRadius: 12,
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.18)",
                                color: "#FFFFFF",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                zIndex: 10001,
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <X size={18} strokeWidth={2.5} />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            style={{ textAlign: "center", marginBottom: 22 }}
                        >
                            <div style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.45rem)", fontWeight: 800, color: "rgba(255,255,255,0.92)", lineHeight: 1.35, letterSpacing: "-0.02em" }}>
                                {t("hero.overlay_you")} <strong style={{ color: "#2BC0FF" }}>{t("hero.overlay_bought")}</strong>.<br />
                                {t("hero.overlay_we")}
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 5, fontFamily: "'JetBrains Mono', monospace" }}>
                                SHP-9399 · China → Argentina · 7 días
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 14 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.3, 0.64, 1] }}
                            style={{
                                width: "90%", maxWidth: 680, borderRadius: 16,
                                background: "linear-gradient(180deg, rgba(9,17,35,0.98), rgba(6,13,28,0.99))",
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                                overflow: "hidden",
                            }}
                        >
                            {/* Top bar */}
                            <div style={{
                                display: "flex", alignItems: "center", padding: "10px 15px",
                                background: "rgba(0,0,0,0.18)", borderBottom: "1px solid rgba(255,255,255,0.03)",
                            }}>
                                <div style={{ display: "flex", gap: 5 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5f57" }} />
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#febc2e" }} />
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#28c840" }} />
                                </div>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.12)", marginLeft: 10 }}>
                                    shippar://envio/SHP-9399/historial
                                </span>
                                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: "8.5px", color: "#4ade80", fontWeight: 600 }}>
                                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 4px rgba(74,222,128,0.3)" }} />
                                    ENTREGADO
                                </div>
                            </div>

                            {/* Timeline */}
                            <div style={{ padding: "16px 28px 12px" }}>
                                <div ref={timelineRef} style={{ position: "relative", padding: "2px 0" }}>
                                    {/* Background track */}
                                    <div style={{ position: "absolute", left: 15, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.025)", borderRadius: 1 }} />
                                    {/* Animated fill */}
                                    <div style={{
                                        position: "absolute", left: 15, top: 0, width: 2, height: progressH,
                                        background: "linear-gradient(180deg, #2BC0FF, #4ade80)",
                                        borderRadius: 1, transition: "height 0.2s ease-out",
                                        boxShadow: "0 0 8px rgba(43,192,255,0.3)",
                                    }} />

                                    {PHASES.map((phase, pi) => {
                                        const [start, end] = phase.range;
                                        const stepsInPhase = PIPELINE_STEPS.slice(start, end + 1);
                                        const phaseActive = activeSteps.some(s => s >= start && s <= end);
                                        return (
                                            <div key={pi}>
                                                {/* Phase header */}
                                                <div style={{
                                                    display: "flex", alignItems: "center", gap: 8,
                                                    padding: pi === 0 ? "0 0 6px 38px" : "10px 0 6px 38px",
                                                    opacity: phaseActive ? 1 : 0.25,
                                                    transition: "opacity 0.3s",
                                                }}>
                                                    <span style={{
                                                        fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                                                        textTransform: "uppercase" as const, color: "#2BC0FF",
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                    }}>{pi + 1}. {t(`phase.${pi}`)}</span>
                                                    <div style={{ flex: 1, height: 1, background: "rgba(43,192,255,0.08)" }} />
                                                </div>

                                                {/* Steps in phase */}
                                                {stepsInPhase.map((step, si) => {
                                                    const idx = start + si;
                                                    const isActive = activeSteps.includes(idx);
                                                    const isFlash = flashStep === idx;
                                                    const StepIcon = step.icon;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`tl-item ${isActive ? "active" : ""} ${isFlash ? "flash" : ""}`}
                                                            style={{
                                                                display: "flex", alignItems: "flex-start", gap: 10,
                                                                padding: "5px 0",
                                                                opacity: isActive ? 1 : 0.1,
                                                                transition: "opacity 0.25s",
                                                            }}
                                                        >
                                                            {/* Node */}
                                                            <div style={{
                                                                width: 32, height: 32, borderRadius: step.milestone ? 10 : "50%",
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                flexShrink: 0, zIndex: 2, position: "relative",
                                                                background: isActive
                                                                    ? (step.milestone ? "rgba(43,192,255,0.08)" : "rgba(7,14,30,1)")
                                                                    : "rgba(7,14,30,1)",
                                                                border: `1.5px solid ${isActive
                                                                    ? (step.milestone ? "rgba(43,192,255,0.25)" : "rgba(74,222,128,0.2)")
                                                                    : "rgba(255,255,255,0.035)"
                                                                }`,
                                                                transition: "all 0.25s ease",
                                                                boxShadow: isFlash ? "0 0 12px rgba(43,192,255,0.3)" : "none",
                                                            }}>
                                                                {isActive
                                                                    ? step.milestone
                                                                        ? <StepIcon size={14} style={{ color: "#2BC0FF" }} />
                                                                        : <Check size={11} style={{ color: "#4ade80" }} strokeWidth={2.5} />
                                                                    : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.035)" }} />
                                                                }
                                                            </div>

                                                            {/* Text */}
                                                            <div style={{ flex: 1, paddingTop: 4 }}>
                                                                <div style={{
                                                                    fontSize: 12, fontWeight: 600,
                                                                    color: isActive ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.18)",
                                                                    transition: "all 0.25s", lineHeight: 1.2,
                                                                }}>{t(`pipeline.${idx}.name`)}</div>
                                                                <div style={{
                                                                    fontSize: 9.5, fontFamily: "'JetBrains Mono', monospace",
                                                                    color: isActive ? "rgba(148,163,184,0.65)" : "rgba(148,163,184,0.15)",
                                                                    marginTop: 2, transition: "all 0.25s",
                                                                    letterSpacing: "0.02em",
                                                                }}>{t(`pipeline.${idx}.tag`)}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.04)",
                                background: "linear-gradient(90deg, rgba(43,192,255,0.02) 0%, rgba(0,0,0,0.1) 100%)",
                            }}>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.48)" }}>
                                    <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800 }}>12 operaciones</strong> para un solo click tuyo.
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontWeight: 900, fontSize: 28, color: "#4ade80", lineHeight: 1, textShadow: "0 0 20px rgba(74,222,128,0.3)" }}>{opsCount}</div>
                                        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginTop: 2, fontWeight: 600 }}>operaciones</div>
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,0.08)", fontWeight: 900, fontSize: 14 }}>vs</div>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontWeight: 900, fontSize: 28, color: "#2BC0FF", lineHeight: 1, textShadow: "0 0 20px rgba(43,192,255,0.3)" }}>1</div>
                                        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginTop: 2, fontWeight: 600 }}>compra tuya</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mobile bottom close button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            onClick={closeOverlay}
                            className="md:hidden"
                            style={{
                                position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
                                padding: "12px 32px", borderRadius: 14,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "rgba(255,255,255,0.7)",
                                cursor: "pointer",
                                fontSize: 14, fontWeight: 600,
                                zIndex: 10001,
                                backdropFilter: "blur(8px)",
                                display: "flex", alignItems: "center", gap: 8,
                            }}
                        >
                            <X size={16} /> Cerrar
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
