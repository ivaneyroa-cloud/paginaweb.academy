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

const sourcingData: ServiceLandingData = {
    meta: {
        title: "Sourcing en China",
        description:
            "Apoyo comercial y operativo desde origen. Búsqueda, validación y coordinación de proveedores en China.",
        slug: "sourcing",
    },

    hero: {
        eyebrow: "Sourcing en China",
        title: "Apoyo comercial y operativo desde",
        titleAccent: "origen",
        subtitle:
            "Acompañamos a empresas que necesitan buscar, validar o coordinar proveedores en China, ordenando la operación desde el inicio para reducir fricción y preparar correctamente la compra.",
        ctaPrimary: {
            label: "Cotizar operación",
            href: "https://wa.me/5491155955269?text=Hola%2C%20quiero%20cotizar%20sourcing%20en%20China",
        },
        ctaSecondary: {
            label: "Hablar con un asesor",
            href: "https://wa.me/5491155955269",
        },
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
            {
                icon: Search,
                title: "Coordinación directa con proveedores en China",
                description:
                    "Buscamos y validamos proveedores que se ajusten a tu necesidad: producto, calidad, volumen y precio.",
            },
            {
                icon: ShieldCheck,
                title: "Validación comercial y de producto",
                description:
                    "Verificamos la seriedad del proveedor, solicitamos muestras y validamos especificaciones antes de comprar.",
            },
            {
                icon: Route,
                title: "Apoyo operativo desde el inicio",
                description:
                    "Ordenamos la operación desde la compra: coordinamos pagos, producción, control de calidad y preparación de carga.",
            },
            {
                icon: Clock,
                title: "Reducción de fricción y tiempos",
                description:
                    "Al coordinar desde origen, reducimos errores, demoras y costos innecesarios en la cadena.",
            },
            {
                icon: HeartHandshake,
                title: "Equipo local en China",
                description:
                    "Contamos con presencia en origen para inspecciones, negociaciones y seguimiento directo.",
            },
        ],
    },

    process: {
        eyebrow: "Cómo funciona",
        title: "El proceso paso a paso",
        steps: [
            {
                title: "Definición de necesidad y producto",
                description:
                    "Entendemos qué necesitás importar: tipo de producto, especificaciones, volumen estimado y presupuesto.",
            },
            {
                title: "Búsqueda y preselección de proveedores",
                description:
                    "Buscamos proveedores en China que se ajusten a tus requerimientos y te presentamos opciones validadas.",
            },
            {
                title: "Validación y negociación",
                description:
                    "Verificamos al proveedor, solicitamos muestras y negociamos condiciones comerciales favorables.",
            },
            {
                title: "Coordinación de compra y despacho",
                description:
                    "Una vez aprobado, coordinamos la producción, el control de calidad y la preparación de carga para envío.",
            },
        ],
    },

    idealFor: {
        eyebrow: "Ideal para",
        title: "¿Este servicio es para vos?",
        profiles: [
            {
                icon: Briefcase,
                label: "Importadores nuevos",
                description:
                    "Que quieren comprar en China por primera vez y necesitan guía profesional.",
            },
            {
                icon: Store,
                label: "Pymes y marcas propias",
                description:
                    "Que buscan proveedores confiables para fabricar o importar productos con su marca.",
            },
            {
                icon: ShoppingCart,
                label: "Ecommerce",
                description:
                    "Que necesitan encontrar proveedores competitivos para productos de reventa.",
            },
            {
                icon: TrendingUp,
                label: "Empresas en expansión",
                description:
                    "Que están diversificando sus fuentes de compra y necesitan presencia en China.",
            },
        ],
    },

    cta: {
        title: "Contanos qué necesitás encontrar en China",
        subtitle:
            "Te ayudamos a buscar, validar y coordinar proveedores. Escribinos con los detalles de tu producto.",
        ctaLabel: "Iniciar conversación",
        ctaHref: "https://wa.me/5491155955269?text=Hola%2C%20necesito%20sourcing%20en%20China",
    },
};

export default sourcingData;
