"use client";

import { usePathname } from "next/navigation";

const BASE_URL = "https://shippar.net";

/**
 * JSON-LD structured data for Organization + LogisticsService.
 * Rendered on all main pages to give Google rich context about Shippar.
 */
export default function JsonLd() {
    const pathname = usePathname();

    /* ── Organization schema ── */
    const organization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Shippar",
        legalName: "Shippar Global Logistics",
        url: BASE_URL,
        logo: `${BASE_URL}/shippar-logo.webp`,
        description:
            "Empresa de logística internacional especializada en importaciones express desde China, USA y Europa a Argentina.",
        foundingDate: "2023",
        areaServed: {
            "@type": "Country",
            name: "Argentina",
        },
        address: {
            "@type": "PostalAddress",
            streetAddress: "Buenos Aires",
            addressLocality: "Buenos Aires",
            postalCode: "1001",
            addressCountry: "AR",
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["Spanish", "English"],
        },
        sameAs: [
            "https://www.instagram.com/shippar.net/",
        ],
    };

    /* ── LogisticsService schema ── */
    const service = {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Logistics Service",
        name: "Importaciones Express — Shippar",
        description:
            "Servicio de importación express puerta a puerta desde China, Estados Unidos y Europa a Argentina. Courier internacional, carga marítima, fulfillment, warehouse y sourcing.",
        provider: {
            "@type": "Organization",
            name: "Shippar",
            url: BASE_URL,
        },
        areaServed: {
            "@type": "Country",
            name: "Argentina",
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicios de importación",
            itemListElement: [
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Courier Internacional",
                        description:
                            "Envíos express puerta a puerta desde China, USA y Europa. Entrega en 5-7 días hábiles con seguimiento en tiempo real.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Carga Marítima",
                        description:
                            "Flete internacional marítimo FCL y LCL. Consolidación de carga, gestión aduanera y distribución final.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Exportación",
                        description:
                            "Servicio de exportación desde Argentina al mundo. Gestión documental, logística y aduana.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Warehouse & Fulfillment",
                        description:
                            "Almacenamiento, preparación de pedidos y fulfillment e-commerce con integración a Mercado Libre.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Sourcing",
                        description:
                            "Búsqueda de proveedores y fábricas verificadas en China. Negociación, verificación de calidad y coordinación de compras.",
                    },
                },
            ],
        },
    };

    /* ── WebSite schema (helps Google Search Box) ── */
    const website = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Shippar",
        url: BASE_URL,
        inLanguage: ["es", "en"],
    };

    /* Only render Organization + WebSite on home, Service on all pages */
    const isHome =
        pathname === "/" || pathname === "/en" || pathname === "/en/";

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organization),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(service),
                }}
            />
            {isHome && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(website),
                    }}
                />
            )}
        </>
    );
}
