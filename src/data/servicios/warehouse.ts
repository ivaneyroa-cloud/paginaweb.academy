import {
    Package,
    Plane,
    Layers,
    Warehouse,
    Route,
    Clock,
    HeartHandshake,
    BadgeCheck,
    ShieldCheck,
    Briefcase,
    Store,
    Building2,
    ShoppingCart,
} from "lucide-react";
import type { ServiceLandingData } from "@/components/servicios/types";

const warehouseData: ServiceLandingData = {
    meta: {
        title: "Warehouse y Consolidación",
        description:
            "Recepción, organización y preparación de carga en origen. Consolidamos bultos de múltiples proveedores para optimizar el envío internacional.",
        slug: "warehouse",
    },

    hero: {
        eyebrow: "Warehouse y Consolidación",
        title: "Recepción, organización y preparación de carga en",
        titleAccent: "origen",
        subtitle:
            "Recibimos carga de distintos proveedores, organizamos la operación y consolidamos bultos para optimizar el tránsito internacional antes de la salida.",
        ctaPrimary: {
            label: "Cotizar operación",
            href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20warehouse%20y%20consolidaci%C3%B3n",
        },
        ctaSecondary: {
            label: "Hablar con un asesor",
            href: "https://wa.me/5491155955269",
        },
        stats: [
            { value: "Multi", label: "proveedores" },
            { value: "100%", label: "control" },
            { value: "Optimizado", label: "consolidación" },
        ],
        flowNodes: [
            { icon: Package, label: "Recepción", sublabel: "Múltiples proveedores" },
            { icon: Warehouse, label: "Warehouse", sublabel: "Organización" },
            { icon: Layers, label: "Consolidación", sublabel: "Agrupamiento" },
            { icon: Plane, label: "Salida", sublabel: "Internacional" },
        ],
    },

    benefits: {
        eyebrow: "Ventajas",
        title: "Por qué usar nuestro warehouse",
        items: [
            {
                icon: Route,
                title: "Recepción de carga de múltiples proveedores",
                description:
                    "Recibimos carga de distintos orígenes en un solo punto para simplificar tu operación de importación.",
            },
            {
                icon: Layers,
                title: "Consolidación eficiente de bultos",
                description:
                    "Agrupamos y organizamos la carga para reducir costos de flete y optimizar el tránsito internacional.",
            },
            {
                icon: ShieldCheck,
                title: "Control de calidad y verificación",
                description:
                    "Inspeccionamos la carga al ingreso, verificamos cantidades y documentamos el estado de cada bulto.",
            },
            {
                icon: Clock,
                title: "Operación organizada y eficiente",
                description:
                    "Cada paso del proceso se documenta y coordina para que tu carga salga en tiempo y forma.",
            },
            {
                icon: HeartHandshake,
                title: "Comunicación directa y transparente",
                description:
                    "Te mantenemos informado en cada etapa: recepción, consolidación y despacho.",
            },
        ],
    },

    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            {
                title: "Recepción de carga en warehouse",
                description:
                    "Tus proveedores envían la carga a nuestro warehouse en origen. Recibimos, verificamos e inventariamos cada bulto.",
            },
            {
                title: "Organización y control de calidad",
                description:
                    "Inspeccionamos la carga, verificamos cantidades y estado, y organizamos todo para la consolidación.",
            },
            {
                title: "Consolidación y preparación",
                description:
                    "Agrupamos los bultos de forma optimizada, embalamos según normativa y preparamos la carga para el tránsito.",
            },
            {
                title: "Salida internacional coordinada",
                description:
                    "Coordinamos el despacho de la carga consolidada hacia Argentina con seguimiento activo.",
            },
        ],
    },

    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            {
                icon: Briefcase,
                label: "Importadores multi-proveedor",
                description:
                    "Que compran a varios proveedores y necesitan consolidar toda la carga en un solo envío.",
            },
            {
                icon: Store,
                label: "Pymes y emprendedores",
                description:
                    "Que quieren optimizar costos agrupando compras de distintos proveedores.",
            },
            {
                icon: ShoppingCart,
                label: "Ecommerce",
                description:
                    "Que reponen stock de múltiples orígenes y necesitan consolidar antes de enviar.",
            },
            {
                icon: Building2,
                label: "Empresas con operaciones recurrentes",
                description:
                    "Que necesitan un punto fijo de recepción y consolidación en origen.",
            },
        ],
    },

    cta: {
        title: "Contanos qué necesitás consolidar",
        subtitle:
            "Te ayudamos a organizar la recepción y consolidación de tu carga. Escribinos con los detalles y recibí una cotización sin compromiso.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20cotizar%20warehouse%20y%20consolidaci%C3%B3n",
    },
};

export default warehouseData;
