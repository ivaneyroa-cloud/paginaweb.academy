import ToolsContent from "./ToolsContent";

export const metadata = {
  title: "Calculá tu Importación y Analizá Rentabilidad — Herramientas Gratuitas",
  description:
    "Estimá el costo total de importar desde China, USA y Europa a Argentina con impuestos y aranceles incluidos. Calculá tu margen de ganancia, ROI y punto de equilibrio. Herramientas gratuitas de Shippar.",
  openGraph: {
    title: "Herramientas para Importadores | Shippar",
    description:
      "Estimá costos, impuestos y rentabilidad de tu importación con las herramientas gratuitas de Shippar.",
    url: "https://shippar.net/tools",
    type: "website",
  },
  alternates: {
    canonical: "https://shippar.net/tools",
  },
};

/* JSON-LD — WebPage + FAQPage */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Herramientas para Importadores — Shippar",
  description: metadata.description,
  url: "https://shippar.net/tools",
  creator: {
    "@type": "Organization",
    name: "Shippar Global Logistics",
    url: "https://shippar.net",
  },
  hasPart: [
    {
      "@type": "WebApplication",
      name: "Cotizador de Importación",
      url: "https://shippar.net/cotizadorv2",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "WebApplication",
      name: "Calculadora de Rentabilidad",
      url: "https://shippar.net/calculadora",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo calculo el costo total de una importación a Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con el cotizador de Shippar podés estimar el costo completo de tu importación. Seleccioná origen, destino, producto y cantidad. El sistema calcula automáticamente CIF, aranceles, IVA aduanero, tasa estadística, flete internacional y seguro.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué impuestos se pagan al importar mercadería a Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los principales impuestos son: derechos de importación (arancel según posición arancelaria), tasa estadística, IVA aduanero (sobre base imponible que incluye CIF + derechos), IVA adicional y percepción de ganancias. El porcentaje varía según el tipo de producto y el régimen aplicable.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta importar un producto desde China a Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El costo depende del peso, volumen, valor del producto y modalidad de envío. Con el cotizador de Shippar podés estimar el costo real en minutos ingresando los datos de tu producto. Incluye flete internacional, seguro, impuestos y tasas aduaneras.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo sé si mi importación es rentable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Usá la calculadora de rentabilidad de Shippar. Ingresá el costo de producto + importación, tu precio de venta y las comisiones de tu canal. El sistema calcula tu ganancia neta, margen, ROI y punto de equilibrio por unidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Las cotizaciones incluyen envío puerta a puerta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las cotizaciones se basan en tarifas generales de Shippar que incluyen flete internacional y gestión. El alcance del servicio (puerta a puerta, puerto a puerta, etc.) depende de la modalidad seleccionada. Para condiciones personalizadas, podés solicitar una cuenta preferencial.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Shippar", item: "https://shippar.net" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://shippar.net/tools" },
  ],
};

export default function ToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ToolsContent />
    </>
  );
}