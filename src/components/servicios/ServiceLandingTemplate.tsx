"use client";

import type { ServiceLandingData } from "./types";
import ServiceHero from "./ServiceHero";
import ServiceBenefits from "./ServiceBenefits";
import ServiceProcess from "./ServiceProcess";
import ServiceIdealFor from "./ServiceIdealFor";
import ServiceTrust from "./ServiceTrust";
import ServiceCTA from "./ServiceCTA";

/* ═══════════════════════════════════════════════════════
   SERVICE LANDING TEMPLATE
   ──────────────────────────────────────────────────────
   Orchestrator component. Composes all 6 section blocks
   in a fixed order. Content is injected via the data prop.

   Usage:
     <ServiceLandingTemplate data={courierData} />
   ═══════════════════════════════════════════════════════ */

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
    data: ServiceLandingData;
}) {
    return (
        <div style={{ background: "var(--bg-deep)" }}>
            <style>{SCOPED_STYLES}</style>

            {/* 1. Hero */}
            <ServiceHero data={data.hero} />

            {/* Subtle section divider */}
            <div
                style={{
                    height: "1px",
                    background:
                        "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)",
                    margin: "0 8%",
                }}
            />

            {/* 2. Benefits */}
            <ServiceBenefits data={data.benefits} />

            {/* 3. Process */}
            <ServiceProcess data={data.process} />

            {/* Divider */}
            <div
                style={{
                    height: "1px",
                    background:
                        "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)",
                    margin: "0 8%",
                }}
            />

            {/* 4. Ideal For */}
            <ServiceIdealFor data={data.idealFor} />

            {/* 5. Trust */}
            <ServiceTrust />

            {/* 6. Final CTA */}
            <ServiceCTA data={data.cta} />
        </div>
    );
}
