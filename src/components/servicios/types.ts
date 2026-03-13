import type { LucideIcon } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   Service Landing — Shared types
   ──────────────────────────────────────────────────────────
   Single source of truth for the data shape consumed by
   every service landing component.
   ══════════════════════════════════════════════════════════ */

export type FlowNode = {
    icon: LucideIcon;
    label: string;
    sublabel?: string;
};

export type ServiceLandingData = {
    /** SEO and page metadata */
    meta: {
        title: string;
        description: string;
        slug: string;
    };

    /** Hero section */
    hero: {
        eyebrow: string;
        title: string;
        titleAccent: string; // gradient-colored word(s)
        subtitle: string;
        badges?: string[];
        ctaPrimary: { label: string; href: string };
        ctaSecondary: { label: string; href: string };
        flowNodes: FlowNode[];
        /** Optional metrics displayed above the flow — makes the visual feel like a dashboard */
        stats?: { value: string; label: string }[];
    };

    /** Benefits block */
    benefits: {
        eyebrow: string;
        title: string;
        items: {
            icon: LucideIcon;
            title: string;
            description: string;
            link?: { label: string; href: string };
        }[];
    };

    /** Process / "Cómo funciona" */
    process: {
        eyebrow: string;
        title: string;
        steps: {
            title: string;
            description: string;
        }[];
    };

    /** "Ideal para" block */
    idealFor: {
        eyebrow: string;
        title: string;
        profiles: {
            icon: LucideIcon;
            label: string;
            description: string;
        }[];
    };

    /** Final CTA */
    cta: {
        title: string;
        subtitle: string;
        ctaLabel: string;
        ctaHref: string;
        useForm?: boolean;
    };
};
