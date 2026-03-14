/**
 * Componente que se utiliza como encabezado del cotizador, mostrando el título y una breve descripción.
 */

// Icons
import { FaTruckPlane } from "react-icons/fa6";

export default function CotizadorHeader() {
  return (
    <div className="mb-8 p-6 rounded-2xl shadow-lg border border-sky-200/60 bg-white">
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between text-center sm:text-left">
        {/* Título con ícono */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="flex-shrink-0 bg-sky-100 text-sky-700 rounded-lg p-3">
            {/* Icono de importaciones/envío */}
            <FaTruckPlane size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sky-900 tracking-tight">
              Cotizador de Importaciones
            </h1>
            <p className="mt-2 sm:mt-1 max-w-lg">
              En Shippar desarrollamos este cotizador para que puedas calcular
              fácilmente los costos asociados a tus importaciones desde China.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
