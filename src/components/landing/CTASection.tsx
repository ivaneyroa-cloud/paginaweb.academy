"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n";

/* ══════════════════════════════════════════════════════════
   CTA — Final conversion block with functional form
   Sends data via /api/quote (nodemailer)
   ══════════════════════════════════════════════════════════ */

const ORIGINS = [
    { value: "china", label: "China" },
    { value: "usa", label: "Estados Unidos" },
    { value: "europa", label: "Europa" },
];

/* ── SVG icons (inline, no emoji) ── */
const ChevronRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="cta-arrow-icon">
        <path d="M7 4.5L11.5 9L7 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <path d="M12 2L3 7V12C3 17.25 6.75 22.13 12 23C17.25 22.13 21 17.25 21 12V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SparkleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" opacity="0.7" />
    </svg>
);

type FormStatus = "idle" | "sending" | "success" | "error";

/* ── Input shared styles ── */
const INPUT_STYLE: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#FFFFFF",
};

const LABEL_CLS = "block text-[11px] font-medium mb-1.5 uppercase tracking-wider";
const LABEL_STYLE: React.CSSProperties = { color: "#adb9cf" };

export default function CTASection() {
    const { t } = useI18n();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [origin, setOrigin] = useState("china");
    const [weight, setWeight] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async () => {
        /* Basic validation */
        if (!nombre.trim()) { setErrorMsg(t("cta.error_nombre")); return; }
        if (!telefono.trim()) { setErrorMsg(t("cta.error_telefono")); return; }
        setErrorMsg("");
        setStatus("sending");

        try {
            const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    telefono: telefono.trim(),
                    origen: origin,
                    peso: weight.trim() || null,
                    company: honeypot, // honeypot field
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Error al enviar.");
            }

            setStatus("success");
        } catch (err: unknown) {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "Error al enviar. Intentá nuevamente.");
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.borderColor = "rgba(43,192,255,0.3)";
        e.target.style.boxShadow = "0 0 0 3px rgba(43,192,255,0.06)";
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.borderColor = "rgba(255,255,255,0.1)";
        e.target.style.boxShadow = "none";
    };

    const isDisabled = status === "sending" || status === "success";

    return (
        <section
            ref={ref}
            id="cta-final"
            className="px-4"
            style={{
                background: "var(--bg-deep)",
                position: "relative",
                overflow: "hidden",
                paddingTop: "6rem",
                paddingBottom: "5rem",
            }}
        >
            {/* Ambient glow */}
            <div className="absolute pointer-events-none" style={{ width: 700, height: 700, top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(43,192,255,0.03) 0%, transparent 65%)", filter: "blur(60px)" }} />

            {/* Shimmer animation reused from Hero */}
            <style>{`
                .cta-shimmer { animation: ctaShimmer 3s infinite; }
                @keyframes ctaShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
                .cta-arrow-icon { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
                .cta-btn:hover .cta-arrow-icon { transform: translateX(4px); }
                .cta-btn:hover { box-shadow: 0 6px 32px rgba(43,192,255,0.35) !important; }
                .cta-btn:active { transform: translateY(0) scale(0.99) !important; }
            `}</style>

            {/* Section headline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-center mb-10 relative z-10"
            >
                <h2
                    className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold text-white"
                    style={{ letterSpacing: "-0.025em", lineHeight: 1.15 }}
                >
                    {t("cta.headline")}{" "}
                    <span style={{ color: "#2BC0FF" }}>{t("cta.headline_accent")}</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base" style={{ color: "#adb9cf" }}>
                    {t("cta.headline_sub")}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="relative max-w-[600px] mx-auto overflow-hidden"
                style={{
                    background: "linear-gradient(180deg, rgba(11,31,58,0.9) 0%, rgba(8,22,45,0.95) 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "1.25rem",
                    padding: "2.5rem 2rem",
                    boxShadow: "0 16px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.03) inset",
                }}
            >
                <div className="relative z-10">
                    {/* Headline */}
                    <h2
                        className="text-2xl sm:text-[28px] text-center"
                        style={{
                            color: "#FFFFFF",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {t("cta.card_title")}
                    </h2>

                    <p
                        className="mt-2 text-center text-sm mb-8"
                        style={{ color: "rgba(255,255,255,0.60)" }}
                    >
                        {t("cta.card_sub")}
                    </p>

                    {/* ═══ Success state ═══ */}
                    {status === "success" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-center py-8"
                        >
                            <div
                                className="mx-auto mb-4 flex items-center justify-center"
                                style={{
                                    width: 56, height: 56, borderRadius: "50%",
                                    background: "rgba(34,197,94,0.1)",
                                    border: "1.5px solid rgba(34,197,94,0.25)",
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13L9 17L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-white mb-2">
                                {t("cta.success_title")}
                            </p>
                            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                                {t("cta.success_desc")}
                            </p>
                            <button
                                onClick={() => {
                                    setStatus("idle");
                                    setNombre("");
                                    setTelefono("");
                                    setWeight("");
                                    setOrigin("china");
                                }}
                                className="mt-6 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                                style={{
                                    color: "#2BC0FF",
                                    background: "rgba(43,192,255,0.06)",
                                    border: "1px solid rgba(43,192,255,0.12)",
                                    cursor: "pointer",
                                }}
                            >
                                {t("cta.success_another")}
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            {/* ═══ Honeypot — invisible to humans ═══ */}
                            <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                                <label htmlFor="company">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                />
                            </div>

                            {/* ═══ Form fields — 2x2 grid ═══ */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {/* Nombre */}
                                <div>
                                    <label className={LABEL_CLS} style={LABEL_STYLE}>
                                        {t("cta.label_nombre")}
                                    </label>
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder={t("cta.placeholder_nombre")}
                                        disabled={isDisabled}
                                        className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                                        style={INPUT_STYLE}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className={LABEL_CLS} style={LABEL_STYLE}>
                                        {t("cta.label_telefono")}
                                    </label>
                                    <input
                                        type="tel"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        placeholder={t("cta.placeholder_telefono")}
                                        disabled={isDisabled}
                                        className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                                        style={INPUT_STYLE}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Origin */}
                                <div>
                                    <label className={LABEL_CLS} style={LABEL_STYLE}>
                                        {t("cta.label_origen")}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                            disabled={isDisabled}
                                            className="w-full appearance-none px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                                            style={{ ...INPUT_STYLE, cursor: "pointer" }}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        >
                                            {ORIGINS.map((o) => (
                                                <option key={o.value} value={o.value} style={{ background: "#0B1F3A" }}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div
                                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                            style={{ color: "rgba(255,255,255,0.35)" }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className={LABEL_CLS} style={LABEL_STYLE}>
                                        {t("cta.label_peso")}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            placeholder={t("cta.placeholder_peso")}
                                            disabled={isDisabled}
                                            className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                                            style={INPUT_STYLE}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                        <span
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                                            style={{ color: "rgba(255,255,255,0.3)" }}
                                        >
                                            kg
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Error message */}
                            {errorMsg && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-xs mb-4 font-medium"
                                    style={{ color: "#f87171" }}
                                >
                                    {errorMsg}
                                </motion.p>
                            )}

                            {/* ═══ Submit button ═══ */}
                            <button
                                onClick={handleSubmit}
                                disabled={isDisabled}
                                className="cta-btn w-full group relative overflow-hidden flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                style={{
                                    background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                    boxShadow: "0 4px 24px rgba(43,192,255,0.22)",
                                    fontSize: "0.95rem",
                                }}
                            >
                                {/* Shimmer sweep */}
                                <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                                    <span
                                        className="cta-shimmer absolute inset-0 -translate-x-full"
                                        style={{
                                            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                                        }}
                                    />
                                </span>
                                <span className="relative z-10 flex items-center gap-2.5">
                                    {status === "sending" ? (
                                        <>
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="inline-block"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                                                    <path d="M9 2A7 7 0 0 1 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </motion.span>
                                            {t("cta.sending")}
                                        </>
                                    ) : (
                                        <>
                                            {t("cta.submit")}
                                            <ChevronRightIcon />
                                        </>
                                    )}
                                </span>
                            </button>

                            {/* ═══ Support text ═══ */}
                            <div
                                className="flex items-center justify-center gap-1.5 mt-5"
                                style={{ color: "rgba(255,255,255,0.58)" }}
                            >
                                <ShieldCheckIcon />
                                <p className="text-[13px]" style={{ lineHeight: 1.5 }}>
                                    <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.70)" }}>
                                        {t("cta.trust")}
                                    </span>{" "}
                                    {t("cta.trust_desc")}
                                </p>
                            </div>

                            {/* Social proof */}
                            <div
                                className="flex items-center justify-center gap-1.5 mt-3"
                                style={{ color: "rgba(255,255,255,0.45)" }}
                            >
                                <SparkleIcon />
                                <p className="text-[11px] font-medium">
                                    {t("cta.social_proof")}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
