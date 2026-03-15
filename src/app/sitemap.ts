import { MetadataRoute } from "next";

const BASE_URL = "https://shippar.net";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    /* ── Main pages ── */
    const mainPages = [
        { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
        { path: "/servicios", priority: 0.9, changeFrequency: "monthly" as const },
        { path: "/servicios/courier", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/servicios/exportacion", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/servicios/maritima", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/servicios/warehouse", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/servicios/fulfillment", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/servicios/sourcing", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/rastreo", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/terminos", priority: 0.3, changeFrequency: "yearly" as const },
    ];

    /* ── Tools pages ── */
    const toolPages = [
        { path: "/herramientas", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/cotizador-importacion", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/calculadora-rentabilidad", priority: 0.8, changeFrequency: "monthly" as const },
    ];

    /* ── Academy pages (public) ── */
    const academyPages = [
        { path: "/academy", priority: 0.7, changeFrequency: "weekly" as const },
    ];

    /* ── Generate entries for default (es) and en locales ── */
    const entries: MetadataRoute.Sitemap = [];

    for (const page of [...mainPages, ...toolPages, ...academyPages]) {
        // Spanish (default, canonical URL)
        entries.push({
            url: `${BASE_URL}${page.path}`,
            lastModified: now,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
            alternates: {
                languages: {
                    es: `${BASE_URL}${page.path}`,
                    en: `${BASE_URL}/en${page.path}`,
                },
            },
        });

        // English version
        entries.push({
            url: `${BASE_URL}/en${page.path}`,
            lastModified: now,
            changeFrequency: page.changeFrequency,
            priority: page.priority * 0.9, // Slightly lower for non-default locale
            alternates: {
                languages: {
                    es: `${BASE_URL}${page.path}`,
                    en: `${BASE_URL}/en${page.path}`,
                },
            },
        });
    }

    return entries;
}
