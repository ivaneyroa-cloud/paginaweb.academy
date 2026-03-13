import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Carga Marítima — LCL / FCL | Shippar",
    description:
        "Soluciones marítimas según el volumen de tu operación. Carga consolidada o contenedor completo con coordinación de punta a punta.",
};

export default function MaritimaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
