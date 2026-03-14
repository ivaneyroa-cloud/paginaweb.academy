import type { NextConfig } from "next";

/* ── CSP directives (permissive but protective) ── */
const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://api.dicebear.com https://i.pravatar.cc https://*.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.dicebear.com wss://*.supabase.co",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
    /* ── Remove X-Powered-By header ── */
    poweredByHeader: false,

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
                /* ── HSTS: force HTTPS for 2 years ── */
                {
                    key: "Strict-Transport-Security",
                    value: "max-age=63072000; includeSubDomains; preload",
                },
                /* ── Content Security Policy ── */
                {
                    key: "Content-Security-Policy",
                    value: cspDirectives,
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

