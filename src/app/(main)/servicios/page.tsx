import ServiciosSection from "@/components/landing/ServiciosSection";

export const metadata = {
    title: "Servicios — Shippar | Logística Internacional Express",
    description:
        "Soluciones logísticas para operaciones comerciales internacionales. Importación express, carga marítima, exportación, sourcing y fulfillment.",
};

export default function ServiciosPage() {
    return (
        <div style={{ paddingTop: "68px" }}>
            <ServiciosSection />
        </div>
    );
}
