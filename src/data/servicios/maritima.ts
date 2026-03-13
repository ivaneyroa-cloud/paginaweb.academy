import {
    Package,
    Globe,
    ShieldCheck,
    FileText,
    Route,
    Clock,
    HeartHandshake,
    BadgeCheck,
    Scale,
    Briefcase,
    Store,
    Building2,
    TrendingUp,
} from "lucide-react";
import type { ServiceLandingData } from "@/components/servicios/types";

const es: ServiceLandingData = {
    meta: {
        title: "Carga Marítima — LCL / FCL",
        description: "Soluciones marítimas según el volumen de tu operación. Carga consolidada o contenedor completo con coordinación de punta a punta.",
        slug: "maritima",
    },
    hero: {
        eyebrow: "Carga Marítima",
        title: "Soluciones marítimas según el volumen de tu",
        titleAccent: "operación",
        subtitle: "Ofrecemos alternativas de carga consolidada o contenedor completo para empresas que necesitan una solución marítima adaptada al tipo de carga, el volumen y los tiempos de la operación.",
        ctaPrimary: { label: "Cotizar operación", href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20carga%20mar%C3%ADtima" },
        ctaSecondary: { label: "Hablar con un asesor", href: "https://wa.me/5491155955269" },
        stats: [
            { value: "LCL", label: "consolidada" },
            { value: "FCL", label: "contenedor completo" },
            { value: "100%", label: "trazabilidad" },
        ],
        flowNodes: [
            { icon: Package, label: "Carga", sublabel: "LCL o FCL" },
            { icon: FileText, label: "Documentación", sublabel: "Exportación" },
            { icon: Globe, label: "Tránsito", sublabel: "Marítimo" },
            { icon: ShieldCheck, label: "Liberación", sublabel: "Aduana AR" },
        ],
    },
    benefits: {
        eyebrow: "Ventajas",
        title: "Por qué elegir carga marítima con Shippar",
        items: [
            { icon: Scale, title: "Opción consolidada o contenedor completo", description: "Elegí la modalidad que mejor se adapta a tu volumen: LCL para cargas parciales o FCL para contenedor exclusivo." },
            { icon: Route, title: "Coordinación internacional de punta a punta", description: "Gestionamos toda la cadena desde el puerto de origen hasta la liberación en Argentina." },
            { icon: Clock, title: "Alternativas según volumen y necesidad operativa", description: "Adaptamos la solución al tipo de carga, los tiempos y el presupuesto de cada operación." },
            { icon: HeartHandshake, title: "Acompañamiento operativo dedicado", description: "Un equipo real te guía en cada paso, desde la cotización hasta la entrega de la carga." },
            { icon: BadgeCheck, title: "Gestión documental y aduanera completa", description: "Nos encargamos de la documentación de importación, validación y despacho ante aduana." },
        ],
    },
    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            { title: "Definición de modalidad y cotización", description: "Evaluamos tu carga y definimos si conviene LCL o FCL según volumen, peso y tiempos requeridos." },
            { title: "Coordinación en origen y documentación", description: "Preparamos la documentación de exportación y coordinamos la carga en el puerto de origen." },
            { title: "Tránsito marítimo con seguimiento", description: "La carga viaja con tracking activo. Te mantenemos informado con actualizaciones reales del tránsito." },
            { title: "Arribo, liberación y despacho en Argentina", description: "Gestionamos la liberación en aduana, el despacho y la entrega coordinada de la carga." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            { icon: Briefcase, label: "Importadores de volumen", description: "Que necesitan mover cargas grandes de forma rentable y planificada." },
            { icon: Building2, label: "Industrias", description: "Que importan materias primas o insumos en grandes cantidades de forma recurrente." },
            { icon: Store, label: "Distribuidores", description: "Que reponen stock desde el exterior y necesitan optimizar costos de flete." },
            { icon: TrendingUp, label: "Empresas en crecimiento", description: "Que están escalando su volumen de importación y necesitan pasar a carga marítima." },
        ],
    },
    cta: {
        title: "Contanos qué necesitás mover por mar",
        subtitle: "Te ayudamos a definir la mejor modalidad para tu carga. Escribinos con los detalles y recibí una cotización sin compromiso.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20cotizar%20carga%20mar%C3%ADtima",
    },
};

const en: ServiceLandingData = {
    meta: {
        title: "Ocean Freight — LCL / FCL",
        description: "Maritime solutions tailored to your operation volume. Consolidated or full container with end-to-end coordination.",
        slug: "maritima",
    },
    hero: {
        eyebrow: "Ocean Freight",
        title: "Maritime solutions tailored to your",
        titleAccent: "operation",
        subtitle: "We offer consolidated cargo or full container options for companies that need a maritime solution adapted to cargo type, volume, and operation timelines.",
        ctaPrimary: { label: "Get a quote", href: "https://wa.me/5491155955269?text=Hi%2C%20I'd%20like%20to%20quote%20ocean%20freight" },
        ctaSecondary: { label: "Talk to an advisor", href: "https://wa.me/5491155955269" },
        stats: [
            { value: "LCL", label: "consolidated" },
            { value: "FCL", label: "full container" },
            { value: "100%", label: "traceability" },
        ],
        flowNodes: [
            { icon: Package, label: "Cargo", sublabel: "LCL or FCL" },
            { icon: FileText, label: "Documentation", sublabel: "Export" },
            { icon: Globe, label: "Transit", sublabel: "Maritime" },
            { icon: ShieldCheck, label: "Release", sublabel: "AR Customs" },
        ],
    },
    benefits: {
        eyebrow: "Benefits",
        title: "Why choose ocean freight with Shippar",
        items: [
            { icon: Scale, title: "Consolidated or full container option", description: "Choose the modality that best fits your volume: LCL for partial loads or FCL for exclusive containers." },
            { icon: Route, title: "End-to-end international coordination", description: "We manage the entire chain from the port of origin to release in Argentina." },
            { icon: Clock, title: "Options based on volume and operational needs", description: "We adapt the solution to cargo type, timelines, and budget for each operation." },
            { icon: HeartHandshake, title: "Dedicated operational support", description: "A real team guides you at every step, from quote to cargo delivery." },
            { icon: BadgeCheck, title: "Complete customs and document management", description: "We handle import documentation, validation, and customs clearance." },
        ],
    },
    process: {
        eyebrow: "How it works",
        title: "The step-by-step process",
        steps: [
            { title: "Modality definition and quote", description: "We assess your cargo and determine whether LCL or FCL is best based on volume, weight, and required timelines." },
            { title: "Origin coordination and documentation", description: "We prepare export documentation and coordinate cargo loading at the port of origin." },
            { title: "Maritime transit with tracking", description: "The cargo travels with active tracking. We keep you informed with real transit updates." },
            { title: "Arrival, release, and clearance in Argentina", description: "We manage customs release, clearance, and coordinated cargo delivery." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal for",
        title: "Is this service for you?",
        profiles: [
            { icon: Briefcase, label: "Volume importers", description: "Who need to move large loads in a cost-effective and planned manner." },
            { icon: Building2, label: "Industries", description: "Who import raw materials or supplies in large quantities on a recurring basis." },
            { icon: Store, label: "Distributors", description: "Who restock from abroad and need to optimize freight costs." },
            { icon: TrendingUp, label: "Growing companies", description: "Who are scaling import volume and need to transition to ocean freight." },
        ],
    },
    cta: {
        title: "Tell us what you need to ship by sea",
        subtitle: "We'll help you define the best modality for your cargo. Send us the details and get a no-commitment quote.",
        ctaLabel: "Start a conversation",
        ctaHref: "https://wa.me/5491155955269?text=Hi%2C%20I%20need%20to%20quote%20ocean%20freight",
    },
};

const maritimaData = { es, en };
export default maritimaData;
