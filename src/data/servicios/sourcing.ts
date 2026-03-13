import {
    Search,
    UserCheck,
    Handshake,
    Package,
    Route,
    ShieldCheck,
    Clock,
    HeartHandshake,
    BadgeCheck,
    Briefcase,
    Store,
    TrendingUp,
    ShoppingCart,
} from "lucide-react";
import type { ServiceLandingData } from "@/components/servicios/types";

const es: ServiceLandingData = {
    meta: {
        title: "Sourcing en China",
        description: "Apoyo comercial y operativo desde origen. Búsqueda, validación y coordinación de proveedores en China.",
        slug: "sourcing",
    },
    hero: {
        eyebrow: "Sourcing en China",
        title: "Apoyo comercial y operativo desde",
        titleAccent: "origen",
        subtitle: "Acompañamos a empresas que necesitan buscar, validar o coordinar proveedores en China, ordenando la operación desde el inicio para reducir fricción y preparar correctamente la compra.",
        ctaPrimary: { label: "Cotizar operación", href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20sourcing%20en%20China" },
        ctaSecondary: { label: "Hablar con un asesor", href: "https://wa.me/5491155955269" },
        stats: [
            { value: "China", label: "origen directo" },
            { value: "100%", label: "validación" },
            { value: "Integral", label: "coordinación" },
        ],
        flowNodes: [
            { icon: Search, label: "Búsqueda", sublabel: "Proveedores" },
            { icon: UserCheck, label: "Validación", sublabel: "Comercial" },
            { icon: Handshake, label: "Coordinación", sublabel: "Operativa" },
            { icon: Package, label: "Despacho", sublabel: "Listo para envío" },
        ],
    },
    benefits: {
        eyebrow: "Ventajas",
        title: "Por qué hacer sourcing con Shippar",
        items: [
            { icon: Search, title: "Coordinación directa con proveedores en China", description: "Buscamos y validamos proveedores que se ajusten a tu necesidad: producto, calidad, volumen y precio." },
            { icon: ShieldCheck, title: "Validación comercial y de producto", description: "Verificamos la seriedad del proveedor, solicitamos muestras y validamos especificaciones antes de comprar." },
            { icon: Route, title: "Apoyo operativo desde el inicio", description: "Ordenamos la operación desde la compra: coordinamos pagos, producción, control de calidad y preparación de carga." },
            { icon: Clock, title: "Reducción de fricción y tiempos", description: "Al coordinar desde origen, reducimos errores, demoras y costos innecesarios en la cadena." },
            { icon: HeartHandshake, title: "Equipo local en China", description: "Contamos con presencia en origen para inspecciones, negociaciones y seguimiento directo." },
        ],
    },
    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            { title: "Definición de necesidad y producto", description: "Entendemos qué necesitás importar: tipo de producto, especificaciones, volumen estimado y presupuesto." },
            { title: "Búsqueda y preselección de proveedores", description: "Buscamos proveedores en China que se ajusten a tus requerimientos y te presentamos opciones validadas." },
            { title: "Validación y negociación", description: "Verificamos al proveedor, solicitamos muestras y negociamos condiciones comerciales favorables." },
            { title: "Coordinación de compra y despacho", description: "Una vez aprobado, coordinamos la producción, el control de calidad y la preparación de carga para envío." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            { icon: Briefcase, label: "Importadores nuevos", description: "Que quieren comprar en China por primera vez y necesitan guía profesional." },
            { icon: Store, label: "Pymes y marcas propias", description: "Que buscan proveedores confiables para fabricar o importar productos con su marca." },
            { icon: ShoppingCart, label: "Ecommerce", description: "Que necesitan encontrar proveedores competitivos para productos de reventa." },
            { icon: TrendingUp, label: "Empresas en expansión", description: "Que están diversificando sus fuentes de compra y necesitan presencia en China." },
        ],
    },
    cta: {
        title: "Contanos qué necesitás encontrar en China",
        subtitle: "Te ayudamos a buscar, validar y coordinar proveedores. Escribinos con los detalles de tu producto.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20sourcing%20en%20China",
    },
};

const en: ServiceLandingData = {
    meta: {
        title: "Sourcing in China",
        description: "Commercial and operational support from origin. Supplier search, validation, and coordination in China.",
        slug: "sourcing",
    },
    hero: {
        eyebrow: "Sourcing in China",
        title: "Commercial and operational support from",
        titleAccent: "origin",
        subtitle: "We support companies that need to find, validate, or coordinate suppliers in China, organizing the operation from the start to reduce friction and properly prepare the purchase.",
        ctaPrimary: { label: "Get a quote", href: "https://wa.me/5491155955269?text=Hi%2C%20I'd%20like%20to%20quote%20sourcing%20in%20China" },
        ctaSecondary: { label: "Talk to an advisor", href: "https://wa.me/5491155955269" },
        stats: [
            { value: "China", label: "direct origin" },
            { value: "100%", label: "validation" },
            { value: "Full", label: "coordination" },
        ],
        flowNodes: [
            { icon: Search, label: "Search", sublabel: "Suppliers" },
            { icon: UserCheck, label: "Validation", sublabel: "Commercial" },
            { icon: Handshake, label: "Coordination", sublabel: "Operational" },
            { icon: Package, label: "Dispatch", sublabel: "Ready to ship" },
        ],
    },
    benefits: {
        eyebrow: "Benefits",
        title: "Why source with Shippar",
        items: [
            { icon: Search, title: "Direct coordination with suppliers in China", description: "We search and validate suppliers that match your needs: product, quality, volume, and price." },
            { icon: ShieldCheck, title: "Commercial and product validation", description: "We verify supplier reliability, request samples, and validate specifications before purchasing." },
            { icon: Route, title: "Operational support from the start", description: "We organize the operation from purchase: we coordinate payments, production, quality control, and cargo preparation." },
            { icon: Clock, title: "Reduced friction and timelines", description: "By coordinating from origin, we reduce errors, delays, and unnecessary costs in the supply chain." },
            { icon: HeartHandshake, title: "Local team in China", description: "We have on-the-ground presence for inspections, negotiations, and direct follow-up." },
        ],
    },
    process: {
        eyebrow: "How it works",
        title: "The step-by-step process",
        steps: [
            { title: "Needs and product definition", description: "We understand what you need to import: product type, specifications, estimated volume, and budget." },
            { title: "Supplier search and shortlisting", description: "We search for suppliers in China that match your requirements and present validated options." },
            { title: "Validation and negotiation", description: "We verify the supplier, request samples, and negotiate favorable commercial terms." },
            { title: "Purchase and dispatch coordination", description: "Once approved, we coordinate production, quality control, and cargo preparation for shipping." },
        ],
    },
    idealFor: {
        eyebrow: "Ideal for",
        title: "Is this service for you?",
        profiles: [
            { icon: Briefcase, label: "First-time importers", description: "Who want to buy from China for the first time and need professional guidance." },
            { icon: Store, label: "SMBs and private label brands", description: "Who are looking for reliable suppliers to manufacture or import products under their own brand." },
            { icon: ShoppingCart, label: "Ecommerce", description: "Who need to find competitive suppliers for resale products." },
            { icon: TrendingUp, label: "Expanding companies", description: "Who are diversifying their purchasing sources and need presence in China." },
        ],
    },
    cta: {
        title: "Tell us what you need to find in China",
        subtitle: "We'll help you search, validate, and coordinate suppliers. Send us your product details.",
        ctaLabel: "Start a conversation",
        ctaHref: "https://wa.me/5491155955269?text=Hi%2C%20I%20need%20sourcing%20in%20China",
    },
};

const sourcingData = { es, en };
export default sourcingData;
