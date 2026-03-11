import type { Metadata } from "next";
import "./academy.css";

export const metadata: Metadata = {
    title: "Shippar Academy — Aprende a Importar",
    description:
        "Plataforma educativa gratuita de Shippar. Dominá el arte de importar desde China con cursos interactivos, quizzes y certificados.",
    keywords: [
        "importar desde china",
        "curso importación",
        "shippar",
        "courier simplificado",
        "comercio exterior",
        "argentina",
    ],
    openGraph: {
        title: "Shippar Academy — Aprende a Importar",
        description:
            "Cursos gratuitos para emprendedores que quieren importar desde China.",
        type: "website",
    },
};

export default function AcademyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="academy-scope" style={{ background: "#0A1128", color: "#FFFFFF", minHeight: "100vh" }}>
            {children}
        </div>
    );
}
