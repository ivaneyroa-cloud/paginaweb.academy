import CalculadoraApp from "@/features/calculadora/CalculadoraApp";

export const metadata = {
  title: "Calculadora de Rentabilidad: Margen, ROI y Punto de Equilibrio",
  description:
    "Calculá la ganancia neta, margen sobre ingresos, ROI y punto de equilibrio de tu importación. Ingresá costos reales, comisiones y precio de venta — y tomá decisiones con datos. Herramienta gratuita de Shippar.",
  keywords: [
    "calculadora de rentabilidad importación",
    "margen de ganancia importar",
    "ROI importación",
    "punto de equilibrio producto importado",
    "ganancia neta por unidad",
    "calcular margen venta importación",
    "rentabilidad importar desde china",
  ],
  openGraph: {
    title: "Calculadora de Rentabilidad para Importadores | Shippar",
    description:
      "Analizá margen, ROI, ganancia neta y punto de equilibrio por unidad al importar y revender. Herramienta gratuita.",
    url: "https://shippar.net/calculadora-rentabilidad",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Calculadora de Rentabilidad | Shippar",
    description:
      "Calculá tu ganancia neta, margen y ROI al importar y revender productos. Gratis.",
  },
  alternates: {
    canonical: "https://shippar.net/calculadora-rentabilidad",
  },
};

/* ── SoftwareApplication ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calculadora de Rentabilidad — Shippar",
  description: metadata.description,
  url: "https://shippar.net/calculadora-rentabilidad",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Shippar Global Logistics",
    url: "https://shippar.net",
    logo: "https://shippar.net/shippar-icon.png",
  },
  featureList: [
    "Ganancia neta por unidad",
    "Margen sobre ingresos",
    "ROI sobre inversión",
    "Punto de equilibrio (precio mínimo de venta)",
    "Proyección de ganancia por volumen",
    "Comisiones de plataforma y medio de pago",
    "Impuestos sobre la venta (IIBB, retenciones)",
    "Transferencia directa desde cotizador de importación",
  ],
};

/* ── FAQPage ── */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo calculo mi margen de ganancia al importar y revender?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ingresá el costo del producto, el costo de importación (flete, impuestos, aranceles), tu precio de venta y las comisiones de tu canal. La calculadora resta todos los costos y te muestra la ganancia neta por unidad, el margen sobre ingresos y el ROI sobre tu inversión total.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el punto de equilibrio en una importación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es el precio mínimo al que tenés que vender cada unidad para cubrir todos tus costos (producto + importación + comisiones + impuestos) y no perder plata. Cualquier precio por encima genera ganancia; por debajo genera pérdida.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el ROI y cómo se calcula para una importación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ROI (Return on Investment) mide cuánto ganás en relación a lo que invertiste. Se calcula como: ROI = (Ganancia Neta / Inversión Total) × 100. Un ROI del 50% significa que por cada USD 100 invertidos, ganás USD 50 netos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué costos debo incluir para calcular la rentabilidad real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Como mínimo: costo del producto y costo de importación (CIF + impuestos). Para mayor precisión, sumá comisiones de plataforma (ML, Tienda Nube), comisiones de medio de pago, costo por ofrecer cuotas, impuestos sobre ventas (IIBB, retenciones) y costo de envío al comprador si lo absorbés vos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto margen necesito para que mi importación sea rentable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de tu operación, pero como referencia: un margen neto del 20-30% sobre precio de venta suele ser un piso razonable para absorber imprevistos (tipo de cambio, devoluciones, stock) y generar ganancia sostenible.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo transferir datos del cotizador a esta calculadora?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Si cotizaste tu importación con el cotizador de Shippar, podés transferir el costo total de importación directamente a la calculadora de rentabilidad. Esto te ahorra cargar los datos manualmente y te da un flujo continuo de cotizar → analizar → decidir.",
      },
    },
  ],
};

/* ── BreadcrumbList ── */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Shippar", item: "https://shippar.net" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://shippar.net/herramientas" },
    { "@type": "ListItem", position: 3, name: "Calculadora de Rentabilidad", item: "https://shippar.net/calculadora-rentabilidad" },
  ],
};

export default function CalculadoraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CalculadoraApp />
    </>
  );
}