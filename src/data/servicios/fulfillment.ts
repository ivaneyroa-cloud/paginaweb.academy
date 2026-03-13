import {
    Package,
    ClipboardCheck,
    Truck,
    CheckCircle,
    Route,
    Layers,
    Clock,
    HeartHandshake,
    ShieldCheck,
    Briefcase,
    Store,
    ShoppingCart,
    Building2,
} from "lucide-react";
import type { ServiceLandingData } from "@/components/servicios/types";

const fulfillmentData: ServiceLandingData = {
    meta: {
        title: "Fulfillment — Preparación Logística",
        description:
            "Preparación operativa de carga para distribución. Acondicionamiento, control de calidad y despacho ordenado.",
        slug: "fulfillment",
    },

    hero: {
        eyebrow: "Fulfillment",
        title: "Preparación operativa de carga para",
        titleAccent: "distribución",
        subtitle:
            "Preparamos la carga según requerimientos operativos previos al despacho, facilitando su integración en circuitos logísticos y centros de distribución de forma ordenada y eficiente.",
        ctaPrimary: {
            label: "Cotizar operación",
            href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20fulfillment",
        },
        ctaSecondary: {
            label: "Hablar con un asesor",
            href: "https://wa.me/5491155955269",
        },
        stats: [
            { value: "100%", label: "control" },
            { value: "Ágil", label: "preparación" },
            { value: "Integral", label: "despacho" },
        ],
        flowNodes: [
            { icon: Package, label: "Ingreso", sublabel: "Carga" },
            { icon: ClipboardCheck, label: "Control", sublabel: "Calidad y orden" },
            { icon: CheckCircle, label: "Preparación", sublabel: "Acondicionamiento" },
            { icon: Truck, label: "Despacho", sublabel: "Distribución" },
        ],
    },

    benefits: {
        eyebrow: "Ventajas",
        title: "Por qué elegir fulfillment con Shippar",
        items: [
            {
                icon: Layers,
                title: "Acondicionamiento operativo de carga",
                description:
                    "Preparamos cada unidad según los requerimientos de tu canal de distribución: etiquetado, empaque y organización.",
            },
            {
                icon: ShieldCheck,
                title: "Control de calidad al ingreso",
                description:
                    "Verificamos estado, cantidades y especificaciones antes de iniciar la preparación.",
            },
            {
                icon: Route,
                title: "Preparación previa al despacho",
                description:
                    "Organizamos la carga para que esté lista para ingresar a tu circuito logístico o centro de distribución.",
            },
            {
                icon: Clock,
                title: "Tiempos optimizados de procesamiento",
                description:
                    "Procesos ágiles que minimizan el tiempo entre la recepción de carga y su despacho final.",
            },
            {
                icon: HeartHandshake,
                title: "Coordinación operativa dedicada",
                description:
                    "Un equipo asignado que entiende tu operación y se adapta a tus necesidades específicas.",
            },
        ],
    },

    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            {
                title: "Ingreso y recepción de carga",
                description:
                    "Recibimos la carga en nuestras instalaciones, verificamos cantidades y documentamos el estado de cada unidad.",
            },
            {
                title: "Control de calidad y verificación",
                description:
                    "Inspeccionamos la carga contra las especificaciones acordadas y documentamos cualquier novedad.",
            },
            {
                title: "Acondicionamiento y preparación",
                description:
                    "Etiquetamos, embalamos y organizamos la carga según los requerimientos de tu canal de distribución.",
            },
            {
                title: "Despacho coordinado",
                description:
                    "Coordinamos la salida de la carga hacia tu depósito, centro de distribución o punto de entrega final.",
            },
        ],
    },

    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            {
                icon: ShoppingCart,
                label: "Ecommerce",
                description:
                    "Que necesitan preparar pedidos de forma ágil y organizada para sus clientes.",
            },
            {
                icon: Store,
                label: "Marcas con distribución",
                description:
                    "Que necesitan acondicionamiento previo antes de enviar a puntos de venta.",
            },
            {
                icon: Briefcase,
                label: "Importadores",
                description:
                    "Que necesitan procesar carga importada antes de distribuirla localmente.",
            },
            {
                icon: Building2,
                label: "Empresas con logística tercerizada",
                description:
                    "Que buscan un partner para la preparación operativa de su carga.",
            },
        ],
    },

    cta: {
        title: "Contanos qué necesitás preparar",
        subtitle:
            "Te ayudamos a organizar la preparación y despacho de tu carga. Escribinos con los detalles.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20cotizar%20fulfillment",
    },
};

export default fulfillmentData;
