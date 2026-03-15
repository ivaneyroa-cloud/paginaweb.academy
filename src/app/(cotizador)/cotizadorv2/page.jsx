import CotizadorV2App from "@/features/cotizadorv2/CotizadorV2App";
import { getDatosCotizacion } from "@/features/cotizadorv2/actions";

export const metadata = {
  title: "Cotizador de Importación: Estimá costos, impuestos y flete",
  description:
    "Cotizá tu importación desde China, USA y Europa a Argentina. Calculamos CIF, aranceles, IVA aduanero, tasa estadística y flete para que sepas el costo real antes de comprar.",
  openGraph: {
    title: "Cotizador de Importación | Shippar",
    description:
      "Estimá el costo total de importar tu producto con impuestos, flete y aranceles incluidos. Herramienta gratuita.",
    url: "https://shippar.net/cotizadorv2",
    type: "website",
  },
  alternates: {
    canonical: "https://shippar.net/cotizadorv2",
  },
};

/* JSON-LD — WebApplication */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
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
  },
};

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
  // Obtener todas las tarifas, categorías y configuraciones de una vez
  const response = await getDatosCotizacion();

  // Si hubo un error catastrófico (ej: se cayeron las tarifas)
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

  // Pasar toda la data estructurada
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CotizadorV2App datosCotizacion={response.data} />
    </>
  );
}
