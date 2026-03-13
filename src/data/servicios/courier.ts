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

const es: ServiceLandingData = {
    meta: {
        title: "Courier Comercial — Importaciones Puerta a Puerta",
        description: "Importaciones puerta a puerta para pymes y emprendedores. Operación bajo régimen courier simplificado, rápida y económica.",
        slug: "courier",
    },
    hero: {
        eyebrow: "Courier Comercial",
        title: "Importaciones puerta a puerta para empresas, pymes y",
        titleAccent: "emprendedores",
        subtitle: "Importaciones bajo régimen courier simplificado para pymes y emprendedores que necesitan traer productos del exterior con una operación clara, rápida y económica.",
        badges: ["Sin límite de valor", "No necesitás ser importador"],
        ctaPrimary: { label: "Cotizar operación", href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20una%20importaci%C3%B3n%20courier%20comercial" },
        ctaSecondary: { label: "Hablar con un asesor", href: "https://wa.me/5491155955269" },
        stats: [
            { value: "5–7", label: "días de tránsito" },
            { value: "24/7", label: "seguimiento" },
            { value: "100%", label: "trazabilidad" },
        ],
        flowNodes: [
            { icon: Handshake, label: "Coordinación", sublabel: "Proveedor en origen" },
            { icon: Package, label: "Recolección", sublabel: "Preparación de carga" },
            { icon: Plane, label: "Tránsito", sublabel: "Vuelo internacional" },
            { icon: ShieldCheck, label: "Gestión documental", sublabel: "Validación en Argentina" },
            { icon: Truck, label: "Entrega final", sublabel: "Puerta a puerta" },
        ],
    },
    benefits: {
        eyebrow: "Ventajas",
        title: "Por qué operar con Shippar",
        items: [
            { icon: Route, title: "Operación comercial integral puerta a puerta", description: "Gestionamos toda la cadena: desde la recolección en origen con tu proveedor hasta la entrega final en tu domicilio en Argentina." },
            { icon: FileSearch, title: "Cotización con impuestos detallados", description: "Recibís un desglose completo con impuestos, tasas aduaneras y costos operativos. Sabés exactamente cuánto vas a pagar antes de iniciar." },
            { icon: Clock, title: "Seguimiento de punta a punta", description: "Rastreá tu carga en cada etapa del proceso: recolección, tránsito, despacho y última milla. Siempre sabés dónde está tu mercadería.", link: { label: "Probar rastreador →", href: "/rastrear" } },
            { icon: HeartHandshake, title: "Atención personalizada durante toda la operación", description: "Un equipo real que conoce tu caso te acompaña de principio a fin. Sin bots, sin respuestas automáticas, sin tickets impersonales." },
            { icon: BadgeCheck, title: "Validación operativa desde origen hasta entrega final", description: "Cada paso de la operación se documenta y valida. Controlamos la carga en origen, el tránsito y la gestión aduanera antes de que llegue a tus manos." },
        ],
    },
    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            { title: "Coordinación con proveedor en origen", description: "Nos comunicamos directamente con tu proveedor para coordinar el retiro de la carga y verificar los detalles de la operación." },
            { title: "Recolección y preparación de carga", description: "Retiramos la carga, la inspeccionamos y embalamos según normativa, y la preparamos para el tránsito internacional." },
            { title: "Tránsito internacional", description: "La mercadería viaja con seguimiento activo real. Te mantenemos informado con actualizaciones, o lo verificás vos en todo momento desde nuestra plataforma." },
            { title: "Gestión operativa y documental en Argentina", description: "Nos encargamos de la documentación, validación ante aduana y la gestión completa del despacho para que tu carga sea liberada." },
            { title: "Entrega final coordinada", description: "Una vez liberada la carga, coordinamos la última milla hasta tu domicilio o depósito. Hacemos envíos a todo el país." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            { icon: Briefcase, label: "Importadores", description: "Que necesitan una operación profesional con documentación completa y seguimiento real." },
            { icon: Store, label: "Pymes", description: "Que importan insumos o productos terminados de forma recurrente y buscan un partner logístico confiable." },
            { icon: TrendingUp, label: "Emprendedores", description: "Que traen mercadería para reventa o marca propia y necesitan una solución clara y rentable." },
            { icon: ShoppingCart, label: "Ecommerce", description: "Que reponen stock desde el exterior y necesitan tiempos predecibles para mantener su operación en marcha." },
            { icon: Building2, label: "Empresas en crecimiento", description: "Que están escalando su volumen de importación y necesitan una logística que acompañe su ritmo." },
        ],
    },
    cta: {
        title: "¿Qué necesitás enviar?",
        subtitle: "Te ayudamos a definir la mejor solución para tu operación. Escribinos con los detalles y recibí tu cotización al instante.",
        useForm: true,
        ctaLabel: "Enviar consulta",
        ctaHref: "",
    },
};

const en: ServiceLandingData = {
    meta: {
        title: "Commercial Courier — Door-to-Door Imports",
        description: "Door-to-door imports for SMBs and entrepreneurs. Fast, affordable operations under simplified courier regime.",
        slug: "courier",
    },
    hero: {
        eyebrow: "Commercial Courier",
        title: "Door-to-door imports for companies, SMBs and",
        titleAccent: "entrepreneurs",
        subtitle: "Imports under a simplified courier regime for SMBs and entrepreneurs who need to bring products from abroad with a clear, fast, and affordable operation.",
        badges: ["No value limit", "No importer license needed"],
        ctaPrimary: { label: "Get a quote", href: "https://wa.me/5491155955269?text=Hi%2C%20I'd%20like%20to%20quote%20a%20commercial%20courier%20import" },
        ctaSecondary: { label: "Talk to an advisor", href: "https://wa.me/5491155955269" },
        stats: [
            { value: "5–7", label: "transit days" },
            { value: "24/7", label: "tracking" },
            { value: "100%", label: "traceability" },
        ],
        flowNodes: [
            { icon: Handshake, label: "Coordination", sublabel: "Supplier at origin" },
            { icon: Package, label: "Pickup", sublabel: "Cargo preparation" },
            { icon: Plane, label: "Transit", sublabel: "International flight" },
            { icon: ShieldCheck, label: "Customs clearance", sublabel: "Validation in Argentina" },
            { icon: Truck, label: "Final delivery", sublabel: "Door to door" },
        ],
    },
    benefits: {
        eyebrow: "Benefits",
        title: "Why operate with Shippar",
        items: [
            { icon: Route, title: "Full door-to-door commercial operation", description: "We manage the entire chain: from pickup at origin with your supplier to final delivery at your address in Argentina." },
            { icon: FileSearch, title: "Quotes with detailed taxes", description: "You receive a full breakdown with taxes, customs duties, and operational costs. You know exactly what you'll pay before starting." },
            { icon: Clock, title: "End-to-end tracking", description: "Track your cargo at every stage: pickup, transit, customs clearance, and last mile. You always know where your goods are.", link: { label: "Try our tracker →", href: "/rastrear" } },
            { icon: HeartHandshake, title: "Personalized support throughout the operation", description: "A real team that knows your case accompanies you from start to finish. No bots, no automated replies, no impersonal tickets." },
            { icon: BadgeCheck, title: "Operational validation from origin to final delivery", description: "Every step of the operation is documented and validated. We control the cargo at origin, transit, and customs management before it reaches your hands." },
        ],
    },
    process: {
        eyebrow: "How it works",
        title: "The step-by-step process",
        steps: [
            { title: "Coordination with supplier at origin", description: "We communicate directly with your supplier to coordinate cargo pickup and verify the operation details." },
            { title: "Cargo pickup and preparation", description: "We pick up the cargo, inspect and package it according to regulations, and prepare it for international transit." },
            { title: "International transit", description: "Your goods travel with real-time active tracking. We keep you informed with updates, or you can check anytime from our platform." },
            { title: "Operational and customs management in Argentina", description: "We handle documentation, customs validation, and complete clearance management so your cargo is released." },
            { title: "Coordinated final delivery", description: "Once the cargo is cleared, we coordinate last-mile delivery to your address or warehouse. We ship nationwide." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal for",
        title: "Is this service for you?",
        profiles: [
            { icon: Briefcase, label: "Importers", description: "Who need a professional operation with complete documentation and real tracking." },
            { icon: Store, label: "SMBs", description: "Who import supplies or finished products regularly and need a reliable logistics partner." },
            { icon: TrendingUp, label: "Entrepreneurs", description: "Who bring goods for resale or private label and need a clear, cost-effective solution." },
            { icon: ShoppingCart, label: "Ecommerce", description: "Who restock from abroad and need predictable timelines to keep their operation running." },
            { icon: Building2, label: "Growing companies", description: "Who are scaling their import volume and need logistics that keep up with their pace." },
        ],
    },
    cta: {
        title: "What do you need to ship?",
        subtitle: "We'll help you find the best solution for your operation. Send us the details and get your quote instantly.",
        useForm: true,
        ctaLabel: "Send inquiry",
        ctaHref: "",
    },
};

const courierData = { es, en };
export default courierData;
