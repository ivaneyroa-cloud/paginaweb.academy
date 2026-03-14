import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Exportación Courier — Envíos Internacionales desde Argentina | Shippar",
    description:
        "Servicio de exportación courier para empresas argentinas que venden al exterior. Envíos internacionales con soporte documental, gestión aduanera y seguimiento de punta a punta.",
    keywords: [
        "exportar desde argentina",
        "exportación courier",
        "envíos internacionales argentina",
        "exportar productos",
        "courier exportación",
        "vender al exterior argentina",
    ],
    openGraph: {
        title: "Exportación Courier — Envíos Internacionales desde Argentina",
        description:
            "Exportá desde Argentina con soporte documental, gestión aduanera y seguimiento de punta a punta.",
        url: "https://shippar.net/servicios/exportacion",
        images: [{ url: "/shippar-icon.png", width: 1024, height: 1024, alt: "Shippar Exportación" }],
    },
    twitter: {
        card: "summary",
        title: "Exportación Courier desde Argentina | Shippar",
        description: "Exportá desde Argentina con soporte documental y seguimiento completo.",
    },
    alternates: {
        canonical: "https://shippar.net/servicios/exportacion",
    },
};

export default function ExportacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
