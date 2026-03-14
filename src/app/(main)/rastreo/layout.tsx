import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rastreo de Envíos — Seguimiento de Paquetes UPS, FedEx y Courier | Shippar",
    description:
        "Rastreá tu paquete en tiempo real. Seguimiento de envíos UPS, FedEx, SF Express y courier internacional. Ingresá tu número de tracking y conocé el estado de tu envío al instante. Shippar Tracking.",
    keywords: [
        "rastrear paquete",
        "rastrear envío",
        "seguimiento de envío",
        "tracking ups",
        "buscar paquete ups",
        "rastreo de paquetes",
        "shippar tracking",
        "shippar rastreo",
        "rastreo de envíos",
        "seguimiento courier",
        "tracking fedex",
        "tracking internacional",
        "rastrear paquete argentina",
        "rastreo courier argentina",
        "rastrear envío internacional",
        "seguimiento de paquetes en tiempo real",
    ],
    openGraph: {
        title: "Rastreo de Envíos — Shippar | Seguimiento en Tiempo Real",
        description:
            "Rastreá tu paquete UPS, FedEx o courier en segundos. Seguimiento en tiempo real con actualizaciones instantáneas.",
        url: "https://shippar.net/rastreo",
        siteName: "Shippar",
        locale: "es_AR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Rastreo de Envíos — Shippar",
        description:
            "Seguimiento de paquetes UPS, FedEx y courier internacional en tiempo real.",
    },
    alternates: {
        canonical: "https://shippar.net/rastreo",
        languages: {
            es: "https://shippar.net/rastreo",
            en: "https://shippar.net/en/rastreo",
        },
    },
};

export default function RastreoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* WebApplication JSON-LD for the tracking tool */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        name: "Shippar Rastreo de Envíos",
                        description:
                            "Herramienta de seguimiento de paquetes UPS, FedEx, SF Express y courier internacional en tiempo real.",
                        url: "https://shippar.net/rastreo",
                        applicationCategory: "BusinessApplication",
                        operatingSystem: "All",
                        offers: {
                            "@type": "Offer",
                            price: "0",
                            priceCurrency: "USD",
                        },
                        provider: {
                            "@type": "Organization",
                            name: "Shippar",
                            url: "https://shippar.net",
                        },
                    }),
                }}
            />
            {/* SearchAction for site search box in Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: "Shippar — Rastreo de Envíos",
                        url: "https://shippar.net",
                        potentialAction: {
                            "@type": "SearchAction",
                            target: {
                                "@type": "EntryPoint",
                                urlTemplate:
                                    "https://shippar.net/rastreo?q={tracking_number}",
                            },
                            "query-input":
                                "required name=tracking_number",
                        },
                    }),
                }}
            />
            {children}
        </>
    );
}
