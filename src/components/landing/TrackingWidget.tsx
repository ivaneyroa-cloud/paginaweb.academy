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
    ChevronDown,
    ChevronUp,
    X,
    Loader2,
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
        bg: "rgba(167,139,250,0.12)",
        icon: <Package className="w-5 h-5" />,
        progress: 15,
    },
    pickup: {
        label: "Recogido",
        color: "#60a5fa",
        bg: "rgba(96,165,250,0.12)",
        icon: <Package className="w-5 h-5" />,
        progress: 30,
    },
    in_transit: {
        label: "En Tránsito",
        color: "#2BC0FF",
        bg: "rgba(43,192,255,0.12)",
        icon: <Truck className="w-5 h-5" />,
        progress: 60,
    },
    delivered: {
        label: "Entregado",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.12)",
        icon: <CheckCircle2 className="w-5 h-5" />,
        progress: 100,
    },
    exception: {
        label: "Excepción",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.12)",
        icon: <AlertTriangle className="w-5 h-5" />,
        progress: 50,
    },
    returned: {
        label: "Devuelto",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.12)",
        icon: <AlertTriangle className="w-5 h-5" />,
        progress: 0,
    },
};

function formatDate(raw: string): string {
    if (!raw) return "";
    // UPS sends YYYYMMDD
    if (raw.length === 8) {
        const y = raw.substring(0, 4);
        const m = raw.substring(4, 6);
        const d = raw.substring(6, 8);
        return `${d}/${m}/${y}`;
    }
    // Already ISO
    if (raw.includes("-")) {
        const [y, m, d] = raw.split("-");
        return `${d}/${m}/${y}`;
    }
    return raw;
}

function formatTime(raw: string): string {
    if (!raw) return "";
    // UPS sends HHMMSS
    if (raw.length === 6) {
        return `${raw.substring(0, 2)}:${raw.substring(2, 4)}`;
    }
    return raw;
}

/* ─── Component ─── */
export default function TrackingWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<TrackingData | null>(null);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Listen for toggle event from Navbar
    useEffect(() => {
        function handleToggle() {
            setIsOpen((prev) => !prev);
        }
        window.addEventListener("toggle-tracking", handleToggle);
        return () => window.removeEventListener("toggle-tracking", handleToggle);
    }, []);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                const trigger = document.getElementById("tracking-trigger-btn");
                if (trigger && trigger.contains(e.target as Node)) return;
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

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
        setTimeout(() => inputRef.current?.focus(), 100);
    }

    const cfg = result ? statusConfig[result.status] ?? statusConfig.in_transit : null;

    return (
        <>

            {/* ── Backdrop ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-[9998] bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── Tracking Panel ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={panelRef}
                        className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[9999] w-full sm:w-[420px] max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl"
                        style={{
                            background: "rgba(5, 11, 31, 0.97)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow:
                                "0 -8px 60px rgba(0,0,0,0.6), 0 0 40px rgba(43,192,255,0.08)",
                            backdropFilter: "blur(10px)",
                        }}
                        initial={{ opacity: 0, y: 80, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 80, scale: 0.95 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center justify-between px-5 py-4"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: "rgba(43,192,255,0.12)" }}
                                >
                                    <Package className="w-4 h-4 text-[#2BC0FF]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">
                                        Seguimiento UPS
                                    </h3>
                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                        Rastreá tu envío en tiempo real
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                                aria-label="Cerrar"
                            >
                                <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 72px)" }}>
                            {/* Search */}
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 outline-none transition-all focus:ring-1"
                                        style={{
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = "rgba(43,192,255,0.4)";
                                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,192,255,0.08)";
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                        placeholder="Ingresá el N° de tracking"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Search
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: "var(--text-muted)" }}
                                    />
                                </div>
                                <motion.button
                                    onClick={handleTrack}
                                    disabled={loading || !trackingNumber.trim()}
                                    className="px-5 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                                    style={{
                                        background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Buscar"
                                    )}
                                </motion.button>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        className="flex items-start gap-3 p-3.5 rounded-xl mb-4"
                                        style={{
                                            background: "rgba(239,68,68,0.08)",
                                            border: "1px solid rgba(239,68,68,0.2)",
                                        }}
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                    >
                                        <AlertTriangle className="w-4 h-4 mt-0.5 text-red-400 shrink-0" />
                                        <p className="text-sm text-red-300">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Loading skeleton */}
                            {loading && (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="h-16 rounded-xl animate-pulse"
                                            style={{ background: "rgba(255,255,255,0.04)" }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Results */}
                            <AnimatePresence>
                                {result && cfg && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 12 }}
                                        className="space-y-4"
                                    >
                                        {/* Status card */}
                                        <div
                                            className="rounded-xl p-4"
                                            style={{
                                                background: cfg.bg,
                                                border: `1px solid ${cfg.color}25`,
                                            }}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                    style={{ background: `${cfg.color}20`, color: cfg.color }}
                                                >
                                                    {cfg.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p
                                                        className="text-sm font-bold"
                                                        style={{ color: cfg.color }}
                                                    >
                                                        {cfg.label}
                                                    </p>
                                                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                                        {result.statusDescription}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div
                                                className="h-1.5 rounded-full overflow-hidden"
                                                style={{ background: "rgba(255,255,255,0.06)" }}
                                            >
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ background: cfg.color }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${cfg.progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </div>

                                            {/* Milestones */}
                                            <div className="flex justify-between mt-2">
                                                {["Procesado", "Recogido", "En Tránsito", "Entregado"].map(
                                                    (label, i) => {
                                                        const thresholds = [15, 30, 60, 100];
                                                        const reached = cfg.progress >= thresholds[i];
                                                        return (
                                                            <span
                                                                key={label}
                                                                className="text-[10px] font-medium"
                                                                style={{
                                                                    color: reached ? cfg.color : "var(--text-muted)",
                                                                    opacity: reached ? 1 : 0.5,
                                                                }}
                                                            >
                                                                {label}
                                                            </span>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>

                                        {/* Shipment details */}
                                        <div
                                            className="grid grid-cols-2 gap-3 p-4 rounded-xl"
                                            style={{
                                                background: "rgba(255,255,255,0.02)",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            {result.estimatedDelivery && (
                                                <div className="flex items-start gap-2">
                                                    <Clock
                                                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                                                        style={{ color: "var(--text-muted)" }}
                                                    />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                                            Entrega estimada
                                                        </p>
                                                        <p className="text-sm font-semibold text-white">
                                                            {formatDate(result.estimatedDelivery)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {result.deliveredDate && (
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2
                                                        className="w-3.5 h-3.5 mt-0.5 shrink-0 text-green-400"
                                                    />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                                            Entregado
                                                        </p>
                                                        <p className="text-sm font-semibold text-green-400">
                                                            {formatDate(result.deliveredDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {result.origin && (
                                                <div className="flex items-start gap-2">
                                                    <MapPin
                                                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                                                        style={{ color: "var(--text-muted)" }}
                                                    />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                                            Origen
                                                        </p>
                                                        <p className="text-xs text-white">{result.origin}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {result.destination && (
                                                <div className="flex items-start gap-2">
                                                    <MapPin
                                                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                                                        style={{ color: "#2BC0FF" }}
                                                    />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                                            Destino
                                                        </p>
                                                        <p className="text-xs text-white">{result.destination}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {result.service && (
                                                <div className="flex items-start gap-2">
                                                    <Truck
                                                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                                                        style={{ color: "var(--text-muted)" }}
                                                    />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                                            Servicio
                                                        </p>
                                                        <p className="text-xs text-white">{result.service}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {result.weight && (
                                                <div className="flex items-start gap-2">
                                                    <Package
                                                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                                                        style={{ color: "var(--text-muted)" }}
                                                    />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                                            Peso
                                                        </p>
                                                        <p className="text-xs text-white">{result.weight}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Activity Timeline */}
                                        {result.activities.length > 0 && (
                                            <div>
                                                <button
                                                    className="flex items-center gap-2 text-xs font-semibold mb-3 cursor-pointer"
                                                    style={{ color: "var(--text-secondary)" }}
                                                    onClick={() => setShowAllActivities(!showAllActivities)}
                                                >
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Historial de movimientos ({result.activities.length})
                                                    {showAllActivities ? (
                                                        <ChevronUp className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                    )}
                                                </button>

                                                <AnimatePresence>
                                                    {showAllActivities && (
                                                        <motion.div
                                                            className="space-y-0 ml-1"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            {result.activities.map((act, i) => {
                                                                const isFirst = i === 0;
                                                                const isDelivered =
                                                                    act.statusCode === "011" || act.statusCode === "D";
                                                                const dotColor = isFirst
                                                                    ? cfg.color
                                                                    : "rgba(255,255,255,0.2)";

                                                                return (
                                                                    <div key={i} className="flex gap-3 relative">
                                                                        {/* Timeline line */}
                                                                        <div className="flex flex-col items-center">
                                                                            <div
                                                                                className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                                                                                style={{
                                                                                    background: dotColor,
                                                                                    boxShadow: isFirst
                                                                                        ? `0 0 8px ${cfg.color}60`
                                                                                        : "none",
                                                                                }}
                                                                            />
                                                                            {i < result.activities.length - 1 && (
                                                                                <div
                                                                                    className="w-px flex-1 min-h-[24px]"
                                                                                    style={{
                                                                                        background: "rgba(255,255,255,0.06)",
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        {/* Activity info */}
                                                                        <div className="pb-4 flex-1">
                                                                            <p
                                                                                className="text-xs font-semibold"
                                                                                style={{
                                                                                    color: isDelivered
                                                                                        ? "#22c55e"
                                                                                        : isFirst
                                                                                            ? cfg.color
                                                                                            : "var(--text-secondary)",
                                                                                }}
                                                                            >
                                                                                {act.status}
                                                                            </p>
                                                                            <p
                                                                                className="text-[11px] mt-0.5"
                                                                                style={{ color: "var(--text-muted)" }}
                                                                            >
                                                                                {act.location}
                                                                            </p>
                                                                            <p
                                                                                className="text-[10px] mt-0.5"
                                                                                style={{ color: "var(--text-muted)", opacity: 0.6 }}
                                                                            >
                                                                                {formatDate(act.date)}{" "}
                                                                                {formatTime(act.time)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
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
                                            className="w-full py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                                            style={{
                                                color: "var(--text-secondary)",
                                                background: "rgba(255,255,255,0.03)",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            Buscar otro envío
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Empty state */}
                            {!loading && !result && !error && (
                                <div className="text-center py-6">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                                        style={{ background: "rgba(43,192,255,0.08)" }}
                                    >
                                        <Truck className="w-6 h-6" style={{ color: "#2BC0FF", opacity: 0.5 }} />
                                    </div>
                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                        Ingresá tu número de tracking UPS para ver el estado de tu envío
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
