import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courier Internacional — Importación Express Puerta a Puerta a Argentina | Shippar",
    description:
        "Importá por courier aéreo desde China, USA y Europa directo a tu puerta en Argentina. Despacho simplificado, seguimiento en tiempo real y sin necesidad de despachante de aduana.",
    keywords: [
        "courier internacional",
        "importar por courier",
        "courier china argentina",
        "importación puerta a puerta",
        "envío express internacional",
        "despacho simplificado",
    ],
    openGraph: {
        title: "Courier Internacional — Importación Express Puerta a Puerta",
        description:
            "Importá desde cualquier parte del mundo con envío express, tracking en tiempo real y despacho simplificado. Sin necesidad de despachante.",
        url: "https://shippar.net/servicios/courier",
        images: [{ url: "/shippar-icon.png", width: 1024, height: 1024, alt: "Shippar Courier Internacional" }],
    },
    twitter: {
        card: "summary",
        title: "Courier Internacional — Importación Express | Shippar",
        description: "Importá por courier aéreo desde China, USA y Europa directo a tu puerta en Argentina.",
    },
    alternates: {
        canonical: "https://shippar.net/servicios/courier",
    },
};

export default function CourierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
