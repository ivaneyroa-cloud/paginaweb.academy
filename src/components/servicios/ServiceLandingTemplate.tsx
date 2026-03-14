"use client";

import type { ServiceLandingData } from "./types";
import type { Locale } from "@/i18n";
import { useI18n } from "@/i18n";
import { useEffect, useState } from "react";
import ServiceHero from "./ServiceHero";
import ServiceBenefits from "./ServiceBenefits";
import ServiceProcess from "./ServiceProcess";
import ServiceIdealFor from "./ServiceIdealFor";
import ServiceCTA from "./ServiceCTA";

/* ═══════════════════════════════════════════════════════
   SERVICE LANDING TEMPLATE — v2 ("Mobile-first")
   ───────────────────────────────────────────────────────
   Mobile: Hero → CTA → Benefits (compact) → Process (accordion)
   Desktop: Hero → Benefits → Process → IdealFor → CTA
   + Sticky CTA bar at bottom on mobile
   ═══════════════════════════════════════════════════════ */

export type LocalizedServiceData = Partial<Record<Locale, ServiceLandingData>>;

const SCOPED_STYLES = `
    @keyframes servicios-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    .servicios-shimmer { animation: servicios-shimmer 3s ease-in-out infinite; }

    @keyframes dot-pulse {
        0%, 100% { box-shadow: 0 0 4px rgba(43,192,255,0.2); }
        50% { box-shadow: 0 0 10px rgba(43,192,255,0.45); }
    }
    .flow-dot-pulse { animation: dot-pulse 2.5s ease-in-out infinite; }
`;

export default function ServiceLandingTemplate({
    data,
}: {
    data: ServiceLandingData | LocalizedServiceData;
}) {
    const { locale } = useI18n();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const resolved: ServiceLandingData =
        "meta" in data
            ? (data as ServiceLandingData)
            : ((data as LocalizedServiceData)[locale] ??
               (data as LocalizedServiceData).es!);

    const divider = (
        <div
            style={{
                height: "1px",
                background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)",
                margin: "0 8%",
            }}
        />
    );

    return (
        <div style={{ background: "var(--bg-deep)" }}>
            <style>{SCOPED_STYLES}</style>

            {/* 1. Hero — always first */}
            <ServiceHero data={resolved.hero} />

            {isMobile ? (
                <>
                    {/* MOBILE: CTA goes right after hero */}
                    {divider}
                    <ServiceCTA data={resolved.cta} />

                    {divider}
                    <ServiceBenefits data={resolved.benefits} />

                    {divider}
                    <ServiceProcess data={resolved.process} />

                    {divider}
                    <ServiceIdealFor data={resolved.idealFor} />
                </>
            ) : (
                <>
                    {/* DESKTOP: original order */}
                    {divider}
                    <ServiceBenefits data={resolved.benefits} />

                    <ServiceProcess data={resolved.process} />

                    {divider}
                    <ServiceIdealFor data={resolved.idealFor} />

                    <ServiceCTA data={resolved.cta} />
                </>
            )}

            {/* Sticky CTA bar on mobile */}
            {isMobile && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        padding: "12px 16px",
                        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
                        background: "linear-gradient(to top, rgba(4,9,22,0.98) 60%, rgba(4,9,22,0.85) 100%)",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <a
                        href={resolved.cta.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "14px 20px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #1DA1FF, #2BC0FF)",
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "14px",
                            textDecoration: "none",
                            boxShadow: "0 4px 20px rgba(43,192,255,0.25)",
                        }}
                    >
                        {resolved.cta.ctaLabel}
                    </a>
                    <a
                        href="https://wa.me/5491171190722"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "48px",
                            borderRadius: "12px",
                            background: "rgba(37,211,102,0.12)",
                            border: "1px solid rgba(37,211,102,0.2)",
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                    </a>
                </div>
            )}

            {/* Bottom padding on mobile to account for sticky bar */}
            {isMobile && <div style={{ height: "80px" }} />}
        </div>
    );
}
