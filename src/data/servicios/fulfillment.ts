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

const es: ServiceLandingData = {
    meta: {
        title: "Fulfillment — Preparación Logística",
        description: "Preparación operativa de carga para distribución. Acondicionamiento, control de calidad y despacho ordenado.",
        slug: "fulfillment",
    },
    hero: {
        eyebrow: "Fulfillment",
        title: "Preparación operativa de carga para",
        titleAccent: "distribución",
        subtitle: "Preparamos la carga según requerimientos operativos previos al despacho, facilitando su integración en circuitos logísticos y centros de distribución de forma ordenada y eficiente.",
        ctaPrimary: { label: "Cotizar operación", href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20fulfillment" },
        ctaSecondary: { label: "Hablar con un asesor", href: "https://wa.me/5491155955269" },
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
            { icon: Layers, title: "Acondicionamiento operativo de carga", description: "Preparamos cada unidad según los requerimientos de tu canal de distribución: etiquetado, empaque y organización." },
            { icon: ShieldCheck, title: "Control de calidad al ingreso", description: "Verificamos estado, cantidades y especificaciones antes de iniciar la preparación." },
            { icon: Route, title: "Preparación previa al despacho", description: "Organizamos la carga para que esté lista para ingresar a tu circuito logístico o centro de distribución." },
            { icon: Clock, title: "Tiempos optimizados de procesamiento", description: "Procesos ágiles que minimizan el tiempo entre la recepción de carga y su despacho final." },
            { icon: HeartHandshake, title: "Coordinación operativa dedicada", description: "Un equipo asignado que entiende tu operación y se adapta a tus necesidades específicas." },
        ],
    },
    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            { title: "Ingreso y recepción de carga", description: "Recibimos la carga en nuestras instalaciones, verificamos cantidades y documentamos el estado de cada unidad." },
            { title: "Control de calidad y verificación", description: "Inspeccionamos la carga contra las especificaciones acordadas y documentamos cualquier novedad." },
            { title: "Acondicionamiento y preparación", description: "Etiquetamos, embalamos y organizamos la carga según los requerimientos de tu canal de distribución." },
            { title: "Despacho coordinado", description: "Coordinamos la salida de la carga hacia tu depósito, centro de distribución o punto de entrega final." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            { icon: ShoppingCart, label: "Ecommerce", description: "Que necesitan preparar pedidos de forma ágil y organizada para sus clientes." },
            { icon: Store, label: "Marcas con distribución", description: "Que necesitan acondicionamiento previo antes de enviar a puntos de venta." },
            { icon: Briefcase, label: "Importadores", description: "Que necesitan procesar carga importada antes de distribuirla localmente." },
            { icon: Building2, label: "Empresas con logística tercerizada", description: "Que buscan un partner para la preparación operativa de su carga." },
        ],
    },
    cta: {
        title: "Contanos qué necesitás preparar",
        subtitle: "Te ayudamos a organizar la preparación y despacho de tu carga. Escribinos con los detalles.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20cotizar%20fulfillment",
    },
};

const en: ServiceLandingData = {
    meta: {
        title: "Fulfillment — Logistics Preparation",
        description: "Operational cargo preparation for distribution. Conditioning, quality control, and organized dispatch.",
        slug: "fulfillment",
    },
    hero: {
        eyebrow: "Fulfillment",
        title: "Operational cargo preparation for",
        titleAccent: "distribution",
        subtitle: "We prepare cargo according to pre-dispatch operational requirements, facilitating its integration into logistics circuits and distribution centers in an organized and efficient manner.",
        ctaPrimary: { label: "Get a quote", href: "https://wa.me/5491155955269?text=Hi%2C%20I'd%20like%20to%20quote%20fulfillment" },
        ctaSecondary: { label: "Talk to an advisor", href: "https://wa.me/5491155955269" },
        stats: [
            { value: "100%", label: "control" },
            { value: "Agile", label: "preparation" },
            { value: "Full", label: "dispatch" },
        ],
        flowNodes: [
            { icon: Package, label: "Intake", sublabel: "Cargo" },
            { icon: ClipboardCheck, label: "Control", sublabel: "Quality & order" },
            { icon: CheckCircle, label: "Preparation", sublabel: "Conditioning" },
            { icon: Truck, label: "Dispatch", sublabel: "Distribution" },
        ],
    },
    benefits: {
        eyebrow: "Benefits",
        title: "Why choose fulfillment with Shippar",
        items: [
            { icon: Layers, title: "Operational cargo conditioning", description: "We prepare each unit according to your distribution channel requirements: labeling, packaging, and organization." },
            { icon: ShieldCheck, title: "Quality control at intake", description: "We verify condition, quantities, and specifications before starting preparation." },
            { icon: Route, title: "Pre-dispatch preparation", description: "We organize cargo so it's ready to enter your logistics circuit or distribution center." },
            { icon: Clock, title: "Optimized processing times", description: "Agile processes that minimize time between cargo reception and final dispatch." },
            { icon: HeartHandshake, title: "Dedicated operational coordination", description: "An assigned team that understands your operation and adapts to your specific needs." },
        ],
    },
    process: {
        eyebrow: "How it works",
        title: "The step-by-step process",
        steps: [
            { title: "Cargo intake and reception", description: "We receive cargo at our facilities, verify quantities, and document the condition of each unit." },
            { title: "Quality control and verification", description: "We inspect the cargo against agreed specifications and document any findings." },
            { title: "Conditioning and preparation", description: "We label, package, and organize cargo according to your distribution channel requirements." },
            { title: "Coordinated dispatch", description: "We coordinate cargo departure to your warehouse, distribution center, or final delivery point." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal for",
        title: "Is this service for you?",
        profiles: [
            { icon: ShoppingCart, label: "Ecommerce", description: "Who need to prepare orders quickly and efficiently for their customers." },
            { icon: Store, label: "Brands with distribution", description: "Who need pre-conditioning before shipping to retail locations." },
            { icon: Briefcase, label: "Importers", description: "Who need to process imported cargo before local distribution." },
            { icon: Building2, label: "Companies with outsourced logistics", description: "Who are looking for a partner for operational cargo preparation." },
        ],
    },
    cta: {
        title: "Tell us what you need to prepare",
        subtitle: "We'll help you organize the preparation and dispatch of your cargo. Send us the details.",
        ctaLabel: "Start a conversation",
        ctaHref: "https://wa.me/5491155955269?text=Hi%2C%20I%20need%20to%20quote%20fulfillment",
    },
};

const fulfillmentData = { es, en };
export default fulfillmentData;
