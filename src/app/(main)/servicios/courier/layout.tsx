import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courier Comercial — Importaciones Puerta a Puerta | Shippar",
    description:
        "Soluciones de importación courier puerta a puerta para empresas, pymes y emprendedores. Operación clara, acompañada y eficiente desde origen hasta Argentina.",
};

export default function CourierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
