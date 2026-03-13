"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n";

/* ══════════════════════════════════════════════════════════
   HreflangTags — SEO alternate language links
   ──────────────────────────────────────────────────────────
   Injects <link rel="alternate" hreflang="..."> tags into
   the document head so Google knows which URL corresponds
   to each language version. This prevents duplicate content
   penalties and shows the correct version in search results.

   Spanish (default): shippar.net/servicios/courier
   English:           shippar.net/en/servicios/courier
   ══════════════════════════════════════════════════════════ */

const SITE_URL = "https://shippar.net";

export default function HreflangTags() {
    const pathname = usePathname();
    const { locale } = useI18n();

    // Build canonical URLs for each locale
    const esUrl = `${SITE_URL}${pathname}`;
    const enUrl = `${SITE_URL}/en${pathname}`;

    return (
        <>
            {/* Tell Google: this page exists in Spanish and English */}
            <link rel="alternate" hrefLang="es" href={esUrl} />
            <link rel="alternate" hrefLang="en" href={enUrl} />
            {/* x-default = the language users get when no locale matches */}
            <link rel="alternate" hrefLang="x-default" href={esUrl} />
            {/* Canonical points to current locale version */}
            <link rel="canonical" href={locale === "en" ? enUrl : esUrl} />
        </>
    );
}
