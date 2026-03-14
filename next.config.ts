import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    headers: async () => [
        {
            source: "/(.*)",
            headers: [
                { key: "X-Frame-Options", value: "DENY" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-DNS-Prefetch-Control", value: "on" },
                {
                    key: "Permissions-Policy",
                    value: "camera=(), microphone=(), geolocation=()",
                },
            ],
        },
        /* ── Cache static assets for 1 year ── */
        {
            source: "/:path*.(webp|png|jpg|jpeg|svg|woff2|woff|ico)",
            headers: [
                {
                    key: "Cache-Control",
                    value: "public, max-age=31536000, immutable",
                },
            ],
        },
    ],

    /* ── Redirects: old URLs → new pages (301 = permanent) ── */
    redirects: async () => [
        {
            source: "/guias-aereas",
            destination: "/servicios/courier",
            permanent: true, // 301
        },
        {
            source: "/exportaciones",
            destination: "/servicios/exportacion",
            permanent: true,
        },
        {
            source: "/maritima",
            destination: "/servicios/maritima",
            permanent: true,
        },
        {
            source: "/warehouse",
            destination: "/servicios/warehouse",
            permanent: true,
        },
        {
            source: "/fulfillment",
            destination: "/servicios/fulfillment",
            permanent: true,
        },
        {
            source: "/sourcing",
            destination: "/servicios/sourcing",
            permanent: true,
        },
        /* Old tracking URLs */
        {
            source: "/tracking",
            destination: "/rastreo",
            permanent: true,
        },
        {
            source: "/rastrear",
            destination: "/rastreo",
            permanent: true,
        },
    ],
};

export default nextConfig;

