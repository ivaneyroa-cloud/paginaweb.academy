"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

/* ─── Social icons (inline SVG for zero-dep, pixel-perfect control) ─── */
const socials = [
    {
        name: "Instagram",
        href: "https://www.instagram.com/shipparcourier_/",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        name: "LinkedIn",
        href: "https://ar.linkedin.com/company/shippar-courier",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: "Facebook",
        href: "https://www.facebook.com/p/Shippar-100088557181903/",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        name: "TikTok",
        href: "https://www.tiktok.com/@shippar_",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
        ),
    },
];

const CONTACT_PHONES = [
    { label: "Línea", number: "77129154", href: "tel:77129154" },
    { label: "WhatsApp", number: "+54 9 11 7119 0722", href: "https://wa.me/5491171190722" },
    { label: "WhatsApp", number: "+54 9 11 5595 5269", href: "https://wa.me/5491155955269" },
    { label: "WhatsApp", number: "+54 9 11 3924 3790", href: "https://wa.me/5491139243790" },
];



export default function Footer() {
    const { t } = useI18n();

    const NAV_LINKS = [
        { label: t("footer.nav.academy"), href: "/academy" },
        { label: t("footer.nav.contacto"), href: "/contacto" },
        { label: t("footer.nav.rastrear"), href: "/rastreo" },
        { label: t("footer.nav.cotizar"), href: "/contacto" },
    ];

    return (
        <footer
            style={{
                background: "#040916",
                borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            <div className="max-w-6xl mx-auto px-4 md:px-6 pt-14 pb-6">
                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                    {/* ── Col 1: Brand + Social ── */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                            <img src="/shippar-logo.png" alt="Shippar" className="h-5 w-auto" />
                        </div>
                        <p
                            className="text-[13px] font-medium tracking-wide"
                            style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}
                        >
                            {t("footer.tagline")}
                        </p>
                        <p
                            className="text-[12px] leading-relaxed mt-3 mb-5"
                            style={{ color: "#8494b0", lineHeight: 1.7, maxWidth: 260 }}
                        >
                            {t("footer.desc")}
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            {socials.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.name}
                                    className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300"
                                    style={{
                                        color: "#6b7a99",
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "#2BC0FF";
                                        e.currentTarget.style.borderColor = "rgba(43,192,255,0.25)";
                                        e.currentTarget.style.background = "rgba(43,192,255,0.06)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "#6b7a99";
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Col 2: Contacto ── */}
                    <div>
                        <h4
                            className="text-[10px] font-bold uppercase tracking-[0.16em] mb-5"
                            style={{ color: "#b0bdd0" }}
                        >
                            {t("footer.contact")}
                        </h4>

                        {/* Emails */}
                        <div className="space-y-1.5 mb-4">
                            {["importaciones@shippar.net", "atencionalcliente@shippar.net"].map((email) => (
                                <a
                                    key={email}
                                    href={`mailto:${email}`}
                                    className="block text-[12px] transition-colors duration-300 hover:text-white"
                                    style={{ color: "#a0b0cc" }}
                                >
                                    {email}
                                </a>
                            ))}
                        </div>

                        {/* Phones */}
                        <div className="space-y-1 mb-4">
                            {CONTACT_PHONES.map((p, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#6075a0", minWidth: 58 }}>
                                        {p.label}
                                    </span>
                                    <a
                                        href={p.href}
                                        target={p.label === "WhatsApp" ? "_blank" : undefined}
                                        rel={p.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                                        className="text-[12px] transition-colors duration-300 hover:text-white font-mono"
                                        style={{ color: "#a0b0cc" }}
                                    >
                                        {p.number}
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Hours */}
                        <div className="space-y-2.5 mt-1">
                            <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: "#6075a0" }}>
                                    Warehouse Argentina
                                </span>
                                <span className="text-[12px]" style={{ color: "#a0b0cc" }}>
                                    {t("footer.warehouse_ar_hours")}
                                </span>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: "#6075a0" }}>
                                    Warehouse China
                                </span>
                                <span className="text-[12px]" style={{ color: "#a0b0cc" }}>
                                    {t("footer.warehouse_cn_hours")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Col 3: Navegación ── */}
                    <div>
                        <h4
                            className="text-[10px] font-bold uppercase tracking-[0.16em] mb-5"
                            style={{ color: "#b0bdd0" }}
                        >
                            {t("footer.navigation")}
                        </h4>
                        <ul className="space-y-2.5">
                            {NAV_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="text-[13px] transition-colors duration-300 hover:text-white"
                                        style={{ color: "#a0b0cc" }}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Col 4: Legal ── */}
                    <div>
                        <h4
                            className="text-[10px] font-bold uppercase tracking-[0.16em] mb-5"
                            style={{ color: "#b0bdd0" }}
                        >
                            {t("footer.legal")}
                        </h4>

                        <div className="space-y-2 mb-4">
                            <p className="text-[12px] font-medium" style={{ color: "#8b9dc3" }}>
                                SHIPPAR GLOBAL LOGISTICS S.R.L
                            </p>
                            <p className="text-[11px] font-mono" style={{ color: "#8494b0" }}>
                                CUIT: 30-71915946-6
                            </p>
                        </div>

                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/terminos"
                                    className="text-[13px] transition-colors duration-300 hover:text-white"
                                    style={{ color: "#8b9dc3" }}
                                >
                                    {t("footer.terms")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacidad"
                                    className="text-[13px] transition-colors duration-300 hover:text-white"
                                    style={{ color: "#8b9dc3" }}
                                >
                                    {t("footer.privacy")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div
                    className="mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <p className="text-[11px]" style={{ color: "#5a6e8a" }}>
                        © {new Date().getFullYear()} Shippar Global Logistics S.R.L — {t("footer.copyright")}
                    </p>
                    <p className="text-[10px] tracking-wide" style={{ color: "#3a4a66" }}>
                        {t("footer.tagline")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
