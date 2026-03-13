import {
    Package,
    Plane,
    Globe,
    CheckCircle,
    Route,
    FileSearch,
    Clock,
    HeartHandshake,
    BadgeCheck,
    Briefcase,
    Store,
    TrendingUp,
    Building2,
} from "lucide-react";
import type { ServiceLandingData } from "@/components/servicios/types";

const exportacionData: ServiceLandingData = {
    meta: {
        title: "Exportación Courier — Envíos Internacionales",
        description:
            "Envíos internacionales para empresas que venden al exterior. Operación completa con soporte documental y seguimiento de punta a punta.",
        slug: "exportacion",
    },

    hero: {
        eyebrow: "Exportación Courier",
        title: "Envíos internacionales para empresas que venden al",
        titleAccent: "exterior",
        subtitle:
            "Acompañamos operaciones de exportación con una solución práctica y ordenada para que empresas y marcas puedan enviar carga fuera del país con gestión integral y seguimiento durante todo el proceso.",
        ctaPrimary: {
            label: "Cotizar operación",
            href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20una%20exportaci%C3%B3n%20courier",
        },
        ctaSecondary: {
            label: "Hablar con un asesor",
            href: "https://wa.me/5491155955269",
        },
        stats: [
            { value: "5–10", label: "días de tránsito" },
            { value: "100%", label: "trazabilidad" },
            { value: "24/7", label: "seguimiento" },
        ],
        flowNodes: [
            { icon: Package, label: "Preparación", sublabel: "Argentina" },
            { icon: Plane, label: "Salida", sublabel: "Internacional" },
            { icon: Globe, label: "Tránsito", sublabel: "Global" },
            { icon: CheckCircle, label: "Entrega", sublabel: "Destino" },
        ],
    },

    benefits: {
        eyebrow: "Ventajas",
        title: "Por qué exportar con Shippar",
        items: [
            {
                icon: Route,
                title: "Operación ágil para exportaciones courier",
                description:
                    "Gestionamos la operación de salida de forma rápida y organizada, desde la preparación en Argentina hasta la entrega en destino.",
            },
            {
                icon: FileSearch,
                title: "Soporte documental y operativo",
                description:
                    "Te acompañamos con la documentación necesaria para que la carga salga sin demoras ni problemas en aduana.",
            },
            {
                icon: Clock,
                title: "Seguimiento durante toda la operación",
                description:
                    "Rastreá tu carga en cada etapa del proceso: preparación, salida, tránsito y entrega en destino.",
            },
            {
                icon: HeartHandshake,
                title: "Atención dedicada para cada operación",
                description:
                    "Un equipo que conoce tu caso y te acompaña de principio a fin. Sin respuestas automáticas.",
            },
            {
                icon: BadgeCheck,
                title: "Cumplimiento normativo garantizado",
                description:
                    "Nos aseguramos de que cada operación cumpla con los requisitos aduaneros y regulatorios del país de destino.",
            },
        ],
    },

    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            {
                title: "Preparación de la carga en Argentina",
                description:
                    "Coordinamos el retiro de la carga en tu ubicación, la inspeccionamos y la preparamos según normativa de exportación.",
            },
            {
                title: "Gestión documental y aduanera",
                description:
                    "Nos encargamos de toda la documentación necesaria para la salida de la carga desde Argentina.",
            },
            {
                title: "Tránsito internacional",
                description:
                    "La carga viaja con seguimiento activo en cada tramo del tránsito hasta el país de destino.",
            },
            {
                title: "Entrega en destino",
                description:
                    "Coordinamos la entrega final en el país de destino, asegurando que la carga llegue en tiempo y forma.",
            },
        ],
    },

    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            {
                icon: Briefcase,
                label: "Exportadores",
                description:
                    "Que necesitan una operación profesional con documentación completa y seguimiento real.",
            },
            {
                icon: Store,
                label: "Marcas argentinas",
                description:
                    "Que venden productos al exterior y necesitan una logística confiable desde Argentina.",
            },
            {
                icon: TrendingUp,
                label: "Empresas en expansión",
                description:
                    "Que están abriendo mercados internacionales y necesitan un partner logístico.",
            },
            {
                icon: Building2,
                label: "Fabricantes",
                description:
                    "Que exportan insumos o productos terminados de forma recurrente.",
            },
        ],
    },

    cta: {
        title: "Contanos qué necesitás exportar",
        subtitle:
            "Te ayudamos a definir la mejor solución para tu operación de exportación. Escribinos con los detalles y recibí una cotización sin compromiso.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20cotizar%20una%20exportaci%C3%B3n%20courier",
    },
};

export default exportacionData;
