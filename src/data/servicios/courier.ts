import {
    Package,
    Plane,
    ShieldCheck,
    Truck,
    FileSearch,
    Route,
    Clock,
    HeartHandshake,
    BadgeCheck,
    Handshake,
    Store,
    ShoppingCart,
    Building2,
    TrendingUp,
    Briefcase,
} from "lucide-react";
import type { ServiceLandingData } from "@/components/servicios/types";

const courierData: ServiceLandingData = {
    meta: {
        title: "Courier Comercial — Importaciones Puerta a Puerta",
        description:
            "Importaciones puerta a puerta para empresas, pymes y emprendedores. Operación comercial integral bajo régimen simplificado con seguimiento de punta a punta.",
        slug: "courier",
    },

    hero: {
        eyebrow: "Courier Comercial",
        title: "Importaciones puerta a puerta para empresas, pymes y",
        titleAccent: "emprendedores",
        subtitle:
            "Coordinamos operaciones bajo régimen simplificado para clientes que necesitan traer mercadería del exterior con una solución ágil, clara y rentable.",
        ctaPrimary: {
            label: "Cotizar operación",
            href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20una%20importaci%C3%B3n%20courier%20comercial",
        },
        ctaSecondary: {
            label: "Hablar con un asesor",
            href: "https://wa.me/5491155955269",
        },
        stats: [
            { value: "5–7", label: "días de tránsito" },
            { value: "24/7", label: "seguimiento" },
            { value: "100%", label: "trazabilidad" },
        ],
        flowNodes: [
            {
                icon: Handshake,
                label: "Coordinación",
                sublabel: "Proveedor en origen",
            },
            {
                icon: Package,
                label: "Recolección",
                sublabel: "Preparación de carga",
            },
            {
                icon: Plane,
                label: "Tránsito",
                sublabel: "Vuelo internacional",
            },
            {
                icon: ShieldCheck,
                label: "Gestión documental",
                sublabel: "Validación en Argentina",
            },
            {
                icon: Truck,
                label: "Entrega final",
                sublabel: "Puerta a puerta",
            },
        ],
    },

    benefits: {
        eyebrow: "Ventajas",
        title: "Por qué operar con Shippar",
        items: [
            {
                icon: Route,
                title: "Operación comercial integral puerta a puerta",
                description:
                    "Gestionamos toda la cadena: desde la recolección en origen con tu proveedor hasta la entrega final en tu domicilio en Argentina.",
            },
            {
                icon: FileSearch,
                title: "Cotización con impuestos detallados",
                description:
                    "Recibís un desglose completo con impuestos, tasas aduaneras y costos operativos. Sabés exactamente cuánto vas a pagar antes de iniciar.",
            },
            {
                icon: Clock,
                title: "Seguimiento de punta a punta",
                description:
                    "Rastreá tu carga en cada etapa del proceso: recolección, tránsito, despacho y última milla. Siempre sabés dónde está tu mercadería.",
            },
            {
                icon: HeartHandshake,
                title: "Atención personalizada durante toda la operación",
                description:
                    "Un equipo real que conoce tu caso te acompaña de principio a fin. Sin bots, sin respuestas automáticas, sin tickets impersonales.",
            },
            {
                icon: BadgeCheck,
                title: "Validación operativa desde origen hasta entrega final",
                description:
                    "Cada paso de la operación se documenta y valida. Controlamos la carga en origen, el tránsito y la gestión aduanera antes de que llegue a tus manos.",
            },
        ],
    },

    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            {
                title: "Coordinación con proveedor en origen",
                description:
                    "Nos conectamos directamente con tu proveedor o punto de recolección para coordinar el retiro de la carga y verificar los detalles de la operación.",
            },
            {
                title: "Recolección y preparación de carga",
                description:
                    "Nuestros agentes en origen retiran la carga, la inspeccionan, la embalan según normativa y la preparan para el tránsito internacional.",
            },
            {
                title: "Tránsito internacional",
                description:
                    "La mercadería viaja con seguimiento activo en cada tramo del tránsito. Te mantenemos informado con actualizaciones reales, no estimadas.",
            },
            {
                title: "Gestión operativa y documental en Argentina",
                description:
                    "Nos encargamos de la documentación, validación ante aduana y la gestión completa del despacho para que tu carga sea liberada sin trabas.",
            },
            {
                title: "Entrega final coordinada",
                description:
                    "Una vez despachada la carga, coordinamos la última milla hasta tu domicilio, depósito o punto de distribución.",
            },
        ],
    },

    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            {
                icon: Briefcase,
                label: "Importadores",
                description:
                    "Que necesitan una operación profesional con documentación completa y seguimiento real.",
            },
            {
                icon: Store,
                label: "Pymes",
                description:
                    "Que importan insumos o productos terminados de forma recurrente y buscan un partner logístico confiable.",
            },
            {
                icon: TrendingUp,
                label: "Emprendedores",
                description:
                    "Que traen mercadería para reventa o marca propia y necesitan una solución clara y rentable.",
            },
            {
                icon: ShoppingCart,
                label: "Ecommerce",
                description:
                    "Que reponen stock desde el exterior y necesitan tiempos predecibles para mantener su operación en marcha.",
            },
            {
                icon: Building2,
                label: "Empresas en crecimiento",
                description:
                    "Que están escalando su volumen de importación y necesitan una logística que acompañe su ritmo.",
            },
        ],
    },

    cta: {
        title: "Contanos qué necesitás mover",
        subtitle:
            "Te ayudamos a definir la mejor solución para tu operación. Escribinos con los detalles y recibí una cotización sin compromiso.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20cotizar%20una%20importaci%C3%B3n%20courier%20comercial",
    },
};

export default courierData;
