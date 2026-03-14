import { Metadata } from "next";
import ServiciosSection from "@/components/landing/ServiciosSection";

export const metadata: Metadata = {
    title: "Servicios de Logística Internacional — Courier, Marítima, Fulfillment | Shippar",
    description:
        "Todos los servicios de logística internacional de Shippar: courier express, carga marítima LCL/FCL, warehouse, fulfillment, exportación y sourcing en China. Soluciones para importadores argentinos.",
    keywords: [
        "servicios logística internacional",
        "courier express argentina",
        "carga marítima",
        "warehouse china",
        "fulfillment importaciones",
        "sourcing proveedores",
    ],
    openGraph: {
        title: "Servicios de Logística Internacional | Shippar",
        description:
            "Courier express, carga marítima, warehouse, fulfillment, exportación y sourcing. Todo para importar a Argentina.",
        url: "https://shippar.net/servicios",
        images: [{ url: "/shippar-icon.png", width: 1024, height: 1024, alt: "Servicios Shippar" }],
    },
    twitter: {
        card: "summary",
        title: "Servicios de Logística Internacional | Shippar",
        description: "Courier, marítima, warehouse, fulfillment y sourcing. Todo para importar a Argentina.",
    },
    alternates: {
        canonical: "https://shippar.net/servicios",
    },
};

export default function ServiciosPage() {
    return (
        <div style={{ paddingTop: "68px" }}>
            <ServiciosSection />
        </div>
    );
}
