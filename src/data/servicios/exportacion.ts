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

const es: ServiceLandingData = {
    meta: {
        title: "Exportación Courier — Envíos Internacionales",
        description: "Envíos internacionales para empresas que venden al exterior. Operación completa con soporte documental y seguimiento de punta a punta.",
        slug: "exportacion",
    },
    hero: {
        eyebrow: "Exportación Courier",
        title: "Envíos internacionales para empresas que venden al",
        titleAccent: "exterior",
        subtitle: "Acompañamos operaciones de exportación con una solución práctica y ordenada para que empresas y marcas puedan enviar carga fuera del país con gestión integral y seguimiento durante todo el proceso.",
        ctaPrimary: { label: "Cotizar operación", href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20una%20exportaci%C3%B3n%20courier" },
        ctaSecondary: { label: "Hablar con un asesor", href: "https://wa.me/5491155955269" },
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
            { icon: Route, title: "Operación ágil para exportaciones courier", description: "Gestionamos la operación de salida de forma rápida y organizada, desde la preparación en Argentina hasta la entrega en destino." },
            { icon: FileSearch, title: "Soporte documental y operativo", description: "Te acompañamos con la documentación necesaria para que la carga salga sin demoras ni problemas en aduana." },
            { icon: Clock, title: "Seguimiento durante toda la operación", description: "Rastreá tu carga en cada etapa del proceso: preparación, salida, tránsito y entrega en destino." },
            { icon: HeartHandshake, title: "Atención dedicada para cada operación", description: "Un equipo que conoce tu caso y te acompaña de principio a fin. Sin respuestas automáticas." },
            { icon: BadgeCheck, title: "Cumplimiento normativo garantizado", description: "Nos aseguramos de que cada operación cumpla con los requisitos aduaneros y regulatorios del país de destino." },
        ],
    },
    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            { title: "Preparación de la carga en Argentina", description: "Coordinamos el retiro de la carga en tu ubicación, la inspeccionamos y la preparamos según normativa de exportación." },
            { title: "Gestión documental y aduanera", description: "Nos encargamos de toda la documentación necesaria para la salida de la carga desde Argentina." },
            { title: "Tránsito internacional", description: "La carga viaja con seguimiento activo en cada tramo del tránsito hasta el país de destino." },
            { title: "Entrega en destino", description: "Coordinamos la entrega final en el país de destino, asegurando que la carga llegue en tiempo y forma." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            { icon: Briefcase, label: "Exportadores", description: "Que necesitan una operación profesional con documentación completa y seguimiento real." },
            { icon: Store, label: "Marcas argentinas", description: "Que venden productos al exterior y necesitan una logística confiable desde Argentina." },
            { icon: TrendingUp, label: "Empresas en expansión", description: "Que están abriendo mercados internacionales y necesitan un partner logístico." },
            { icon: Building2, label: "Fabricantes", description: "Que exportan insumos o productos terminados de forma recurrente." },
        ],
    },
    cta: {
        title: "Contanos qué necesitás exportar",
        subtitle: "Te ayudamos a definir la mejor solución para tu operación de exportación. Escribinos con los detalles y recibí una cotización sin compromiso.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20cotizar%20una%20exportaci%C3%B3n%20courier",
    },
};

const en: ServiceLandingData = {
    meta: {
        title: "Courier Export — International Shipments",
        description: "International shipments for companies selling abroad. Complete operation with document support and end-to-end tracking.",
        slug: "exportacion",
    },
    hero: {
        eyebrow: "Courier Export",
        title: "International shipments for companies selling",
        titleAccent: "abroad",
        subtitle: "We support export operations with a practical and organized solution so companies and brands can ship cargo internationally with full management and tracking throughout the process.",
        ctaPrimary: { label: "Get a quote", href: "https://wa.me/5491155955269?text=Hi%2C%20I'd%20like%20to%20quote%20a%20courier%20export" },
        ctaSecondary: { label: "Talk to an advisor", href: "https://wa.me/5491155955269" },
        stats: [
            { value: "5–10", label: "transit days" },
            { value: "100%", label: "traceability" },
            { value: "24/7", label: "tracking" },
        ],
        flowNodes: [
            { icon: Package, label: "Preparation", sublabel: "Argentina" },
            { icon: Plane, label: "Departure", sublabel: "International" },
            { icon: Globe, label: "Transit", sublabel: "Global" },
            { icon: CheckCircle, label: "Delivery", sublabel: "Destination" },
        ],
    },
    benefits: {
        eyebrow: "Benefits",
        title: "Why export with Shippar",
        items: [
            { icon: Route, title: "Agile courier export operation", description: "We manage the outbound operation quickly and efficiently, from preparation in Argentina to delivery at destination." },
            { icon: FileSearch, title: "Document and operational support", description: "We provide the necessary documentation so your cargo ships without delays or customs issues." },
            { icon: Clock, title: "Tracking throughout the operation", description: "Track your cargo at every stage: preparation, departure, transit, and delivery at destination." },
            { icon: HeartHandshake, title: "Dedicated support for each operation", description: "A team that knows your case and accompanies you from start to finish. No automated replies." },
            { icon: BadgeCheck, title: "Guaranteed regulatory compliance", description: "We ensure every operation meets the customs and regulatory requirements of the destination country." },
        ],
    },
    process: {
        eyebrow: "How it works",
        title: "The step-by-step process",
        steps: [
            { title: "Cargo preparation in Argentina", description: "We coordinate cargo pickup at your location, inspect it, and prepare it according to export regulations." },
            { title: "Document and customs management", description: "We handle all documentation needed for cargo departure from Argentina." },
            { title: "International transit", description: "The cargo travels with active tracking on every leg of transit to the destination country." },
            { title: "Delivery at destination", description: "We coordinate final delivery in the destination country, ensuring cargo arrives on time and in good condition." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal for",
        title: "Is this service for you?",
        profiles: [
            { icon: Briefcase, label: "Exporters", description: "Who need a professional operation with complete documentation and real tracking." },
            { icon: Store, label: "Argentine brands", description: "Who sell products abroad and need reliable logistics from Argentina." },
            { icon: TrendingUp, label: "Expanding companies", description: "Who are opening international markets and need a logistics partner." },
            { icon: Building2, label: "Manufacturers", description: "Who export supplies or finished products on a recurring basis." },
        ],
    },
    cta: {
        title: "Tell us what you need to export",
        subtitle: "We'll help you define the best solution for your export operation. Send us the details and get a no-commitment quote.",
        ctaLabel: "Start a conversation",
        ctaHref: "https://wa.me/5491155955269?text=Hi%2C%20I%20need%20to%20quote%20a%20courier%20export",
    },
};

const exportacionData = { es, en };
export default exportacionData;
