import CotizadorV2App from "@/features/cotizadorv2/CotizadorV2App";
import { getDatosCotizacion } from "@/features/cotizadorv2/actions";

export const metadata = {
  title: "Cotizador de Importación: Calculá CIF, Impuestos y Flete",
  description:
    "Estimá el costo total de importar desde China, USA y Europa a Argentina. El cotizador calcula valor CIF, aranceles, IVA aduanero, tasa estadística y flete internacional con tarifas reales de Shippar.",
  keywords: [
    "cotizador de importación",
    "calcular costo importación argentina",
    "valor CIF",
    "impuestos importar china",
    "aranceles importación",
    "IVA aduanero",
    "flete internacional argentina",
    "costo importar producto",
  ],
  openGraph: {
    title: "Cotizador de Importación | Shippar",
    description:
      "Estimá el costo total de importar tu producto con CIF, impuestos, flete y aranceles incluidos. Herramienta gratuita con tarifas reales.",
    url: "https://shippar.net/cotizadorv2",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cotizador de Importación | Shippar",
    description:
      "Calculá CIF, impuestos y flete para tu importación desde cualquier origen a Argentina.",
  },
  alternates: {
    canonical: "https://shippar.net/cotizadorv2",
  },
};

/* ── Structured Data ── */

/* SoftwareApplication (más específico que WebApplication) */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Cotizador de Importación — Shippar",
  description: metadata.description,
  url: "https://shippar.net/cotizadorv2",
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
    "Cálculo automático de valor CIF",
    "Derechos de importación por posición arancelaria",
    "IVA aduanero y percepciones",
    "Tasa estadística",
    "Flete internacional con tarifas reales",
    "Peso facturable volumétrico",
    "Desglose completo por concepto",
  ],
};

/* FAQPage */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es el valor FOB en una importación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOB (Free On Board) es el costo del producto puesto en el puerto o aeropuerto de origen. Incluye el precio de compra y los gastos hasta que la mercadería se carga en el transporte internacional. Es el punto de partida de cualquier cotización de importación.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el valor CIF y cómo se calcula?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CIF (Cost, Insurance and Freight) es el valor del producto puesto en el puerto o aeropuerto de destino. Se calcula como: CIF = FOB + Flete Internacional + Seguro. Es la base sobre la cual se calculan los impuestos de importación en Argentina.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el peso facturable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El peso facturable es el mayor entre el peso real (bruto) y el peso volumétrico de la carga. El peso volumétrico se calcula a partir del largo, ancho y alto de cada caja. Las aerolíneas y couriers cobran por el que sea mayor, porque un paquete grande pero liviano ocupa espacio de bodega.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué impuestos se pagan al importar a Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los principales son: derechos de importación (arancel según la posición arancelaria del producto), tasa estadística, IVA aduanero sobre la base imponible, IVA adicional y percepción de ganancias. Los porcentajes varían según el tipo de producto.",
      },
    },
    {
      "@type": "Question",
      name: "¿La cotización de Shippar es un precio final?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es una estimación detallada basada en tarifas generales vigentes y criterio aduanero real. El costo final puede variar según la posición arancelaria exacta, el tipo cambio al momento del despacho y condiciones específicas de la operación. Para una cotización comercial formal, podés solicitar una cuenta preferencial.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo usar el resultado para calcular mi precio de venta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El costo total de importación que arroja el cotizador se puede transferir directamente a la calculadora de rentabilidad de Shippar, donde podés calcular margen, ROI y punto de equilibrio por unidad.",
      },
    },
  ],
};

/* BreadcrumbList */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Shippar", item: "https://shippar.net" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://shippar.net/tools" },
    { "@type": "ListItem", position: 3, name: "Cotizador de Importación", item: "https://shippar.net/cotizadorv2" },
  ],
};

export default async function CotizadorV2Page() {
  const response = await getDatosCotizacion();

  if (!response.success) {
    return (
      <main className="min-h-screen p-4 py-14 lg:py-18">
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">{response.error}</p>
          <p className="text-red-600 text-sm mt-2">Por favor, intenta nuevamente más tarde.</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CotizadorV2App datosCotizacion={response.data} />
    </>
  );
}
