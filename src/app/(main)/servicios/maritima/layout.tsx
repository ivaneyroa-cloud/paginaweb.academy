import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Carga Marítima — Flete LCL y FCL desde China a Argentina | Shippar",
    description:
        "Flete marítimo internacional LCL (carga consolidada) y FCL (contenedor completo) desde China, Asia y Europa a Argentina. Coordinación puerta a puerta con seguimiento activo.",
    keywords: [
        "carga marítima argentina",
        "flete marítimo china argentina",
        "contenedor LCL FCL",
        "flete internacional",
        "importar por barco",
        "carga consolidada marítima",
    ],
    openGraph: {
        title: "Carga Marítima — Flete LCL y FCL a Argentina",
        description:
            "Flete marítimo internacional LCL y FCL desde China, Asia y Europa. Coordinación completa con seguimiento activo.",
        url: "https://shippar.net/servicios/maritima",
        images: [{ url: "/shippar-icon.png", width: 1024, height: 1024, alt: "Shippar Carga Marítima" }],
    },
    twitter: {
        card: "summary",
        title: "Carga Marítima — Flete Internacional | Shippar",
        description: "Flete marítimo LCL y FCL desde China y Europa a Argentina. Coordinación puerta a puerta.",
    },
    alternates: {
        canonical: "https://shippar.net/servicios/maritima",
    },
};

export default function MaritimaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
