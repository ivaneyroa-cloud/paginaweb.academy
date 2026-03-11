"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Search,
    MapPin,
    Truck,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Loader2,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Plane,
    Warehouse,
    Radio,
    Zap,
    Shield,
} from "lucide-react";

/* ─── Types ─── */
interface Activity {
    date: string;
    time: string;
    location: string;
    status: string;
    statusCode: string;
}

interface TrackingData {
    trackingNumber: string;
    status: string;
    statusCode: string;
    statusDescription: string;
    estimatedDelivery: string | null;
    deliveredDate: string | null;
    origin: string;
    destination: string;
    service: string;
    weight: string;
    activities: Activity[];
}

/* ─── Status config ─── */
const statusConfig: Record<
    string,
    { label: string; color: string; bg: string; icon: React.ReactNode; progress: number }
> = {
    manifest: {
        label: "Orden Procesada",
        color: "#a78bfa",
        bg: "rgba(167,139,250,0.08)",
        icon: <Package className="w-6 h-6" />,
        progress: 15,
    },
    pickup: {
        label: "Recogido",
        color: "#60a5fa",
        bg: "rgba(96,165,250,0.08)",
        icon: <Package className="w-6 h-6" />,
        progress: 30,
    },
    in_transit: {
        label: "En Tránsito",
        color: "#2BC0FF",
        bg: "rgba(43,192,255,0.08)",
        icon: <Truck className="w-6 h-6" />,
        progress: 60,
    },
    delivered: {
        label: "Entregado",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.08)",
        icon: <CheckCircle2 className="w-6 h-6" />,
        progress: 100,
    },
    exception: {
        label: "Excepción",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.08)",
        icon: <AlertTriangle className="w-6 h-6" />,
        progress: 50,
    },
    returned: {
        label: "Devuelto",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.08)",
        icon: <AlertTriangle className="w-6 h-6" />,
        progress: 0,
    },
};

const MILESTONES = [
    { label: "Procesado", icon: Package, threshold: 15 },
    { label: "Recogido", icon: Warehouse, threshold: 30 },
    { label: "En Tránsito", icon: Plane, threshold: 60 },
    { label: "Entregado", icon: CheckCircle2, threshold: 100 },
];

function formatDate(raw: string): string {
    if (!raw) return "";
    if (raw.length === 8) {
        return `${raw.substring(6, 8)}/${raw.substring(4, 6)}/${raw.substring(0, 4)}`;
    }
    if (raw.includes("-")) {
        const [y, m, d] = raw.split("-");
        return `${d}/${m}/${y}`;
    }
    return raw;
}

function formatTime(raw: string): string {
    if (!raw) return "";
    if (raw.length === 6) {
        return `${raw.substring(0, 2)}:${raw.substring(2, 4)}`;
    }
    return raw;
}

/* ═══════════════════════════════════════════════
   RASTREO PAGE — Premium tracking tool
   ═══════════════════════════════════════════════ */
export default function RastreoPage() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<TrackingData | null>(null);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    async function handleTrack() {
        const num = trackingNumber.trim();
        if (!num) return;

        setLoading(true);
        setError(null);
        setResult(null);
        setShowAllActivities(false);

        try {
            const res = await fetch(`/api/tracking?number=${encodeURIComponent(num)}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Error al consultar. Intentá de nuevo.");
                return;
            }

            setResult(data);
        } catch {
            setError("Error de conexión. Intentá de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") handleTrack();
    }

    function handleReset() {
        setResult(null);
        setError(null);
        setTrackingNumber("");
        setShowAllActivities(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    }

    const cfg = result ? statusConfig[result.status] ?? statusConfig.in_transit : null;

    return (
        <section
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-deep)",
                paddingTop: "7rem",
                paddingBottom: "6rem",
            }}
        >
            {/* ── Background system ── */}
            <style>{`
                .rastreo-grid {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 80px 80px;
                    opacity: 0.35;
                    mask-image: radial-gradient(ellipse 55% 50% at 50% 35%, black 0%, transparent 70%);
                    -webkit-mask-image: radial-gradient(ellipse 55% 50% at 50% 35%, black 0%, transparent 70%);
                }
                .tracking-card-glow {
                    position: absolute;
                    width: 600px;
                    height: 400px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -55%);
                    background: radial-gradient(ellipse, rgba(43,192,255,0.06) 0%, rgba(20,80,180,0.03) 40%, transparent 70%);
                    pointer-events: none;
                    filter: blur(40px);
                }
                .tracking-input-row {
                    display: flex;
                    flex-direction: column;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    overflow: hidden;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                @media (min-width: 640px) {
                    .tracking-input-row {
                        flex-direction: row;
                        align-items: stretch;
                    }
                }
                .tracking-input-row.focused {
                    border-color: rgba(43,192,255,0.35);
                    box-shadow: 0 0 0 4px rgba(43,192,255,0.06), 0 0 30px rgba(43,192,255,0.04);
                }
                .tracking-input-row input {
                    flex: 1;
                    width: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: #FFFFFF;
                    font-size: 14px;
                    padding: 14px 14px 14px 44px;
                    min-width: 0;
                }
                @media (min-width: 640px) {
                    .tracking-input-row input {
                        font-size: 15px;
                        padding: 16px 16px 16px 48px;
                    }
                }
                .tracking-input-row input::placeholder {
                    color: rgba(255,255,255,0.28);
                }
                .tracking-input-row .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.3);
                    pointer-events: none;
                    transition: color 0.3s;
                }
                @media (min-width: 640px) {
                    .tracking-input-row .search-icon {
                        left: 16px;
                    }
                }
                .tracking-input-row.focused .search-icon {
                    color: rgba(43,192,255,0.6);
                }
                .tracking-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px 28px;
                    font-size: 14.5px;
                    font-weight: 600;
                    color: #FFFFFF;
                    background: linear-gradient(135deg, #1A95F0 0%, #22AAFF 50%, #1DA1FF 100%);
                    border: none;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.25s ease;
                    position: relative;
                    overflow: hidden;
                    border-top: 1px solid rgba(255,255,255,0.06);
                }
                @media (min-width: 640px) {
                    .tracking-btn {
                        padding: 0 28px;
                        border-top: none;
                        border-left: 1px solid rgba(255,255,255,0.06);
                    }
                }
                .tracking-btn:hover {
                    filter: brightness(1.08);
                    box-shadow: 0 4px 20px rgba(43,192,255,0.25);
                }
                .tracking-btn:active {
                    transform: scale(0.98);
                }
                .tracking-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    filter: none;
                    box-shadow: none;
                }
                .tracking-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
                    transform: translateX(-110%);
                    transition: transform 0.6s ease;
                }
                .tracking-btn:hover::after {
                    transform: translateX(110%);
                }
                .trust-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.05);
                    font-size: 12.5px;
                    color: rgba(255,255,255,0.45);
                    transition: all 0.25s ease;
                }
                .trust-pill:hover {
                    border-color: rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.55);
                }
                .trust-pill svg {
                    color: rgba(43,192,255,0.45);
                    flex-shrink: 0;
                }
            `}</style>

            <div className="absolute inset-0 pointer-events-none">
                {/* Radial glows */}
                <div style={{
                    position: "absolute",
                    width: 900, height: 900,
                    top: "-15%", right: "-15%",
                    background: "radial-gradient(circle, rgba(43,192,255,0.035) 0%, transparent 55%)",
                    filter: "blur(100px)",
                }} />
                <div style={{
                    position: "absolute",
                    width: 700, height: 700,
                    bottom: "-5%", left: "-10%",
                    background: "radial-gradient(circle, rgba(15,50,140,0.04) 0%, transparent 60%)",
                    filter: "blur(80px)",
                }} />
                {/* Grid */}
                <div className="rastreo-grid" />
            </div>

            <div className="max-w-2xl mx-auto px-4 md:px-6 relative z-10">
                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1
                        className="text-3xl md:text-4xl font-bold text-white"
                        style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}
                    >
                        Rastreá tu envío
                    </h1>
                    <p className="mt-3 text-base" style={{ color: "#adb9cf" }}>
                        Seguimiento 24/7 de tus envíos
                    </p>
                </motion.div>

                {/* ── Tracking card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="relative"
                >
                    {/* Glow behind card */}
                    <div className="tracking-card-glow" />

                    <div
                        className="rounded-2xl p-5 md:p-7 relative"
                        style={{
                            background: "linear-gradient(180deg, rgba(10,22,48,0.85) 0%, rgba(8,18,38,0.9) 100%)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            boxShadow: "0 12px 50px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                            backdropFilter: "blur(12px)",
                        }}
                    >
                        {/* Input row */}
                        <div className="relative">
                            <div className={`tracking-input-row ${inputFocused ? "focused" : ""}`}>
                                <div className="relative" style={{ flex: 1 }}>
                                    <Search size={18} className="search-icon" style={{ zIndex: 2 }} />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Ingresá tu número de seguimiento"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                    />
                                </div>
                                <button
                                    onClick={handleTrack}
                                    disabled={loading || !trackingNumber.trim()}
                                    className="tracking-btn"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Rastrear
                                            <ArrowRight size={15} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Hint */}
                        <p
                            className="mt-3 text-center"
                            style={{ fontSize: "12px", color: "rgba(255,255,255,0.30)" }}
                        >
                            Ej: 1Z999AA10123456784 · SHP-9399
                        </p>
                    </div>
                </motion.div>

                {/* ── Trust signals ── */}
                {!result && !loading && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
                    >
                        <div className="trust-pill">
                            <Radio size={14} />
                            <span>Tracking en tiempo real</span>
                        </div>
                        <div className="trust-pill">
                            <Zap size={14} />
                            <span>Resultados instantáneos</span>
                        </div>
                        <div className="trust-pill">
                            <Shield size={14} />
                            <span>Operación verificada</span>
                        </div>
                    </motion.div>
                )}

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="flex items-start gap-4 p-5 rounded-2xl mt-6"
                            style={{
                                background: "rgba(239,68,68,0.06)",
                                border: "1px solid rgba(239,68,68,0.15)",
                            }}
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                        >
                            <AlertTriangle className="w-5 h-5 mt-0.5 text-red-400 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-red-300 mb-1">No se encontró el envío</p>
                                <p className="text-sm text-red-300/70">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-4 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-24 rounded-2xl animate-pulse"
                                style={{ background: "rgba(255,255,255,0.03)" }}
                            />
                        ))}
                    </div>
                )}

                {/* Results */}
                <AnimatePresence>
                    {result && cfg && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="space-y-6 mt-6"
                        >
                            {/* Status hero card */}
                            <div
                                className="rounded-2xl p-6 md:p-8"
                                style={{
                                    background: cfg.bg,
                                    border: `1px solid ${cfg.color}20`,
                                    boxShadow: `0 0 60px ${cfg.color}08`,
                                }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                        style={{ background: `${cfg.color}18`, color: cfg.color }}
                                    >
                                        {cfg.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xl font-bold" style={{ color: cfg.color }}>
                                            {cfg.label}
                                        </p>
                                        <p className="text-sm" style={{ color: "#adb9cf" }}>
                                            {result.statusDescription}
                                        </p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs font-mono" style={{ color: "#8494b0" }}>
                                            TRACKING
                                        </p>
                                        <p className="text-sm font-mono font-bold text-white">
                                            {result.trackingNumber}
                                        </p>
                                    </div>
                                </div>

                                {/* Animated progress bar */}
                                <div
                                    className="h-2 rounded-full overflow-hidden mb-4"
                                    style={{ background: "rgba(255,255,255,0.06)" }}
                                >
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{
                                            background: `linear-gradient(90deg, ${cfg.color}90, ${cfg.color})`,
                                            boxShadow: `0 0 12px ${cfg.color}40`,
                                        }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cfg.progress}%` }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                    />
                                </div>

                                {/* Milestones */}
                                <div className="flex justify-between px-1">
                                    {MILESTONES.map((m, i) => {
                                        const reached = cfg.progress >= m.threshold;
                                        const MIcon = m.icon;
                                        return (
                                            <div key={m.label} className="flex flex-col items-center gap-1" style={{ minWidth: 0, flex: '1 1 0' }}>
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                                                    style={{
                                                        background: reached ? `${cfg.color}15` : "rgba(255,255,255,0.03)",
                                                        border: `1px solid ${reached ? `${cfg.color}30` : "rgba(255,255,255,0.06)"}`,
                                                    }}
                                                >
                                                    <MIcon
                                                        size={12}
                                                        style={{
                                                            color: reached ? cfg.color : "rgba(255,255,255,0.2)",
                                                        }}
                                                    />
                                                </motion.div>
                                                <span
                                                    className="text-[9px] sm:text-[10px] font-semibold text-center leading-tight"
                                                    style={{
                                                        color: reached ? cfg.color : "#8494b0",
                                                    }}
                                                >
                                                    {m.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Info grid */}
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl"
                                style={{
                                    background: "rgba(10,22,45,0.5)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                {result.estimatedDelivery && (
                                    <InfoCell
                                        icon={<Clock size={16} style={{ color: "#2BC0FF" }} />}
                                        label="Entrega estimada"
                                        value={formatDate(result.estimatedDelivery)}
                                        highlight
                                    />
                                )}
                                {result.deliveredDate && (
                                    <InfoCell
                                        icon={<CheckCircle2 size={16} style={{ color: "#22c55e" }} />}
                                        label="Entregado"
                                        value={formatDate(result.deliveredDate)}
                                    />
                                )}
                                {result.origin && (
                                    <InfoCell
                                        icon={<MapPin size={16} style={{ color: "#adb9cf" }} />}
                                        label="Origen"
                                        value={result.origin}
                                    />
                                )}

                                {result.service && (
                                    <InfoCell
                                        icon={<Truck size={16} style={{ color: "#adb9cf" }} />}
                                        label="Servicio"
                                        value={result.service}
                                    />
                                )}
                                {result.weight && (
                                    <InfoCell
                                        icon={<Package size={16} style={{ color: "#adb9cf" }} />}
                                        label="Peso"
                                        value={result.weight}
                                    />
                                )}
                            </div>

                            {/* Activity timeline */}
                            {result.activities.length > 0 && (
                                <div
                                    className="rounded-2xl overflow-hidden"
                                    style={{
                                        background: "rgba(10,22,45,0.5)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <button
                                        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer"
                                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                                        onClick={() => setShowAllActivities(!showAllActivities)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} style={{ color: "#2BC0FF" }} />
                                            <span className="text-sm font-semibold text-white">
                                                Historial de movimientos
                                            </span>
                                            <span
                                                className="text-xs font-mono px-2 py-0.5 rounded-md"
                                                style={{
                                                    background: "rgba(43,192,255,0.1)",
                                                    color: "#2BC0FF",
                                                }}
                                            >
                                                {result.activities.length}
                                            </span>
                                        </div>
                                        {showAllActivities ? (
                                            <ChevronUp size={16} style={{ color: "#adb9cf" }} />
                                        ) : (
                                            <ChevronDown size={16} style={{ color: "#adb9cf" }} />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {showAllActivities && (
                                            <motion.div
                                                className="px-6 py-4"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {result.activities.map((act, i) => {
                                                    const isFirst = i === 0;
                                                    const isDelivered = act.statusCode === "011" || act.statusCode === "D";
                                                    const dotColor = isFirst ? cfg.color : "rgba(255,255,255,0.15)";

                                                    return (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex gap-4 relative"
                                                        >
                                                            <div className="flex flex-col items-center">
                                                                <div
                                                                    className="w-3 h-3 rounded-full shrink-0 mt-1.5"
                                                                    style={{
                                                                        background: dotColor,
                                                                        boxShadow: isFirst ? `0 0 10px ${cfg.color}60` : "none",
                                                                    }}
                                                                />
                                                                {i < result.activities.length - 1 && (
                                                                    <div className="w-px flex-1 min-h-[28px]" style={{ background: "rgba(255,255,255,0.05)" }} />
                                                                )}
                                                            </div>
                                                            <div className="pb-5 flex-1">
                                                                <p
                                                                    className="text-sm font-semibold"
                                                                    style={{
                                                                        color: isDelivered ? "#22c55e" : isFirst ? cfg.color : "rgba(255,255,255,0.78)",
                                                                    }}
                                                                >
                                                                    {act.status}
                                                                </p>
                                                                <p className="text-xs mt-0.5" style={{ color: "#adb9cf" }}>
                                                                    {act.location}
                                                                </p>
                                                                <p className="text-[11px] mt-0.5 font-mono" style={{ color: "#8494b0" }}>
                                                                    {formatDate(act.date)} {formatTime(act.time)}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* New search */}
                            <button
                                onClick={handleReset}
                                className="w-full py-3.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                                style={{
                                    color: "#adb9cf",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(43,192,255,0.2)";
                                    e.currentTarget.style.color = "#2BC0FF";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                    e.currentTarget.style.color = "#adb9cf";
                                }}
                            >
                                Buscar otro envío
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

/* ── Info cell subcomponent ── */
function InfoCell({
    icon,
    label,
    value,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#8494b0" }}>
                    {label}
                </p>
                <p
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: highlight ? "#2BC0FF" : "white" }}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}
