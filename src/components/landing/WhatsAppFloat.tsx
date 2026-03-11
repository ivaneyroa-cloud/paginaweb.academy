"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════════════════════════
   WhatsApp Float — Premium pill design
   Branded for Shippar, not generic green circle.
   Subtle glow pulse every ~20s, hover micro-interactions.
   ══════════════════════════════════════════════════════════ */

export default function WhatsAppFloat() {
    const [isHovered, setIsHovered] = useState(false);
    const [showPulse, setShowPulse] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    /* Periodic subtle glow pulse every ~20s */
    useEffect(() => {
        const interval = setInterval(() => {
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 1500);
        }, 20000);
        // First pulse after 8s
        const first = setTimeout(() => {
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 1500);
        }, 8000);
        return () => {
            clearInterval(interval);
            clearTimeout(first);
        };
    }, []);

    return (
        <div
            className="fixed z-50"
            style={{ bottom: "1.5rem", right: "1.5rem" }}
        >
            {/* Hover micro-text */}
            <AnimatePresence>
                {isHovered && !isMobile && (
                    <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 whitespace-nowrap text-[11px] font-medium px-3 py-1.5 rounded-lg"
                        style={{
                            bottom: "calc(100% + 8px)",
                            background: "rgba(10,17,40,0.92)",
                            color: "rgba(255,255,255,0.7)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(12px)",
                        }}
                    >
                        Respondemos rápido
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Pulse ring */}
            <AnimatePresence>
                {showPulse && (
                    <motion.div
                        initial={{ opacity: 0.6, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                            background: "transparent",
                            border: "1.5px solid rgba(43,192,255,0.3)",
                            margin: "-3px",
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Pill button */}
            <a
                href="https://wa.me/5491139243790"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-all duration-300"
                style={{
                    padding: isMobile ? "10px 16px" : "11px 20px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, rgba(15,25,50,0.95) 0%, rgba(10,20,42,0.98) 100%)",
                    border: "1px solid rgba(43,192,255,0.15)",
                    boxShadow: isHovered
                        ? "0 8px 32px rgba(43,192,255,0.15), 0 0 0 1px rgba(43,192,255,0.1)"
                        : "0 4px 20px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    cursor: "pointer",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label="Contactar por WhatsApp"
            >
                {/* WhatsApp icon — tinted to match brand */}
                <svg
                    viewBox="0 0 24 24"
                    style={{
                        width: isMobile ? 18 : 20,
                        height: isMobile ? 18 : 20,
                        color: isHovered ? "#2BC0FF" : "#25D366",
                        transition: "color 0.3s ease, transform 0.3s ease",
                        transform: isHovered ? "scale(1.1)" : "scale(1)",
                        flexShrink: 0,
                    }}
                    fill="currentColor"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>

                {/* Text */}
                <span
                    className="font-semibold"
                    style={{
                        fontSize: isMobile ? "12px" : "13px",
                        color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
                        transition: "color 0.3s ease",
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                    }}
                >
                    Hablar por WhatsApp
                </span>
            </a>
        </div>
    );
}
