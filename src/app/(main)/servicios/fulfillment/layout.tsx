import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fulfillment — Preparación Logística | Shippar",
    description:
        "Preparación operativa de carga para distribución. Acondicionamiento, control de calidad y despacho ordenado.",
};

export default function FulfillmentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
