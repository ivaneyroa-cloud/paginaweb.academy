"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Package, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import { useI18n, type Locale } from "@/i18n";

/* ══════════════════════════════════════════════════════════
   NAVBAR — Premium, sobrio, tecnológico
   ──────────────────────────────────────────────────────────
   Jerarquía visual:
     Academy    → nav link premium (low weight)
     Rastrear   → utility action (medium weight)
     Cotizar    → CTA principal (high weight)
   ══════════════════════════════════════════════════════════ */

const LOCALES: { code: Locale; label: string }[] = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
];

export default function Navbar() {
    const { locale, setLocale, t } = useI18n();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [atTop, setAtTop] = useState(true);
    const lastY = useRef(0);
    const ticking = useRef(false);

    const handleScroll = useCallback(() => {
        if (ticking.current) return;
        ticking.current = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            setAtTop(y < 20);
            // Hide on scroll down, show on scroll up (only after 80px)
            if (y > 80) {
                setVisible(y < lastY.current || y < 80);
            } else {
                setVisible(true);
            }
            lastY.current = y;
            ticking.current = false;
        });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    return (
        <>
            <style>{`
                /* ── Navbar surface ── */
                .nav-surface {
                    background: linear-gradient(180deg, rgba(3,7,18,0.92) 0%, rgba(5,10,25,0.88) 100%);
                    backdrop-filter: blur(24px) saturate(1.2);
                    -webkit-backdrop-filter: blur(24px) saturate(1.2);
                }
                .nav-surface::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 8%;
                    right: 8%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(100,160,255,0.12) 30%, rgba(100,160,255,0.12) 70%, transparent 100%);
                    pointer-events: none;
                }
                .nav-scrolled::after {
                    left: 0;
                    right: 0;
                    background: linear-gradient(90deg, transparent 0%, rgba(100,160,255,0.08) 20%, rgba(100,160,255,0.08) 80%, transparent 100%);
                }

                /* ── Academy link ── */
                .nav-link-academy {
                    color: rgba(255,255,255,0.55);
                    font-size: 13.5px;
                    font-weight: 500;
                    letter-spacing: 0.01em;
                    position: relative;
                    padding: 4px 0;
                    transition: color 0.25s ease;
                }
                .nav-link-academy::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    height: 1.5px;
                    background: rgba(255,255,255,0.5);
                    border-radius: 1px;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .nav-link-academy:hover {
                    color: rgba(255,255,255,0.9);
                }
                .nav-link-academy:hover::after {
                    transform: scaleX(1);
                }

                /* ── Rastrear — utility action ── */
                .nav-utility {
                    color: rgba(255,255,255,0.5);
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.005em;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 7px 14px;
                    border-radius: 8px;
                    transition: all 0.25s ease;
                    position: relative;
                }
                .nav-utility:hover {
                    color: rgba(255,255,255,0.85);
                    background: rgba(255,255,255,0.05);
                }
                .nav-utility .nav-utility-icon {
                    opacity: 0.4;
                    transition: opacity 0.25s ease;
                }
                .nav-utility:hover .nav-utility-icon {
                    opacity: 0.7;
                }

                /* ── Cotizar CTA — premium solid ── */
                .nav-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 13.5px;
                    font-weight: 600;
                    letter-spacing: 0.01em;
                    color: #FFFFFF;
                    padding: 9px 22px 9px 20px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #1A95F0 0%, #22AAFF 50%, #1DA1FF 100%);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(29,161,255,0.18), inset 0 1px 0 rgba(255,255,255,0.1);
                    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                    position: relative;
                    overflow: hidden;
                }
                .nav-cta::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
                    transform: translateX(-110%);
                    transition: transform 0.6s ease;
                }
                .nav-cta:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 8px 24px rgba(29,161,255,0.25), inset 0 1px 0 rgba(255,255,255,0.12);
                }
                .nav-cta:hover::before {
                    transform: translateX(110%);
                }
                .nav-cta .nav-cta-arrow {
                    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
                    opacity: 0.85;
                }
                .nav-cta:hover .nav-cta-arrow {
                    transform: translateX(2px);
                    opacity: 1;
                }

                /* ── Separator ── */
                .nav-sep {
                    width: 1px;
                    height: 20px;
                    background: rgba(255,255,255,0.08);
                    margin: 0 4px;
                    flex-shrink: 0;
                }

                /* ── Language toggle ── */
                .lang-toggle {
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    padding: 3px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.06);
                }
                .lang-btn {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    padding: 4px 8px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: transparent;
                    color: rgba(255,255,255,0.35);
                    font-family: inherit;
                }
                .lang-btn:hover {
                    color: rgba(255,255,255,0.6);
                }
                .lang-btn.active {
                    background: rgba(43,192,255,0.12);
                    color: #2BC0FF;
                }
            `}</style>

            <header
                className={`fixed top-0 left-0 right-0 z-50 nav-surface ${!atTop ? 'nav-scrolled' : ''}`}
                style={{
                    transform: visible ? "translateY(0)" : "translateY(-100%)",
                    opacity: visible ? 1 : 0,
                    transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
                    willChange: "transform",
                }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-[68px]">
                    {/* ── Logo + Language Switcher ── */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center group select-none">
                            <img
                                src="/shippar-logo.webp"
                                alt="Shippar — Logística internacional y courier express"
                                width={154}
                                height={30}
                                className="h-[26px] md:h-[30px] w-auto transition-opacity duration-200 group-hover:opacity-85"
                            />
                        </Link>
                        <div className="lang-toggle">
                            {LOCALES.map((loc) => (
                                <button
                                    key={loc.code}
                                    className={`lang-btn ${locale === loc.code ? "active" : ""}`}
                                    onClick={() => setLocale(loc.code)}
                                    aria-label={`Switch to ${loc.label}`}
                                >
                                    {loc.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Desktop Nav ── */}
                    <nav className="hidden md:flex items-center gap-2">
                        {/* Servicios — premium link */}
                        <Link href="/servicios" className="nav-link-academy mr-3">
                            {t("nav.servicios")}
                        </Link>

                        {/* Academy — premium link */}
                        <Link href="/academy" className="nav-link-academy mr-3">
                            {t("nav.academy")}
                        </Link>

                        {/* Rastrear — utility action */}
                        <Link href="/rastreo" className="nav-utility">
                            <Package size={14} strokeWidth={1.8} className="nav-utility-icon" />
                            {t("nav.rastrear")}
                        </Link>

                        {/* Separator */}
                        <div className="nav-sep" />

                        {/* Cotizar — CTA principal */}
                        <a
                            href="https://shippar-app.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-cta"
                        >
                            {t("nav.cotizar")}
                            <ArrowRight size={14} strokeWidth={2} className="nav-cta-arrow" />
                        </a>
                    </nav>

                    {/* ── Mobile hamburger ── */}
                    <div className="md:hidden flex items-center gap-2">
                        {/* Mobile language toggle */}
                        <div className="lang-toggle">
                            {LOCALES.map((loc) => (
                                <button
                                    key={loc.code}
                                    className={`lang-btn ${locale === loc.code ? "active" : ""}`}
                                    onClick={() => setLocale(loc.code)}
                                >
                                    {loc.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 -mr-1 transition-colors duration-200"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                            aria-label="Menu"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* ═══ Mobile Menu ═══ */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 md:hidden"
                        style={{
                            background: "rgba(3,7,18,0.96)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                        }}
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-10">
                            {/* Servicios */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                            >
                                <Link
                                    href="/servicios"
                                    onClick={() => setMobileOpen(false)}
                                    className="text-xl font-medium transition-colors"
                                    style={{ color: "rgba(255,255,255,0.7)" }}
                                >
                                    {t("nav.servicios")}
                                </Link>
                            </motion.div>

                            {/* Academy */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Link
                                    href="/academy"
                                    onClick={() => setMobileOpen(false)}
                                    className="text-xl font-medium transition-colors"
                                    style={{ color: "rgba(255,255,255,0.7)" }}
                                >
                                    {t("nav.academy")}
                                </Link>
                            </motion.div>

                            {/* Rastrear */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <Link
                                    href="/rastreo"
                                    onClick={() => setMobileOpen(false)}
                                    className="text-xl font-medium flex items-center gap-3 transition-colors"
                                    style={{ color: "rgba(255,255,255,0.7)" }}
                                >
                                    <Package size={20} strokeWidth={1.8} style={{ opacity: 0.5 }} />
                                    {t("nav.rastrear")}
                                </Link>
                            </motion.div>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="absolute bottom-8 left-5 right-5"
                            >
                                <a
                                    href="https://shippar-app.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileOpen(false)}
                                    className="nav-cta flex items-center justify-center gap-2.5 text-base py-4 w-full"
                                    style={{ borderRadius: 14 }}
                                >
                                    {t("nav.cotizar")}
                                    <ArrowRight size={16} strokeWidth={2} className="nav-cta-arrow" />
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
