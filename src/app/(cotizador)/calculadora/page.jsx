import CalculadoraApp from "@/features/calculadora/CalculadoraApp";

export const metadata = {
  title: "Calculadora de Rentabilidad para Importadores",
  description:
    "Calculá tu margen de ganancia, ROI y punto de equilibrio al importar y revender. Ingresá costos reales y obtené un análisis por unidad. Herramienta gratuita de Shippar.",
  openGraph: {
    title: "Calculadora de Rentabilidad para Importadores | Shippar",
    description:
      "Analizá margen, ROI y ganancia neta por unidad al importar y revender productos desde China, USA y Europa.",
    url: "https://shippar.net/calculadora",
    type: "website",
  },
  alternates: {
    canonical: "https://shippar.net/calculadora",
  },
};

/* JSON-LD — WebApplication */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Rentabilidad — Shippar",
  description: metadata.description,
  url: "https://shippar.net/calculadora",
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
  },
};

/* JSON-LD — FAQPage */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo calculo mi margen de ganancia al importar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ingresá el costo del producto, el costo de importación (flete Shippar), tu precio de venta y las comisiones que aplican en tu canal. La calculadora te muestra automáticamente la ganancia neta por unidad, el margen sobre ingresos y el ROI sobre tu inversión.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el punto de equilibrio en una importación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es el precio mínimo al que tenés que vender para cubrir todos tus costos y no perder plata. La calculadora lo compara con tu precio de venta y te dice cuánto margen tenés por encima de ese piso.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué costos debo incluir para calcular la rentabilidad real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Como mínimo: el costo del producto y el costo de importación. Para mayor precisión, incluí comisiones de plataforma (ML, Tienda Nube), comisiones de medio de pago, costo por cuotas, impuestos sobre la venta (IIBB, retenciones) y el costo de envío si lo absorbés vos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto margen necesito para que mi importación sea rentable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de tu operación, pero como regla general un margen neto del 20-30% sobre precio de venta es un piso razonable para cubrir imprevistos y generar ganancia sostenible. La calculadora te muestra el margen exacto para que tomes la decisión con datos reales.",
      },
    },
  ],
};

/* JSON-LD — BreadcrumbList */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Shippar", item: "https://shippar.net" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://shippar.net/tools" },
    { "@type": "ListItem", position: 3, name: "Calculadora de Rentabilidad", item: "https://shippar.net/calculadora" },
  ],
};

export default function CalculadoraPage() {
  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section>
        <CalculadoraApp />
      </section>
    </>
  );
}