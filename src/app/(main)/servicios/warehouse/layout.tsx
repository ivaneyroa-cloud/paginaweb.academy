import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Warehouse y Consolidación | Shippar",
    description:
        "Recepción, organización y preparación de carga en origen. Consolidamos bultos de múltiples proveedores para optimizar el envío internacional.",
};

export default function WarehouseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
