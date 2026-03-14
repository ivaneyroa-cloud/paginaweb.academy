import CotizadorV2App from "@/features/cotizadorv2/CotizadorV2App";
import { getDatosCotizacion } from "@/features/cotizadorv2/actions";

export const metadata = {
  title: "Cotizador V2 - Shippar",
  description: "Cotizador de Importaciones V2 con cálculo en cascada basado en Valor CIF",
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
  return <CotizadorV2App datosCotizacion={response.data} />;
}
