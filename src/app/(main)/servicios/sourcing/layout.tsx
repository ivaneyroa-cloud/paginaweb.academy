import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sourcing en China | Shippar",
    description:
        "Apoyo comercial y operativo desde origen. Búsqueda, validación y coordinación de proveedores en China.",
};

export default function SourcingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
