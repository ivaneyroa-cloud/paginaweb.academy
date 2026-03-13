import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Exportación Courier — Envíos Internacionales | Shippar",
    description:
        "Envíos internacionales para empresas que venden al exterior. Operación completa con soporte documental y seguimiento de punta a punta.",
};

export default function ExportacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
