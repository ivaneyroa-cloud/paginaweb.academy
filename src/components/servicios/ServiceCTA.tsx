"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Send, CheckCircle, Loader2 } from "lucide-react";
import { useI18n } from "@/i18n";
import type { ServiceLandingData } from "./types";

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;

/* ── Shared input styles ── */
const INPUT_STYLE: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#FFFFFF",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
};

const INPUT_FOCUS: Partial<React.CSSProperties> = {
    borderColor: "rgba(43,192,255,0.3)",
    background: "rgba(255,255,255,0.06)",
};

/* ── Quote Form ── */
function QuoteForm({ isInView }: { isInView: boolean }) {
    const { t } = useI18n();
    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        peso: "",
        origen: "china",
        yaImporta: false,
        company: "", // honeypot
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [focused, setFocused] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "sending") return;

        setStatus("sending");
        try {
            const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6"
            >
                <CheckCircle size={40} style={{ color: "#2BC0FF" }} />
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF" }}>
                    {t("svc_form.success", "¡Recibimos tu consulta!")}
                </p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>
                    {t("svc_form.success_desc", "Te contactamos a la brevedad.")}
                </p>
            </motion.div>
        );
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT }}
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto mt-8"
            style={{ textAlign: "left" }}
        >
            {/* Honeypot — hidden from humans */}
            <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-3">
                {/* Nombre */}
                <input
                    type="text"
                    placeholder={t("svc_form.name", "Tu nombre")}
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    onFocus={() => setFocused("nombre")}
                    onBlur={() => setFocused(null)}
                    style={{
                        ...INPUT_STYLE,
                        ...(focused === "nombre" ? INPUT_FOCUS : {}),
                    }}
                />

                {/* Teléfono */}
                <input
                    type="tel"
                    placeholder={t("svc_form.phone", "Teléfono / WhatsApp")}
                    required
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    onFocus={() => setFocused("telefono")}
                    onBlur={() => setFocused(null)}
                    style={{
                        ...INPUT_STYLE,
                        ...(focused === "telefono" ? INPUT_FOCUS : {}),
                    }}
                />

                {/* Peso + Origen row */}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        placeholder={t("svc_form.weight", "Kg estimados")}
                        min="0"
                        value={form.peso}
                        onChange={(e) => setForm({ ...form, peso: e.target.value })}
                        onFocus={() => setFocused("peso")}
                        onBlur={() => setFocused(null)}
                        style={{
                            ...INPUT_STYLE,
                            ...(focused === "peso" ? INPUT_FOCUS : {}),
                        }}
                    />
                    <select
                        value={form.origen}
                        onChange={(e) => setForm({ ...form, origen: e.target.value })}
                        onFocus={() => setFocused("origen")}
                        onBlur={() => setFocused(null)}
                        style={{
                            ...INPUT_STYLE,
                            ...(focused === "origen" ? INPUT_FOCUS : {}),
                            cursor: "pointer",
                            appearance: "none",
                            WebkitAppearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23adb9cf' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                            paddingRight: "36px",
                        }}
                    >
                        <option value="china">China</option>
                        <option value="usa">{t("svc_form.usa", "Estados Unidos")}</option>
                        <option value="europa">{t("svc_form.europe", "Europa")}</option>
                    </select>
                </div>

                {/* Ya importás? */}
                <div
                    className="flex items-center gap-3"
                    style={{
                        padding: "10px 16px",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <span
                        style={{
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.65)",
                            flex: 1,
                        }}
                    >
                        {t("svc_form.already_importing", "¿Ya estás importando?")}
                    </span>
                    <div className="flex gap-2">
                        {[true, false].map((val) => (
                            <button
                                key={String(val)}
                                type="button"
                                onClick={() => setForm({ ...form, yaImporta: val })}
                                style={{
                                    padding: "5px 16px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    border: "1px solid",
                                    borderColor:
                                        form.yaImporta === val
                                            ? "rgba(43,192,255,0.3)"
                                            : "rgba(255,255,255,0.08)",
                                    background:
                                        form.yaImporta === val
                                            ? "rgba(43,192,255,0.1)"
                                            : "transparent",
                                    color:
                                        form.yaImporta === val
                                            ? "#2BC0FF"
                                            : "rgba(255,255,255,0.55)",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                            >
                                {val ? t("svc_form.yes", "Sí") : t("svc_form.no", "No")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    whileHover={{
                        y: -2,
                        boxShadow: "0 8px 32px rgba(43,192,255,0.35)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden flex items-center justify-center gap-2 rounded-xl text-white mt-1"
                    style={{
                        background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                        fontWeight: 600,
                        fontSize: "15px",
                        padding: "14px 28px",
                        minHeight: "48px",
                        boxShadow: "0 4px 24px rgba(43,192,255,0.25)",
                        border: "none",
                        cursor: status === "sending" ? "wait" : "pointer",
                        fontFamily: "inherit",
                        width: "100%",
                    }}
                >
                    <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                        <span
                            className="servicios-shimmer absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                            }}
                        />
                    </span>
                    <span className="relative z-10 flex items-center gap-2">
                        {status === "sending" ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                {t("svc_form.sending", "Enviando...")}
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                {t("svc_form.submit", "Enviar consulta")}
                            </>
                        )}
                    </span>
                </motion.button>

                {status === "error" && (
                    <p style={{ fontSize: "13px", color: "#ff6b6b", textAlign: "center", marginTop: "4px" }}>
                        {t("svc_form.error", "Error al enviar. Intentá nuevamente.")}
                    </p>
                )}
            </div>
        </motion.form>
    );
}

/* ═══════════════════════════════════════════════════════
   SERVICE CTA — Final call-to-action block
   ═══════════════════════════════════════════════════════ */
export default function ServiceCTA({
    data,
}: {
    data: ServiceLandingData["cta"];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section
            ref={ref}
            className="relative overflow-hidden"
            style={{
                background: "var(--bg-deep)",
                paddingTop: "clamp(2rem, 4vw, 4rem)",
                paddingBottom: "clamp(4rem, 6vw, 8rem)",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={
                        isInView
                            ? { opacity: 1, y: 0, scale: 1 }
                            : {}
                    }
                    transition={{
                        duration: 0.6,
                        ease: EASE_OUT,
                    }}
                    className="relative text-center"
                    style={{
                        padding:
                            "clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)",
                        borderRadius: "20px",
                        background:
                            "linear-gradient(165deg, rgba(11,31,58,0.7) 0%, rgba(8,20,42,0.85) 50%, rgba(6,15,35,0.9) 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow:
                            "0 8px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                        overflow: "hidden",
                    }}
                >
                    {/* Inner glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(43,192,255,0.025) 0%, transparent 70%)",
                        }}
                    />

                    {/* Gradient accent line at top */}
                    <div
                        className="absolute top-0 left-[20%] right-[20%]"
                        style={{
                            height: "1px",
                            background:
                                "linear-gradient(to right, transparent, rgba(43,192,255,0.2), transparent)",
                        }}
                    />

                    <div className="relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : {}
                            }
                            transition={{
                                duration: 0.5,
                                delay: 0.1,
                                ease: EASE_OUT,
                            }}
                            style={{
                                fontSize: "clamp(22px, 4vw, 34px)",
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                lineHeight: 1.2,
                                color: "#FFFFFF",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}
                        >
                            {data.title}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : {}
                            }
                            transition={{
                                duration: 0.5,
                                delay: 0.2,
                                ease: EASE_OUT,
                            }}
                            style={{
                                fontSize: "clamp(14px, 2vw, 16px)",
                                lineHeight: 1.7,
                                color: "rgba(255,255,255,0.65)",
                                maxWidth: "480px",
                                margin: "16px auto 0",
                            }}
                        >
                            {data.subtitle}
                        </motion.p>

                        {/* Form or CTA button */}
                        {data.useForm ? (
                            <QuoteForm isInView={isInView} />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0 }
                                        : {}
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: 0.3,
                                    ease: EASE_OUT,
                                }}
                                className="mt-8"
                            >
                                <motion.a
                                    href={data.ctaHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{
                                        y: -2,
                                        boxShadow:
                                            "0 8px 32px rgba(43,192,255,0.35)",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl text-white"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                                        fontWeight: 600,
                                        fontSize: "15px",
                                        padding: "16px 36px",
                                        minHeight: "52px",
                                        boxShadow:
                                            "0 4px 24px rgba(43,192,255,0.25)",
                                    }}
                                >
                                    <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                                        <span
                                            className="servicios-shimmer absolute inset-0"
                                            style={{
                                                background:
                                                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                                            }}
                                        />
                                    </span>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {data.ctaLabel}
                                        <ArrowRight size={16} />
                                    </span>
                                </motion.a>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
