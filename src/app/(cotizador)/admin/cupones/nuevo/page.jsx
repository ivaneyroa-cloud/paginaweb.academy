import { getTarifasInternacionales, getConfiguraciones } from '@/features/admin/tarifas/actions';
import { CuponForm } from '@/features/admin/cupones/components/CuponForm';
import { FiTag } from 'react-icons/fi';

export const metadata = { title: 'Crear Cupón - Shippar' };

export default async function NuevoCuponPage() {
  const [tarifas, configuraciones] = await Promise.all([
    getTarifasInternacionales(),
    getConfiguraciones(),
  ]);

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiTag className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Crear Nuevo Cupón</h1>
        </div>
        <p className="text-slate-600 ml-14">
          Configura el código y porcentaje de descuento. El simulador calcula el precio VIP en tiempo real.
        </p>
      </div>

      <CuponForm
        tarifasInternacionales={Array.isArray(tarifas) ? tarifas : []}
        recargoFuel={configuraciones?.recargo_fuel ?? 0}
      />
    </>
  );
}
