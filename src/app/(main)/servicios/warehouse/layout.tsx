import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Warehouse y Consolidación en Origen — China y Asia | Shippar",
    description:
        "Recepción, inspección y consolidación de carga en nuestro warehouse en China. Agrupamos envíos de múltiples proveedores para optimizar costos de flete internacional.",
    keywords: [
        "warehouse china",
        "consolidación de carga",
        "almacén en origen",
        "agrupar envíos china",
        "warehouse importaciones",
        "consolidar carga internacional",
    ],
    openGraph: {
        title: "Warehouse y Consolidación en Origen — China y Asia",
        description:
            "Recepción, inspección y consolidación de carga desde múltiples proveedores en nuestro warehouse en China.",
        url: "https://shippar.net/servicios/warehouse",
        images: [{ url: "/shippar-icon.png", width: 1024, height: 1024, alt: "Shippar Warehouse en China" }],
    },
    twitter: {
        card: "summary",
        title: "Warehouse y Consolidación en Origen | Shippar",
        description: "Consolidamos tu carga de múltiples proveedores en China para optimizar costos de flete.",
    },
    alternates: {
        canonical: "https://shippar.net/servicios/warehouse",
    },
};

export default function WarehouseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
