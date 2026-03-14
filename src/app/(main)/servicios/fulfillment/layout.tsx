import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fulfillment — Preparación y Distribución de Carga | Shippar",
    description:
        "Preparación operativa de carga para distribución en Argentina. Acondicionamiento, etiquetado, control de calidad y despacho organizado para tu operación de importación.",
    keywords: [
        "fulfillment argentina",
        "preparación de carga",
        "distribución importaciones",
        "acondicionamiento logístico",
        "logística last mile",
        "fulfillment importaciones",
    ],
    openGraph: {
        title: "Fulfillment — Preparación y Distribución de Carga",
        description:
            "Preparación operativa, control de calidad y distribución de tu carga importada en Argentina.",
        url: "https://shippar.net/servicios/fulfillment",
        images: [{ url: "/shippar-icon.png", width: 1024, height: 1024, alt: "Shippar Fulfillment" }],
    },
    twitter: {
        card: "summary",
        title: "Fulfillment — Distribución de Carga | Shippar",
        description: "Preparación, control de calidad y distribución de tu carga importada en Argentina.",
    },
    alternates: {
        canonical: "https://shippar.net/servicios/fulfillment",
    },
};

export default function FulfillmentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
