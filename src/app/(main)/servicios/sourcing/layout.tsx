import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sourcing en China — Búsqueda de Proveedores Verificados | Shippar",
    description:
        "Encontrá proveedores confiables en China con validación comercial, control de calidad y coordinación desde origen. Equipo local en China para inspecciones y negociaciones directas.",
    keywords: [
        "sourcing china",
        "proveedores china",
        "buscar proveedores china",
        "proveedores verificados alibaba",
        "comprar en china desde argentina",
        "sourcing importaciones",
    ],
    openGraph: {
        title: "Sourcing en China — Proveedores Verificados",
        description:
            "Encontrá proveedores confiables en China con validación comercial, control de calidad y equipo local en origen.",
        url: "https://shippar.net/servicios/sourcing",
        images: [{ url: "/shippar-icon.png", width: 1024, height: 1024, alt: "Shippar Sourcing en China" }],
    },
    twitter: {
        card: "summary",
        title: "Sourcing en China — Proveedores Verificados | Shippar",
        description: "Encontrá y validá proveedores en China con equipo local. Inspecciones y coordinación directa.",
    },
    alternates: {
        canonical: "https://shippar.net/servicios/sourcing",
    },
};

export default function SourcingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
